import React from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2, Palette, Volume2, Wrench } from 'lucide-react'
import { useStationTheme } from '../../context/ThemeContext'
import {
  AlertSeverity,
  type BreakerChannel,
  DashboardTab,
  type DispatchLogEntry,
  MachineStatus,
  type MachineUnit,
  type MaintenanceAlert,
  type PowerPreset,
  type ShiftGear,
  type TelemetryPoint,
} from '../../types/factory'
import { StationThemeId } from '../../types/theme'
import { AnalogDialGauge } from '../instruments/AnalogDialGauge'
import { BatterySunburstCore } from '../instruments/BatterySunburstCore'
import { CockpitDriveCluster } from '../instruments/CockpitDriveCluster'
import { HopperCrewPanel } from '../instruments/HopperCrewPanel'
import { IntercomDispatchPanel } from '../instruments/IntercomDispatchPanel'
import { MatrixKeypad } from '../instruments/MatrixKeypad'
import { OscilloscopePanel } from '../instruments/OscilloscopePanel'
import { SilhouetteScanner } from '../instruments/SilhouetteScanner'
import { TunerClockPanel } from '../instruments/TunerClockPanel'
import { EnergyFlowChart } from '../charts/EnergyFlowChart'

interface PowerStationViewProps {
  machines: MachineUnit[]
  latest: TelemetryPoint
  history: TelemetryPoint[]
  breakers: BreakerChannel[]
  openAlerts: MaintenanceAlert[]
  activePreset: PowerPreset
  shiftGear: ShiftGear
  loadBias: number
  harmonicTrim: number
  surgeActive: boolean
  bayLightsOn: boolean
  coolantPurgeOn: boolean
  hornActive: boolean
  peakThresholdKw: number
  shiftKwh: number
  shiftUnits: number
  hopperPct: number
  completedBatches: number
  shiftElapsedSec: number
  dispatchLogs: DispatchLogEntry[]
  onSelectPreset: (p: PowerPreset) => void
  onSelectGear: (gear: ShiftGear) => void
  onChangeLoadBias: (val: number) => void
  onChangePeakThreshold: (val: number) => void
  onChangeHarmonicTrim: (val: number) => void
  onToggleBreaker: (machineId: string) => void
  onToggleBayLights: () => void
  onToggleCoolantPurge: () => void
  onToggleSurge: () => void
  onTipHopperBatch: () => void
  onHonkHorn: () => void
  onSendDispatch: (machineId: string, note: string) => void
  onResolveAlert: (id: string) => void
  onNavigateTab: (tab: DashboardTab) => void
}

export const PowerStationView: React.FC<PowerStationViewProps> = ({
  machines,
  latest,
  history,
  breakers,
  openAlerts,
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
  onSelectPreset,
  onSelectGear,
  onChangeLoadBias,
  onChangePeakThreshold,
  onChangeHarmonicTrim,
  onToggleBreaker,
  onToggleBayLights,
  onToggleCoolantPurge,
  onToggleSurge,
  onTipHopperBatch,
  onHonkHorn,
  onSendDispatch,
  onResolveAlert,
  onNavigateTab,
}) => {
  const { theme, setThemeId, allThemes } = useStationTheme()
  const scannerMachine = machines.find((m) => m.id === 'mn-06') ?? machines[0]
  const primaryCore = machines.find((m) => m.id === 'ps-01') ?? machines[0]
  const criticalCount = openAlerts.filter((a) => a.severity === AlertSeverity.Critical).length
  const activeCount = machines.filter((m) => m.active).length

  const isLineless = theme.id === StationThemeId.LinelessBlocks
  const isCockpit = theme.id === StationThemeId.CockpitHorn
  const isDumpCab = theme.id === StationThemeId.DumpCab
  const sirenLit = criticalCount > 0 || hornActive
  const subpanelFrame = `bv-subpanel rounded-2xl border-[3px] bv-border`

  const spectralBars = [
    { label: 'Core', value: machines[0]?.powerKw ?? 0, color: 'bg-blue-500' },
    { label: 'Press', value: machines[1]?.powerKw ?? 0, color: 'bg-cyan-400' },
    { label: 'Pump', value: machines[2]?.powerKw ?? 0, color: 'bg-pink-400' },
    { label: 'Rotor', value: machines[3]?.powerKw ?? 0, color: 'bg-purple-500' },
  ]
  const maxBarKw = 150

  /* Reusable Core + Toy Instrument Pods */
  const matrixPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full`}>
      <MatrixKeypad
        activePreset={activePreset}
        onSelectPreset={onSelectPreset}
        loadBias={loadBias}
        onChangeLoadBias={onChangeLoadBias}
      />
    </div>
  )

  const dualGaugePod = isCockpit ? (
    <div className={`${subpanelFrame} bg-sky-100 p-4 h-full flex items-center justify-center`}>
      <div className="rounded-full bg-red-500 border-[3px] bv-border p-3 sm:p-4 w-full flex items-center justify-around gap-2">
        <div className="rounded-full bg-[#FFFBEB] border-[3px] bv-border p-2">
          <AnalogDialGauge
            label="Core Speed"
            value={primaryCore.actualRpm}
            min={0}
            max={2400}
            unit="RPM"
            warningStart={1950}
            dangerStart={2150}
            variant="yellow"
            size="sm"
          />
        </div>
        <button
          type="button"
          onClick={onHonkHorn}
          title="Honk Horn & Acknowledge Open Alarms"
          className={`w-14 h-14 rounded-full cartoon-btn shrink-0 flex flex-col items-center justify-center cursor-pointer ${
            hornActive
              ? 'bg-amber-300 text-slate-950 scale-105'
              : 'bg-[#FFFBEB] text-red-600 hover:bg-amber-100'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span className="font-display text-[10px] font-bold leading-none mt-0.5">HORN</span>
        </button>
        <div className="rounded-full bg-[#FFFBEB] border-[3px] bv-border p-2">
          <AnalogDialGauge
            label="Fleet OEE"
            value={latest.fleetOee}
            min={50}
            max={100}
            unit="%"
            variant="white"
            size="sm"
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`${subpanelFrame} steel-plate-dark p-5 h-full flex items-center justify-around gap-4`}
    >
      <AnalogDialGauge
        label="Core Turbine Speed"
        value={primaryCore.actualRpm}
        min={0}
        max={2400}
        unit="RPM"
        warningStart={1950}
        dangerStart={2150}
        variant="white"
        size="md"
      />
      <AnalogDialGauge
        label="Fleet Efficiency"
        value={latest.fleetOee}
        min={50}
        max={100}
        unit="%"
        variant="white"
        size="md"
      />
    </div>
  )

  const spectrumPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full flex flex-col justify-between gap-3`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-display text-sm font-bold bv-ink">Bay Load Spectrum</span>
        <span className="font-mono font-bold bv-muted tabular-nums">kW / Unit</span>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="crt-screen rounded-2xl p-3 h-32 flex items-end justify-around gap-2">
          {spectralBars.map((bar) => {
            const pct = Math.min(100, Math.max(10, (bar.value / maxBarKw) * 100))
            return (
              <div
                key={bar.label}
                className="flex flex-col items-center gap-1 h-full justify-end flex-1"
              >
                <span className="font-mono text-[10px] font-bold text-white tabular-nums">
                  {Math.round(bar.value)}
                </span>
                <div className="w-full max-w-[24px] bg-slate-800 rounded-full h-16 flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-full ${bar.color} transition-all duration-300`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-300">{bar.label}</span>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-2">
          <AnalogDialGauge
            label="Bus A"
            value={latest.busVoltageV}
            min={440}
            max={520}
            unit="V"
            variant="yellow"
            size="sm"
          />
        </div>
      </div>
    </div>
  )

  const drivePod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full`}>
      <CockpitDriveCluster
        shiftGear={shiftGear}
        onSelectGear={onSelectGear}
        bayLightsOn={bayLightsOn}
        onToggleBayLights={onToggleBayLights}
        coolantPurgeOn={coolantPurgeOn}
        onToggleCoolantPurge={onToggleCoolantPurge}
        shiftUnits={shiftUnits}
        shiftKwh={shiftKwh}
      />
    </div>
  )

  const tunerClockPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full`}>
      <TunerClockPanel
        shiftElapsedSec={shiftElapsedSec}
        peakThresholdKw={peakThresholdKw}
        onChangePeakThreshold={onChangePeakThreshold}
        harmonicTrim={harmonicTrim}
        onChangeHarmonicTrim={onChangeHarmonicTrim}
        surgeActive={surgeActive}
        criticalCount={criticalCount}
        bayLightsOn={bayLightsOn}
      />
    </div>
  )

  const intercomPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full`}>
      <IntercomDispatchPanel
        machines={machines}
        dispatchLogs={dispatchLogs}
        onSendDispatch={onSendDispatch}
      />
    </div>
  )

  const hopperCrewPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full`}>
      <HopperCrewPanel
        machines={machines}
        hopperPct={hopperPct}
        completedBatches={completedBatches}
        onTipHopperBatch={onTipHopperBatch}
        bayLightsOn={bayLightsOn}
      />
    </div>
  )

  const batteryPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full bv-sticker-tilt-l`}>
      <BatterySunburstCore
        batteryPct={latest.batteryPct}
        totalPowerKw={latest.totalPowerKw}
        regenKw={latest.regenKw}
        shiftKwh={shiftKwh}
        surgeActive={surgeActive}
        onToggleSurge={onToggleSurge}
      />
    </div>
  )

  const oscilloscopePod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full`}>
      <OscilloscopePanel
        gridHz={latest.gridHz}
        busVoltageV={latest.busVoltageV}
        harmonicDistortionPct={latest.harmonicDistortionPct}
        tick={latest.tick}
        breakers={breakers}
        onToggleBreaker={onToggleBreaker}
      />
    </div>
  )

  const scannerPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full bv-sticker-tilt-r`}>
      <SilhouetteScanner machine={scannerMachine} />
    </div>
  )

  const energyChartPod = (
    <div className={`${subpanelFrame} steel-plate p-5 h-full flex flex-col justify-between gap-4`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">
            Real-Time Energy Consumption & Recovery
          </h3>
          <p className="text-xs font-medium bv-muted">
            Rolling 30-sample gross demand vs kinetic cylinder regeneration
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateTab(DashboardTab.EnergyGrid)}
          className="cartoon-btn px-3 py-1.5 rounded-2xl bg-white text-xs font-bold text-slate-950 hover:bg-amber-200 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Grid analytics
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <EnergyFlowChart history={history} peakThresholdKw={peakThresholdKw} heightClass="h-56" />
    </div>
  )

  const auxDialsStrip = (compactGrid = false) => (
    <div
      className={`${subpanelFrame} steel-plate-dark p-5 grid ${
        compactGrid ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
      } gap-4 items-center justify-items-center h-full`}
    >
      <AnalogDialGauge
        label="Coolant Loop Temp"
        value={latest.coolantTempC}
        min={20}
        max={100}
        unit="°C"
        warningStart={68}
        dangerStart={82}
        variant="white"
        size="sm"
      />
      <AnalogDialGauge
        label="Conduit Pressure"
        value={latest.conduitPsi}
        min={20}
        max={120}
        unit="PSI"
        warningStart={88}
        dangerStart={102}
        variant="white"
        size="sm"
      />
      <AnalogDialGauge
        label="Grid Frequency"
        value={latest.gridHz}
        min={58}
        max={62}
        unit="Hz"
        warningStart={61}
        dangerStart={61.5}
        variant="white"
        size="sm"
      />
      <AnalogDialGauge
        label="Power Load Factor"
        value={Math.min(100, (latest.totalPowerKw / peakThresholdKw) * 100)}
        min={0}
        max={100}
        unit="%"
        warningStart={82}
        dangerStart={92}
        variant="white"
        size="sm"
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Compact Toy Design Switcher Strip */}
      <div className="cartoon-box bv-card rounded-3xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold bv-ink">
          <Palette className="w-4 h-4 shrink-0" />
          <span>Toy Design:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {allThemes.map((alt) => {
            const selected = alt.id === theme.id
            return (
              <button
                key={alt.id}
                type="button"
                onClick={() => setThemeId(alt.id)}
                className="px-3 py-1.5 rounded-2xl text-xs font-bold transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                style={{
                  backgroundColor: selected ? alt.accentBg : 'transparent',
                  color: selected ? alt.accentText : theme.inkText,
                  border:
                    selected && !isLineless
                      ? `2px solid ${theme.borderColor}`
                      : '2px solid transparent',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: alt.bezelBg,
                    border: isLineless
                      ? '0px solid transparent'
                      : `1.5px solid ${theme.borderColor}`,
                  }}
                />
                {alt.number} · {alt.name}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab(DashboardTab.Alternatives)}
          className="cartoon-btn px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
          style={{
            backgroundColor: theme.accentBg,
            color: theme.accentText,
          }}
        >
          Compare All 5
        </button>
      </div>

      {/* 4-Column Top Summary Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="cartoon-box bv-card rounded-3xl p-4 flex flex-col justify-between gap-1">
          <span className="text-xs font-bold bv-muted">Fleet Machine Efficiency (OEE)</span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-2xl font-bold bv-ink tabular-nums">
              {latest.fleetOee.toFixed(1)}%
            </span>
            <span className="text-xs font-bold text-emerald-700 tabular-nums">
              {activeCount}/{machines.length} Bays Online
            </span>
          </div>
          <span className="text-xs font-medium bv-muted">
            Gear {shiftGear} · {activePreset}
          </span>
        </div>

        <div
          className="cartoon-box rounded-3xl p-4 flex flex-col justify-between gap-1"
          style={{ backgroundColor: theme.kpiYellowBg }}
        >
          <span className="text-xs font-bold bv-muted">Real-Time Energy Consumption</span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-2xl font-bold bv-ink tabular-nums">
              {latest.totalPowerKw.toFixed(1)} kW
            </span>
            <span className="font-mono text-xs font-bold text-cyan-800 tabular-nums">
              -{latest.regenKw.toFixed(1)} kW Regen
            </span>
          </div>
          <span className="text-xs font-semibold bv-muted tabular-nums">
            Shift {shiftKwh.toFixed(1)} kWh · {shiftUnits.toLocaleString()} units
          </span>
        </div>

        <div
          className="cartoon-box rounded-3xl p-4 flex flex-col justify-between gap-1"
          style={{ backgroundColor: theme.kpiBlueBg }}
        >
          <span className="text-xs font-bold bv-muted">Battery Cell & Grid Stability</span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-2xl font-bold bv-ink tabular-nums">
              {latest.batteryPct.toFixed(1)}%
            </span>
            <span className="font-mono text-xs font-bold bv-ink tabular-nums">
              {latest.gridHz.toFixed(2)} Hz
            </span>
          </div>
          <span className="text-xs font-semibold bv-muted tabular-nums">
            Cap {peakThresholdKw} kW · THD {latest.harmonicDistortionPct.toFixed(2)}%
          </span>
        </div>

        <div className="cartoon-box bv-card rounded-3xl p-4 flex flex-col justify-between gap-1">
          <span className="text-xs font-bold bv-muted">Active Maintenance Alerts</span>
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={`font-mono text-2xl font-bold tabular-nums ${
                criticalCount > 0
                  ? 'text-red-600'
                  : openAlerts.length > 0
                    ? 'text-amber-600'
                    : 'text-emerald-700'
              }`}
            >
              {openAlerts.length}
            </span>
            <span className="text-xs font-bold bv-ink tabular-nums">
              {criticalCount} Critical · {openAlerts.length - criticalCount} Advisory
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab(DashboardTab.MaintenanceAlerts)}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 w-fit cursor-pointer"
          >
            Inspect alert queue
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* Main Toy-Inspired Power Station Cabinet */}
      <div className="relative">
        {/* Top Interactive Toy Crown (Clickable Red Siren Dome on CockpitHorn, 3 Roof Domes on DumpCab/Lineless, Pipes on others) */}
        {isCockpit ? (
          <div className="hidden sm:flex items-end justify-center gap-8 -mb-1 relative z-10">
            <div className="w-20 h-4 rounded-t-2xl bg-sky-400 border-[3px] border-b-0 bv-border pointer-events-none" />
            <button
              type="button"
              onClick={onHonkHorn}
              title="Click Red Siren Dome to sound console horn & acknowledge alarms"
              className={`w-28 h-10 rounded-t-3xl border-[3px] border-b-0 bv-border cursor-pointer flex items-center justify-center transition-colors ${
                sirenLit ? 'bg-amber-300' : 'siren-ribs'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-950">
                {sirenLit ? 'ALERT!' : 'SIREN'}
              </span>
            </button>
            <div className="w-20 h-4 rounded-t-2xl bg-sky-400 border-[3px] border-b-0 bv-border pointer-events-none" />
          </div>
        ) : isDumpCab || isLineless ? (
          <div
            className="hidden sm:flex items-end justify-center gap-8 -mb-1 pointer-events-none select-none relative z-10"
            aria-hidden="true"
          >
            {[0, 1, 2].map((d) => (
              <div
                key={d}
                className={`w-24 h-8 rounded-t-full ${
                  isLineless
                    ? d === 0
                      ? 'bg-amber-400'
                      : d === 1
                        ? 'bg-red-500'
                        : 'bg-emerald-500'
                    : 'bg-amber-300 border-[3px] border-b-0 bv-border'
                }`}
              />
            ))}
          </div>
        ) : (
          <div
            className="hidden sm:flex items-end justify-between px-12 -mb-1 pointer-events-none select-none"
            aria-hidden="true"
          >
            <div className="flex items-end gap-4">
              <div
                className="w-24 h-6 rounded-t-2xl border-[3px] border-b-0 bv-border"
                style={{ backgroundColor: theme.pipeLight }}
              />
              <div
                className="w-28 h-8 rounded-t-2xl border-[3px] border-b-0 bv-border"
                style={{ backgroundColor: theme.plateAltBg }}
              />
            </div>
            <div className="flex items-end gap-3">
              <div
                className="w-14 h-5 rounded-t-2xl border-[3px] border-b-0 bv-border"
                style={{ backgroundColor: theme.pipeLavender }}
              />
              <div
                className="w-20 h-7 rounded-t-2xl border-[3px] border-b-0 bv-border"
                style={{ backgroundColor: theme.pipeLight }}
              />
            </div>
          </div>
        )}

        {/* Outer Toy Shell Bezel */}
        <section
          className={`cartoon-box bv-toy-shell rounded-3xl flex flex-col ${
            isLineless ? 'p-5 sm:p-6 gap-5' : 'p-4 sm:p-5 gap-4'
          }`}
          style={{ backgroundColor: theme.bezelBg }}
        >
          {/* Toy Nameplate Sticker with Interactive HORN Button */}
          <div
            className={`${subpanelFrame} px-5 py-3 flex flex-wrap items-center justify-between gap-4`}
            style={{ backgroundColor: theme.nameplateBg }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onHonkHorn}
                title="Sound Console Horn & Acknowledge Open Alarms"
                className={`font-display text-xs font-bold px-3 py-1 rounded-full cursor-pointer inline-flex items-center gap-1 transition-transform active:scale-95 ${
                  hornActive
                    ? 'bg-amber-300 text-slate-950'
                    : 'bg-red-500 text-white hover:bg-red-400'
                }`}
                style={{
                  border: isLineless ? 'none' : `2px solid ${theme.borderColor}`,
                }}
              >
                <Volume2 className="w-3.5 h-3.5" />
                HORN
              </button>
              <h2
                className={`font-display text-2xl font-bold tracking-tight ${
                  isDumpCab ? 'text-white' : 'bv-ink'
                }`}
              >
                Power Station
              </h2>
              <span
                className={`font-mono text-xs font-bold hidden md:inline ${
                  isDumpCab ? 'text-amber-200' : 'bv-muted'
                }`}
              >
                · {theme.name}
              </span>
            </div>
            <div
              className={`flex flex-wrap items-center gap-4 text-xs font-mono font-bold tabular-nums ${
                isDumpCab ? 'text-white' : 'bv-ink'
              }`}
            >
              <span>COOLANT {latest.coolantTempC.toFixed(1)} °C</span>
              <span aria-hidden="true">·</span>
              <span>MANIFOLD {latest.conduitPsi.toFixed(1)} PSI</span>
              <button
                type="button"
                onClick={() => onNavigateTab(DashboardTab.StationPhotos)}
                className="cartoon-btn font-sans text-xs font-bold bg-white text-slate-950 px-3 py-1.5 rounded-2xl hover:bg-amber-100 cursor-pointer whitespace-nowrap shrink-0"
              >
                View Toy & Station Photos
              </button>
            </div>
          </div>

          {/* 5 TOY-INSPIRED CONSOLE LAYOUTS (ALL CONTAINING ALL 11 INSTRUMENT MODULES) */}
          {theme.id === StationThemeId.DumpCab ? (
            /* DESIGN 02: PRIMARY DUMP-CAB STACK */
            <div className="flex flex-col gap-4">
              {/* Sky-Blue Windshield Crew & Battery/Scanner Band */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-6">{batteryPod}</div>
                <div className="xl:col-span-6">{hopperCrewPod}</div>
              </div>
              {/* Sunny Yellow Cab Instrument Deck */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4">{matrixPod}</div>
                <div className="lg:col-span-4">{dualGaugePod}</div>
                <div className="lg:col-span-4">{spectrumPod}</div>
              </div>
              {/* Cockpit PRNDL Shifter, Tuner Clock & MIKE Intercom Row */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-4">{drivePod}</div>
                <div className="xl:col-span-4">{tunerClockPod}</div>
                <div className="xl:col-span-4">{intercomPod}</div>
              </div>
              {/* Scanner, Oscilloscope & Energy Flow */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-4">{scannerPod}</div>
                <div className="xl:col-span-4">{oscilloscopePod}</div>
                <div className="xl:col-span-4">{energyChartPod}</div>
              </div>
              {/* Kelly Green Headlight Grille Bar & Aux Dials */}
              <div
                className={`${subpanelFrame} p-4 flex flex-col gap-4`}
                style={{ backgroundColor: '#16A34A' }}
              >
                <div className="flex items-center justify-between px-4">
                  <span
                    className={`w-8 h-8 rounded-full border-[3px] bv-border ${
                      sirenLit ? 'bg-red-500' : bayLightsOn ? 'bg-amber-300' : 'bg-amber-100'
                    }`}
                  />
                  <div className="flex flex-col gap-1.5 items-center">
                    <span className="w-32 h-3 rounded-full bg-amber-300 border-2 bv-border" />
                    <span className="w-32 h-3 rounded-full bg-amber-300 border-2 bv-border" />
                  </div>
                  <span
                    className={`w-8 h-8 rounded-full border-[3px] bv-border ${
                      surgeActive ? 'bg-red-500' : bayLightsOn ? 'bg-amber-300' : 'bg-amber-100'
                    }`}
                  />
                </div>
                {auxDialsStrip(false)}
              </div>
            </div>
          ) : theme.id === StationThemeId.LinelessBlocks ? (
            /* DESIGN 03: LINELESS PRIMARY TOY BLOCKS */
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-7">{batteryPod}</div>
                <div className="xl:col-span-5">{scannerPod}</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-4">{matrixPod}</div>
                <div className="lg:col-span-4">{dualGaugePod}</div>
                <div className="lg:col-span-4">{spectrumPod}</div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-6">{drivePod}</div>
                <div className="xl:col-span-6">{hopperCrewPod}</div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-6">{tunerClockPod}</div>
                <div className="xl:col-span-6">{intercomPod}</div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-6">{oscilloscopePod}</div>
                <div className="xl:col-span-6">{energyChartPod}</div>
              </div>
              <div>{auxDialsStrip(false)}</div>
            </div>
          ) : theme.id === StationThemeId.CreamDecal ? (
            /* DESIGN 04: CREAM-HALO STICKER SHEET (3-Tower Vertical Toy Kiosk) */
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
                <div className="flex flex-col gap-4">
                  <div>{batteryPod}</div>
                  <div>{spectrumPod}</div>
                  <div>{hopperCrewPod}</div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>{dualGaugePod}</div>
                  <div>{tunerClockPod}</div>
                  <div className="flex-1">{oscilloscopePod}</div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>{drivePod}</div>
                  <div>{matrixPod}</div>
                  <div>{intercomPod}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-4">{scannerPod}</div>
                <div className="xl:col-span-4">{energyChartPod}</div>
                <div className="xl:col-span-4">{auxDialsStrip(true)}</div>
              </div>
            </div>
          ) : theme.id === StationThemeId.ScreenprintToy ? (
            /* DESIGN 05: RETRO TOYBOX SCREENPRINT (Widescreen Hero Cockpit) */
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-5">{batteryPod}</div>
                <div className="xl:col-span-7">{energyChartPod}</div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-6">{oscilloscopePod}</div>
                <div className="xl:col-span-6 flex flex-col gap-4">
                  <div>{dualGaugePod}</div>
                  <div>{tunerClockPod}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-6">{drivePod}</div>
                <div className="xl:col-span-6">{intercomPod}</div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-4">{matrixPod}</div>
                <div className="xl:col-span-4">{spectrumPod}</div>
                <div className="xl:col-span-4">{hopperCrewPod}</div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-4">{scannerPod}</div>
                <div className="xl:col-span-8">{auxDialsStrip(false)}</div>
              </div>
            </div>
          ) : (
            /* DESIGN 01: TOYBOX COCKPIT & RED SIREN */
            <div className="flex flex-col gap-4">
              {/* Top Cockpit Instrument Row: Red Wheel Gauges + PRNDL/L/W/Odometer + Tuner/Clock */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4">{dualGaugePod}</div>
                <div className="lg:col-span-4">{drivePod}</div>
                <div className="lg:col-span-4">{tunerClockPod}</div>
              </div>
              {/* Second Cockpit Row: MIKE Intercom + Station Matrix + Bay Load Spectrum */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4">{intercomPod}</div>
                <div className="lg:col-span-4">{matrixPod}</div>
                <div className="lg:col-span-4">{spectrumPod}</div>
              </div>
              {/* Third Row: Sunburst Battery + Oscilloscope & Breakers */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-6">{batteryPod}</div>
                <div className="xl:col-span-6">{oscilloscopePod}</div>
              </div>
              {/* Fourth Row: Cab Crew/Hopper + Kinetic Scanner + Energy Flow */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-4">{hopperCrewPod}</div>
                <div className="xl:col-span-4">{scannerPod}</div>
                <div className="xl:col-span-4">{energyChartPod}</div>
              </div>
              <div>{auxDialsStrip(false)}</div>
            </div>
          )}
        </section>

        {/* Bottom Toy Hardware Trim */}
        {isDumpCab || isLineless ? (
          <div
            className="hidden sm:flex items-start justify-between px-16 -mt-0.5 pointer-events-none select-none"
            aria-hidden="true"
          >
            <div
              className={`w-28 h-8 rounded-b-full bg-blue-600 ${
                isLineless ? '' : 'border-[3px] border-t-0 bv-border'
              }`}
            />
            <div
              className={`w-28 h-8 rounded-b-full bg-blue-600 ${
                isLineless ? '' : 'border-[3px] border-t-0 bv-border'
              }`}
            />
          </div>
        ) : (
          <div
            className="hidden sm:flex items-start justify-between px-12 -mt-0.5 pointer-events-none select-none"
            aria-hidden="true"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-20 h-5 rounded-b-2xl border-[3px] border-t-0 bv-border"
                style={{ backgroundColor: theme.pipeRed }}
              />
              <div className="w-16 h-4 rounded-b-full bg-slate-900 border-[3px] border-t-0 bv-border" />
            </div>
            <div className="w-32 h-4 rounded-b-2xl hose-ribs border-[3px] border-t-0 bv-border" />
          </div>
        )}
      </div>

      {/* Bottom Split: Live Machine Efficiency Table & Active Maintenance Alerts */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 cartoon-box bv-card rounded-3xl overflow-hidden">
          <div
            className={`px-5 py-3.5 bv-card-header flex items-center justify-between gap-4 ${
              isLineless ? '' : 'border-b-[3px] bv-border'
            }`}
          >
            <div>
              <h3 className="font-display text-lg font-bold bv-ink">Machine Efficiency Overview</h3>
              <p className="text-xs font-medium bv-muted">
                Live OEE, load draw, temperature, and preventive service countdown
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab(DashboardTab.MachineEfficiency)}
              className="cartoon-btn px-3 py-1.5 rounded-2xl text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: theme.accentBg,
                color: theme.accentText,
              }}
            >
              All machines
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`text-[11px] font-bold bv-muted bv-card-header ${
                    isLineless ? '' : 'border-b-2 bv-border'
                  }`}
                >
                  <th className="py-2.5 px-4">Unit</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3 text-right">OEE</th>
                  <th className="py-2.5 px-3 text-right">Power</th>
                  <th className="py-2.5 px-4 text-right">Service Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/40 text-xs">
                {machines.map((m) => (
                  <tr key={m.id} className="hover:bg-amber-400/10 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-bold bv-ink">
                        <span className="font-mono mr-1.5 text-blue-700">{m.code}</span>
                        {m.name}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          m.status === MachineStatus.Optimal
                            ? 'text-emerald-700'
                            : m.status === MachineStatus.Warning
                              ? 'text-amber-700'
                              : m.status === MachineStatus.Critical
                                ? 'text-red-600'
                                : 'bv-muted'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold bv-ink tabular-nums">
                      {m.active ? `${m.oee.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold bv-ink tabular-nums">
                      {m.powerKw.toFixed(1)} kW
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-mono font-semibold tabular-nums ${
                        m.serviceHoursLeft < 24 ? 'text-amber-600' : 'bv-muted'
                      }`}
                    >
                      {m.serviceHoursLeft.toFixed(1)} h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-5 cartoon-box bv-card rounded-3xl overflow-hidden flex flex-col">
          <div
            className={`px-5 py-3.5 bv-card-header flex items-center justify-between gap-4 ${
              isLineless ? '' : 'border-b-[3px] bv-border'
            }`}
          >
            <div>
              <h3 className="font-display text-lg font-bold bv-ink">Maintenance Alert Feed</h3>
              <p className="text-xs font-medium bv-muted">
                {openAlerts.length} active items requiring review or clearance
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab(DashboardTab.MaintenanceAlerts)}
              className="cartoon-btn px-3 py-1.5 rounded-2xl text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: theme.accentBg,
                color: theme.accentText,
              }}
            >
              Manage
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-300/40 flex-1">
            {openAlerts.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 bv-muted">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                <div className="text-sm font-bold bv-ink">All Station Bays Nominal</div>
                <p className="text-xs bv-muted max-w-xs">
                  No open maintenance alerts. Use Simulate Fault in the top bar or alert queue to
                  test emergency response.
                </p>
              </div>
            ) : (
              openAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-bold inline-flex items-center gap-1 ${
                            alert.severity === AlertSeverity.Critical
                              ? 'text-red-600'
                              : alert.severity === AlertSeverity.Warning
                                ? 'text-amber-700'
                                : 'text-blue-700'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {alert.severity}
                        </span>
                        <span aria-hidden="true" className="bv-muted">
                          ·
                        </span>
                        <span className="font-mono font-bold bv-ink">{alert.id}</span>
                        <span aria-hidden="true" className="bv-muted">
                          ·
                        </span>
                        <span className="bv-muted">{alert.createdAt}</span>
                      </div>
                      <div className="text-sm font-bold bv-ink mt-0.5">{alert.title}</div>
                      <div className="text-xs bv-muted mt-0.5">
                        {alert.machineName} · {alert.metricLabel}:{' '}
                        <span className="font-mono font-bold bv-ink tabular-nums">
                          {alert.metricValue}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onResolveAlert(alert.id)}
                      className="cartoon-btn px-3 py-1.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-xs font-bold text-slate-950 whitespace-nowrap shrink-0 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Wrench className="w-3 h-3" />
                      Resolve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
