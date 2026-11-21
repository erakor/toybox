import {
  AlertLifecycle,
  AlertSeverity,
  type BreakerChannel,
  type DispatchLogEntry,
  MachineStatus,
  type MachineUnit,
  type MaintenanceAlert,
  type TelemetryPoint,
} from './types'

export const INITIAL_MACHINES: MachineUnit[] = [
  {
    id: 'ps-01',
    code: 'PS-01',
    name: 'Main Power Core',
    subsystem: 'Primary Transformer & Sunburst Cell',
    hardwareRef: 'Center Blue Battery & Amber Array',
    status: MachineStatus.Optimal,
    active: true,
    oee: 94.8,
    availability: 98.4,
    performance: 97.1,
    quality: 99.2,
    powerKw: 112.4,
    targetRpm: 1800,
    actualRpm: 1796,
    temperatureC: 48.2,
    pressurePsi: 64.0,
    vibrationMmS: 1.1,
    throughputUnitsHr: 420,
    serviceHoursLeft: 142.5,
    efficiencyHistory: [93.8, 94.1, 94.4, 94.2, 94.6, 94.9, 94.7, 94.5, 94.8, 95.0, 94.9, 94.8],
  },
  {
    id: 'cl-02',
    code: 'CL-02',
    name: 'Lavender Conduit Press',
    subsystem: 'Vertical Cylinder Compression Stack',
    hardwareRef: 'Rear Lavender Modular Column',
    status: MachineStatus.Optimal,
    active: true,
    oee: 91.6,
    availability: 96.2,
    performance: 95.8,
    quality: 99.4,
    powerKw: 84.5,
    targetRpm: 1450,
    actualRpm: 1442,
    temperatureC: 54.6,
    pressurePsi: 82.5,
    vibrationMmS: 1.8,
    throughputUnitsHr: 318,
    serviceHoursLeft: 26.4,
    efficiencyHistory: [91.0, 91.2, 91.5, 91.4, 91.8, 91.9, 91.7, 91.4, 91.5, 91.7, 91.6, 91.6],
  },
  {
    id: 'hg-03',
    code: 'HG-03',
    name: 'Silver Flex Hose Pump',
    subsystem: 'Corrugated Vacuum & Coolant Manifold',
    hardwareRef: 'Lower Silver Ribbed Conduit Hoses',
    status: MachineStatus.Warning,
    active: true,
    oee: 83.2,
    availability: 92.0,
    performance: 91.3,
    quality: 99.1,
    powerKw: 76.8,
    targetRpm: 1600,
    actualRpm: 1518,
    temperatureC: 67.4,
    pressurePsi: 96.2,
    vibrationMmS: 3.9,
    throughputUnitsHr: 264,
    serviceHoursLeft: 14.2,
    efficiencyHistory: [88.4, 87.9, 86.8, 86.2, 85.4, 84.9, 84.3, 84.0, 83.6, 83.5, 83.3, 83.2],
  },
  {
    id: 'rd-04',
    code: 'RD-04',
    name: 'Crimson Gear Rotor',
    subsystem: 'High-Torque Base Drive Assembly',
    hardwareRef: 'Lower Red Fluted Rotor & Black Stud',
    status: MachineStatus.Optimal,
    active: true,
    oee: 92.9,
    availability: 97.5,
    performance: 96.1,
    quality: 99.2,
    powerKw: 68.2,
    targetRpm: 1200,
    actualRpm: 1194,
    temperatureC: 51.8,
    pressurePsi: 71.4,
    vibrationMmS: 1.6,
    throughputUnitsHr: 290,
    serviceHoursLeft: 116.8,
    efficiencyHistory: [92.1, 92.4, 92.3, 92.6, 92.8, 92.7, 93.0, 92.9, 92.8, 93.1, 93.0, 92.9],
  },
  {
    id: 'wh-05',
    code: 'WH-05',
    name: 'White Pipe Extruder',
    subsystem: 'Dual Cylindrical Feed Towers',
    hardwareRef: 'Top Dual White Intake Cylinders',
    status: MachineStatus.Optimal,
    active: true,
    oee: 95.1,
    availability: 98.8,
    performance: 96.8,
    quality: 99.5,
    powerKw: 54.6,
    targetRpm: 1350,
    actualRpm: 1348,
    temperatureC: 45.1,
    pressurePsi: 58.3,
    vibrationMmS: 0.9,
    throughputUnitsHr: 356,
    serviceHoursLeft: 184.0,
    efficiencyHistory: [94.5, 94.7, 94.9, 95.0, 94.8, 95.2, 95.1, 95.0, 95.2, 95.3, 95.1, 95.1],
  },
  {
    id: 'mn-06',
    code: 'MN-06',
    name: 'Kinetic Figure Scanner',
    subsystem: 'Optical Alignment & Motion Bay',
    hardwareRef: 'Purple Sunburst Laser Reticle Screen',
    status: MachineStatus.Optimal,
    active: true,
    oee: 90.4,
    availability: 96.8,
    performance: 94.5,
    quality: 98.9,
    powerKw: 32.1,
    targetRpm: 900,
    actualRpm: 892,
    temperatureC: 41.3,
    pressurePsi: 44.0,
    vibrationMmS: 0.7,
    throughputUnitsHr: 210,
    serviceHoursLeft: 92.5,
    efficiencyHistory: [89.8, 90.1, 90.0, 90.3, 90.5, 90.2, 90.4, 90.6, 90.5, 90.3, 90.4, 90.4],
  },
]

export const INITIAL_ALERTS: MaintenanceAlert[] = [
  {
    id: 'ALT-408',
    machineId: 'hg-03',
    machineName: 'HG-03 · Silver Flex Hose Pump',
    title: 'Conduit Manifold Pressure Above Nominal Band',
    detail:
      'Intake backpressure climbed 14.2% above baseline. Inspect ribbed coupling seals on Bay 3.',
    severity: AlertSeverity.Warning,
    lifecycle: AlertLifecycle.Open,
    metricLabel: 'Conduit Pressure',
    metricValue: '96.2 PSI',
    createdAt: '2m ago',
    assignedTech: null,
  },
  {
    id: 'ALT-405',
    machineId: 'cl-02',
    machineName: 'CL-02 · Lavender Conduit Press',
    title: 'Scheduled 250-Hour Lubrication Interval',
    detail:
      'Vertical column bearing friction within limits; preventive grease cycle recommended this shift.',
    severity: AlertSeverity.Advisory,
    lifecycle: AlertLifecycle.Acknowledged,
    metricLabel: 'Bearing Vibration',
    metricValue: '1.8 mm/s',
    createdAt: '18m ago',
    assignedTech: 'M. Lindqvist',
  },
  {
    id: 'ALT-401',
    machineId: 'rd-04',
    machineName: 'RD-04 · Crimson Gear Rotor',
    title: 'Torque Harmonics Calibrated',
    detail: 'Automatic phase balancer aligned gear teeth backlash after shift startup.',
    severity: AlertSeverity.Advisory,
    lifecycle: AlertLifecycle.Resolved,
    metricLabel: 'Rotor Speed',
    metricValue: '1,194 RPM',
    createdAt: '1h ago',
    assignedTech: 'K. Sato',
  },
]

export const INITIAL_DISPATCHES: DispatchLogEntry[] = [
  {
    id: 'DSP-102',
    time: '06:14:22',
    targetCode: 'HG-03',
    message: 'Check ribbed intake manifold clamp on Bay 3',
  },
  {
    id: 'DSP-101',
    time: '05:52:09',
    targetCode: 'CL-02',
    message: 'M. Lindqvist cleared lubrication line pressure',
  },
]

export function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

export function buildInitialHistory(): TelemetryPoint[] {
  const points: TelemetryPoint[] = []
  const now = Date.now()
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now - i * 1000)
    const wave = Math.sin((30 - i) * 0.35)
    const totalPowerKw = Number((424 + wave * 12 + (Math.random() - 0.5) * 6).toFixed(1))
    const regenKw = Number((58 + Math.cos((30 - i) * 0.28) * 6).toFixed(1))
    points.push({
      timestamp: formatClock(t),
      tick: 30 - i,
      fleetOee: Number((91.2 + wave * 0.8).toFixed(1)),
      totalPowerKw,
      regenKw,
      netGridKw: Number((totalPowerKw - regenKw).toFixed(1)),
      batteryPct: Number((83.5 + (30 - i) * 0.025).toFixed(1)),
      gridHz: Number((60.0 + wave * 0.04).toFixed(2)),
      coolantTempC: Number((51.4 + wave * 0.9).toFixed(1)),
      conduitPsi: Number((69.4 + wave * 2.1).toFixed(1)),
      busVoltageV: Number((479.6 + wave * 1.4).toFixed(1)),
      harmonicDistortionPct: Number((2.1 + Math.abs(wave) * 0.3).toFixed(2)),
    })
  }
  return points
}

/** One breaker per machine, closed when the machine is active. */
export function buildBreakers(machines: MachineUnit[]): BreakerChannel[] {
  return machines.map((m, idx) => ({
    id: `BRK-${idx + 1}`,
    label: m.code,
    machineId: m.id,
    closed: m.active,
    amps: m.active ? Number(((m.powerKw * 1000) / (480 * 1.732)).toFixed(1)) : 0,
    maxAmps: 180,
  }))
}
