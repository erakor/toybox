import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertLifecycle,
  AlertSeverity,
  type BreakerChannel,
  type DispatchLogEntry,
  INITIAL_ALERTS,
  INITIAL_DISPATCHES,
  INITIAL_MACHINES,
  MachineStatus,
  type MachineUnit,
  type MaintenanceAlert,
  PowerPreset,
  ShiftGear,
  type TelemetryPoint,
  buildBreakers,
  buildInitialHistory,
  clamp,
  formatClock,
} from '@erakor/toybox'

const PRESET_MODIFIERS: Record<
  PowerPreset,
  { powerFactor: number; efficiencyDelta: number; regenBonus: number; tempDelta: number }
> = {
  [PowerPreset.EcoBalance]: {
    powerFactor: 0.88,
    efficiencyDelta: 1.4,
    regenBonus: 14,
    tempDelta: -3.2,
  },
  [PowerPreset.NominalRun]: { powerFactor: 1.0, efficiencyDelta: 0.0, regenBonus: 0, tempDelta: 0 },
  [PowerPreset.PeakBoost]: {
    powerFactor: 1.18,
    efficiencyDelta: 2.1,
    regenBonus: -8,
    tempDelta: 5.8,
  },
  [PowerPreset.CoolantFlush]: {
    powerFactor: 0.94,
    efficiencyDelta: -0.6,
    regenBonus: 4,
    tempDelta: -7.5,
  },
  [PowerPreset.HarmonicSync]: {
    powerFactor: 0.97,
    efficiencyDelta: 1.8,
    regenBonus: 9,
    tempDelta: -1.1,
  },
  [PowerPreset.LoadShed]: {
    powerFactor: 0.72,
    efficiencyDelta: -2.4,
    regenBonus: 18,
    tempDelta: -5.4,
  },
}

const GEAR_MODIFIERS: Record<
  ShiftGear,
  { powerFactor: number; rpmFactor: number; regenBonus: number; label: string }
> = {
  [ShiftGear.Park]: { powerFactor: 0.24, rpmFactor: 0.2, regenBonus: 2, label: 'Park Standby' },
  [ShiftGear.Reverse]: {
    powerFactor: 0.78,
    rpmFactor: 0.85,
    regenBonus: 22,
    label: 'Regen Backflush',
  },
  [ShiftGear.Neutral]: { powerFactor: 0.62, rpmFactor: 0.65, regenBonus: 8, label: 'Neutral Idle' },
  [ShiftGear.Drive]: { powerFactor: 1.0, rpmFactor: 1.0, regenBonus: 0, label: 'Drive Nominal' },
  [ShiftGear.Low]: { powerFactor: 1.2, rpmFactor: 1.12, regenBonus: -4, label: 'Low-Gear Torque' },
}

export function useFactoryTelemetry() {
  const [machines, setMachines] = useState<MachineUnit[]>(INITIAL_MACHINES)
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(INITIAL_ALERTS)
  const [history, setHistory] = useState<TelemetryPoint[]>(buildInitialHistory)
  const [isStreaming, setIsStreaming] = useState(true)
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2>(1)
  const [activePreset, setActivePreset] = useState<PowerPreset>(PowerPreset.NominalRun)
  const [shiftGear, setShiftGear] = useState<ShiftGear>(ShiftGear.Drive)
  const [loadBias, setLoadBias] = useState<number>(52)
  const [harmonicTrim, setHarmonicTrim] = useState<number>(64)
  const [surgeActive, setSurgeActive] = useState<boolean>(false)
  const [bayLightsOn, setBayLightsOn] = useState<boolean>(true)
  const [coolantPurgeOn, setCoolantPurgeOn] = useState<boolean>(false)
  const [hornActive, setHornActive] = useState<boolean>(false)
  const [peakThresholdKw, setPeakThresholdKw] = useState<number>(480)
  const [shiftKwh, setShiftKwh] = useState<number>(3842.6)
  const [shiftUnits, setShiftUnits] = useState<number>(53841)
  const [hopperPct, setHopperPct] = useState<number>(68.4)
  const [completedBatches, setCompletedBatches] = useState<number>(14)
  const [shiftElapsedSec, setShiftElapsedSec] = useState<number>(15430)
  const [dispatchLogs, setDispatchLogs] = useState<DispatchLogEntry[]>(INITIAL_DISPATCHES)

  const tickCounterRef = useRef(31)
  const alertSeqRef = useRef(409)
  const dispatchSeqRef = useRef(103)
  const hornTimeoutRef = useRef<number | null>(null)

  const breakers: BreakerChannel[] = useMemo(() => buildBreakers(machines), [machines])

  useEffect(() => {
    if (!isStreaming) return
    const intervalMs = speedMultiplier === 2 ? 650 : 1200

    const timer = window.setInterval(() => {
      const tick = tickCounterRef.current++
      const mod = PRESET_MODIFIERS[activePreset]
      const gearMod = GEAR_MODIFIERS[shiftGear]
      const biasFactor = 0.9 + (loadBias / 100) * 0.2
      const surgeFactor = surgeActive ? 1.15 : 1.0
      const purgeCooling = coolantPurgeOn ? -6.5 : 0
      const lightLoadKw = bayLightsOn ? 1.8 : 0

      setShiftElapsedSec((s) => s + (speedMultiplier === 2 ? 2 : 1))

      setMachines((prev) => {
        const updated = prev.map((m, index) => {
          if (!m.active) {
            const cooledTemp = clamp(m.temperatureC - 0.8, 24, 95)
            const nextHist = [...m.efficiencyHistory.slice(1), 0]
            return {
              ...m,
              status: MachineStatus.Standby,
              powerKw: 0,
              actualRpm: 0,
              throughputUnitsHr: 0,
              temperatureC: Number(cooledTemp.toFixed(1)),
              pressurePsi: Number(clamp(m.pressurePsi - 2.5, 14.7, 120).toFixed(1)),
              vibrationMmS: 0.1,
              efficiencyHistory: nextHist,
            }
          }

          const phase = tick * 0.42 + index * 1.1
          const jitter = Math.sin(phase) * 0.6 + (Math.random() - 0.5) * 0.4

          const basePowers = [112, 84, 76, 68, 54, 32]
          const baseRpms = [1800, 1450, 1600, 1200, 1350, 900]
          const rpmRatio = (m.targetRpm * gearMod.rpmFactor) / baseRpms[index]
          const faultPenalty =
            m.status === MachineStatus.Critical
              ? 14.5
              : m.status === MachineStatus.Warning
                ? 5.2
                : 0

          const nextOee = clamp(
            93.5 -
              faultPenalty +
              mod.efficiencyDelta +
              jitter -
              (rpmRatio > 1.12 ? (rpmRatio - 1.12) * 28 : 0),
            54,
            99.4,
          )
          const nextPower = clamp(
            basePowers[index] *
              rpmRatio *
              mod.powerFactor *
              gearMod.powerFactor *
              biasFactor *
              surgeFactor +
              Math.sin(phase) * 2.4 +
              (index === 0 ? lightLoadKw : 0),
            6,
            175,
          )
          const nextRpm = Math.round(
            m.targetRpm *
              gearMod.rpmFactor *
              (m.status === MachineStatus.Critical
                ? 0.86
                : m.status === MachineStatus.Warning
                  ? 0.95
                  : 0.996) +
              Math.sin(phase) * 6,
          )
          const nextTemp = clamp(
            48 +
              index * 2.1 +
              mod.tempDelta +
              purgeCooling +
              (rpmRatio - 1) * 18 +
              (m.status === MachineStatus.Warning
                ? 12
                : m.status === MachineStatus.Critical
                  ? 22
                  : 0) +
              jitter * 0.5,
            28,
            98,
          )
          const nextPsi = clamp(
            62 +
              index * 3.5 +
              (m.status === MachineStatus.Warning
                ? 24
                : m.status === MachineStatus.Critical
                  ? 34
                  : 0) +
              Math.cos(phase) * 1.9,
            25,
            120,
          )
          const nextVib = clamp(
            1.1 +
              (rpmRatio - 1) * 1.4 +
              (m.status === MachineStatus.Warning
                ? 2.4
                : m.status === MachineStatus.Critical
                  ? 4.3
                  : 0) +
              Math.abs(Math.sin(phase)) * 0.25,
            0.3,
            8.5,
          )
          const nextThroughput = Math.max(
            0,
            Math.round((nextOee / 100) * (baseRpms[index] / 4.2) * rpmRatio),
          )

          let derivedStatus = m.status
          if (nextTemp > 82 || nextPsi > 106 || nextVib > 5.2) {
            derivedStatus = MachineStatus.Critical
          } else if (nextTemp > 65 || nextPsi > 92 || nextVib > 3.2) {
            derivedStatus = MachineStatus.Warning
          } else {
            derivedStatus = MachineStatus.Optimal
          }

          return {
            ...m,
            status: derivedStatus,
            oee: Number(nextOee.toFixed(1)),
            availability: Number(
              clamp(97.5 - faultPenalty * 0.45 + jitter * 0.2, 72, 99.8).toFixed(1),
            ),
            performance: Number(
              clamp(96.0 - faultPenalty * 0.35 + jitter * 0.3, 68, 99.5).toFixed(1),
            ),
            quality: Number(clamp(99.2 - faultPenalty * 0.1 + jitter * 0.05, 94, 99.9).toFixed(1)),
            powerKw: Number(nextPower.toFixed(1)),
            actualRpm: nextRpm,
            temperatureC: Number(nextTemp.toFixed(1)),
            pressurePsi: Number(nextPsi.toFixed(1)),
            vibrationMmS: Number(nextVib.toFixed(1)),
            throughputUnitsHr: nextThroughput,
            serviceHoursLeft: Number(clamp(m.serviceHoursLeft - 0.01, 0, 250).toFixed(1)),
            efficiencyHistory: [...m.efficiencyHistory.slice(1), Number(nextOee.toFixed(1))],
          }
        })

        const activeList = updated.filter((u) => u.active)
        const totalPowerKw = Number(updated.reduce((acc, u) => acc + u.powerKw, 0).toFixed(1))
        const totalThroughput = updated.reduce((acc, u) => acc + u.throughputUnitsHr, 0)
        const fleetOee = activeList.length
          ? Number((activeList.reduce((acc, u) => acc + u.oee, 0) / activeList.length).toFixed(1))
          : 0
        const regenKw = Number(
          clamp(
            54 +
              mod.regenBonus +
              gearMod.regenBonus +
              Math.sin(tick * 0.3) * 5.2 +
              (surgeActive ? -10 : 0),
            12,
            115,
          ).toFixed(1),
        )
        const avgTemp = activeList.length
          ? Number(
              (activeList.reduce((acc, u) => acc + u.temperatureC, 0) / activeList.length).toFixed(
                1,
              ),
            )
          : 28
        const avgPsi = activeList.length
          ? Number(
              (activeList.reduce((acc, u) => acc + u.pressurePsi, 0) / activeList.length).toFixed(
                1,
              ),
            )
          : 15

        setShiftKwh((k) => Number((k + totalPowerKw / 3600).toFixed(1)))
        setShiftUnits((u) => u + Math.max(1, Math.round(totalThroughput / 950)))
        setHopperPct((h) => {
          const next = h + totalThroughput / 2800
          if (next >= 100) {
            setCompletedBatches((b) => b + 1)
            return 12.0
          }
          return Number(next.toFixed(1))
        })

        const harmonicDamp = (harmonicTrim / 100) * 0.65

        setHistory((prevHist) => {
          const prevBattery = prevHist[prevHist.length - 1]?.batteryPct ?? 84
          const batteryDelta = surgeActive ? -0.35 : (regenKw - totalPowerKw * 0.12) * 0.015
          const nextBattery = Number(clamp(prevBattery + batteryDelta, 18, 99.5).toFixed(1))
          const nextPoint: TelemetryPoint = {
            timestamp: formatClock(new Date()),
            tick,
            fleetOee,
            totalPowerKw,
            regenKw,
            netGridKw: Number((totalPowerKw - regenKw).toFixed(1)),
            batteryPct: nextBattery,
            gridHz: Number(
              (60.0 + Math.sin(tick * 0.5) * 0.06 + (surgeActive ? -0.09 : 0)).toFixed(2),
            ),
            coolantTempC: avgTemp,
            conduitPsi: avgPsi,
            busVoltageV: Number(
              (480 + Math.cos(tick * 0.4) * 1.8 - (surgeActive ? 4.2 : 0)).toFixed(1),
            ),
            harmonicDistortionPct: Number(
              clamp(
                2.2 +
                  (activePreset === PowerPreset.HarmonicSync ? -0.7 : 0.3) -
                  harmonicDamp +
                  Math.abs(Math.sin(tick * 0.3)) * 0.5,
                0.7,
                5.4,
              ).toFixed(2),
            ),
          }
          return [...prevHist.slice(1), nextPoint]
        })

        return updated
      })
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [
    isStreaming,
    speedMultiplier,
    activePreset,
    shiftGear,
    loadBias,
    harmonicTrim,
    surgeActive,
    bayLightsOn,
    coolantPurgeOn,
  ])

  const toggleStream = useCallback(() => setIsStreaming((s) => !s), [])
  const toggleBayLights = useCallback(() => setBayLightsOn((v) => !v), [])
  const toggleCoolantPurge = useCallback(() => setCoolantPurgeOn((v) => !v), [])

  const toggleBreaker = useCallback((machineId: string) => {
    setMachines((prev) => prev.map((m) => (m.id === machineId ? { ...m, active: !m.active } : m)))
  }, [])

  const adjustMachineTarget = useCallback((machineId: string, targetRpm: number) => {
    setMachines((prev) => prev.map((m) => (m.id === machineId ? { ...m, targetRpm } : m)))
  }, [])

  const triggerSurgeTest = useCallback(() => {
    setSurgeActive((prev) => !prev)
  }, [])

  const tipHopperBatch = useCallback(() => {
    setCompletedBatches((b) => b + 1)
    setHopperPct(8.0)
    setDispatchLogs((prev) => [
      {
        id: `DSP-${dispatchSeqRef.current++}`,
        time: formatClock(new Date()),
        targetCode: 'BIN',
        message: 'Manual hopper dump completed — batch logged',
      },
      ...prev.slice(0, 5),
    ])
  }, [])

  const honkHorn = useCallback(() => {
    setHornActive(true)
    if (hornTimeoutRef.current) window.clearTimeout(hornTimeoutRef.current)
    hornTimeoutRef.current = window.setTimeout(() => setHornActive(false), 1800)

    setAlerts((prev) =>
      prev.map((a) =>
        a.lifecycle === AlertLifecycle.Open ? { ...a, lifecycle: AlertLifecycle.Acknowledged } : a,
      ),
    )
    setDispatchLogs((prev) => [
      {
        id: `DSP-${dispatchSeqRef.current++}`,
        time: formatClock(new Date()),
        targetCode: 'HORN',
        message: 'Console horn sounded — open alarms acknowledged',
      },
      ...prev.slice(0, 5),
    ])
  }, [])

  const sendIntercomDispatch = useCallback((machineId: string, message: string) => {
    const techs = ['M. Lindqvist', 'K. Sato', 'R. Morales', 'E. Kowalski']
    const picked = techs[dispatchSeqRef.current % techs.length]
    const code = machineId.toUpperCase()

    setAlerts((prev) =>
      prev.map((a) =>
        a.machineId === machineId && a.lifecycle !== AlertLifecycle.Resolved
          ? { ...a, lifecycle: AlertLifecycle.Dispatched, assignedTech: a.assignedTech ?? picked }
          : a,
      ),
    )
    setDispatchLogs((prev) => [
      {
        id: `DSP-${dispatchSeqRef.current++}`,
        time: formatClock(new Date()),
        targetCode: code,
        message: `${picked}: ${message}`,
      },
      ...prev.slice(0, 5),
    ])
  }, [])

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId && a.lifecycle === AlertLifecycle.Open
          ? { ...a, lifecycle: AlertLifecycle.Acknowledged }
          : a,
      ),
    )
  }, [])

  const dispatchTech = useCallback((alertId: string) => {
    const techs = ['M. Lindqvist', 'K. Sato', 'R. Morales', 'E. Kowalski']
    const picked = techs[alertSeqRef.current % techs.length]
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, lifecycle: AlertLifecycle.Dispatched, assignedTech: a.assignedTech ?? picked }
          : a,
      ),
    )
  }, [])

  const resolveAlert = useCallback((alertId: string) => {
    let targetMachineId: string | null = null
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          targetMachineId = a.machineId
          return { ...a, lifecycle: AlertLifecycle.Resolved }
        }
        return a
      }),
    )
    if (targetMachineId) {
      setMachines((prev) =>
        prev.map((m) =>
          m.id === targetMachineId
            ? {
                ...m,
                status: MachineStatus.Optimal,
                temperatureC: 49.5,
                pressurePsi: 66.0,
                vibrationMmS: 1.2,
                serviceHoursLeft: 200.0,
              }
            : m,
        ),
      )
    }
  }, [])

  const injectFault = useCallback(() => {
    const seq = alertSeqRef.current++
    const candidates = [
      {
        machineId: 'rd-04',
        machineName: 'RD-04 · Crimson Gear Rotor',
        title: 'Gear Tooth Harmonic Vibration Spike',
        detail: 'Tri-axial accelerometer registered 5.6 mm/s oscillation on drive base stud.',
        severity: AlertSeverity.Critical,
        metricLabel: 'Vibration',
        metricValue: '5.6 mm/s',
      },
      {
        machineId: 'wh-05',
        machineName: 'WH-05 · White Pipe Extruder',
        title: 'Cylinder Feed Thermal Excursion',
        detail: 'Twin white intake manifold exceeded 84°C continuous rating during peak load.',
        severity: AlertSeverity.Critical,
        metricLabel: 'Core Temp',
        metricValue: '84.4 °C',
      },
      {
        machineId: 'mn-06',
        machineName: 'MN-06 · Kinetic Figure Scanner',
        title: 'Optical Reticle Drift Detected',
        detail: 'Purple laser alignment beam detected +4.8 mm lateral offset in motion bay.',
        severity: AlertSeverity.Warning,
        metricLabel: 'Beam Offset',
        metricValue: '4.8 mm',
      },
    ]
    const picked = candidates[seq % candidates.length]

    setMachines((prev) =>
      prev.map((m) =>
        m.id === picked.machineId
          ? {
              ...m,
              active: true,
              status:
                picked.severity === AlertSeverity.Critical
                  ? MachineStatus.Critical
                  : MachineStatus.Warning,
              temperatureC: picked.severity === AlertSeverity.Critical ? 84.4 : 68.2,
              pressurePsi: picked.severity === AlertSeverity.Critical ? 108.5 : 94.0,
              vibrationMmS: picked.severity === AlertSeverity.Critical ? 5.6 : 3.7,
            }
          : m,
      ),
    )

    const newAlert: MaintenanceAlert = {
      id: `ALT-${seq}`,
      machineId: picked.machineId,
      machineName: picked.machineName,
      title: picked.title,
      detail: picked.detail,
      severity: picked.severity,
      lifecycle: AlertLifecycle.Open,
      metricLabel: picked.metricLabel,
      metricValue: picked.metricValue,
      createdAt: 'Just now',
      assignedTech: null,
    }

    setAlerts((prev) => [newAlert, ...prev])
  }, [])

  const resetStation = useCallback(() => {
    setMachines(INITIAL_MACHINES)
    setAlerts(INITIAL_ALERTS)
    setActivePreset(PowerPreset.NominalRun)
    setShiftGear(ShiftGear.Drive)
    setLoadBias(52)
    setHarmonicTrim(64)
    setPeakThresholdKw(480)
    setSurgeActive(false)
    setBayLightsOn(true)
    setCoolantPurgeOn(false)
    setHopperPct(68.4)
    setCompletedBatches(14)
    setDispatchLogs(INITIAL_DISPATCHES)
  }, [])

  const latest = history[history.length - 1]
  const openAlerts = useMemo(
    () => alerts.filter((a) => a.lifecycle !== AlertLifecycle.Resolved),
    [alerts],
  )

  return {
    machines,
    alerts,
    openAlerts,
    history,
    latest,
    breakers,
    isStreaming,
    speedMultiplier,
    activePreset,
    shiftGear,
    loadBias,
    harmonicTrim,
    surgeActive,
    bayLightsOn,
    coolantPurgeOn,
    hornActive,
    peakThresholdKw,
    shiftKwh,
    shiftUnits,
    hopperPct,
    completedBatches,
    shiftElapsedSec,
    dispatchLogs,
    toggleStream,
    setSpeedMultiplier,
    setActivePreset,
    setShiftGear,
    setLoadBias,
    setHarmonicTrim,
    setPeakThresholdKw,
    toggleBreaker,
    toggleBayLights,
    toggleCoolantPurge,
    adjustMachineTarget,
    triggerSurgeTest,
    tipHopperBatch,
    honkHorn,
    sendIntercomDispatch,
    acknowledgeAlert,
    dispatchTech,
    resolveAlert,
    injectFault,
    resetStation,
  }
}
