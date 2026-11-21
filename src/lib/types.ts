export const MachineStatus = {
  Optimal: 'Optimal',
  Warning: 'Warning',
  Critical: 'Critical',
  Standby: 'Standby',
} as const
export type MachineStatus = (typeof MachineStatus)[keyof typeof MachineStatus]

export const AlertSeverity = {
  Critical: 'Critical',
  Warning: 'Warning',
  Advisory: 'Advisory',
} as const
export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity]

export const AlertLifecycle = {
  Open: 'Open',
  Acknowledged: 'Acknowledged',
  Dispatched: 'Dispatched',
  Resolved: 'Resolved',
} as const
export type AlertLifecycle = (typeof AlertLifecycle)[keyof typeof AlertLifecycle]

export const PowerPreset = {
  EcoBalance: 'Eco Balance',
  NominalRun: 'Nominal Run',
  PeakBoost: 'Peak Boost',
  CoolantFlush: 'Coolant Flush',
  HarmonicSync: 'Harmonic Sync',
  LoadShed: 'Load Shed',
} as const
export type PowerPreset = (typeof PowerPreset)[keyof typeof PowerPreset]

export const ShiftGear = {
  Park: 'P',
  Reverse: 'R',
  Neutral: 'N',
  Drive: 'D',
  Low: 'L',
} as const
export type ShiftGear = (typeof ShiftGear)[keyof typeof ShiftGear]

export const DashboardTab = {
  PowerStation: 'power-station',
  MachineEfficiency: 'machine-efficiency',
  EnergyGrid: 'energy-grid',
  MaintenanceAlerts: 'maintenance-alerts',
  StationPhotos: 'station-photos',
  Alternatives: 'alternatives',
} as const
export type DashboardTab = (typeof DashboardTab)[keyof typeof DashboardTab]

export interface MachineUnit {
  id: string
  code: string
  name: string
  subsystem: string
  hardwareRef: string
  status: MachineStatus
  active: boolean
  oee: number // Overall Equipment Effectiveness %
  availability: number // %
  performance: number // %
  quality: number // %
  powerKw: number
  targetRpm: number
  actualRpm: number
  temperatureC: number
  pressurePsi: number
  vibrationMmS: number
  throughputUnitsHr: number
  serviceHoursLeft: number
  efficiencyHistory: number[]
}

export interface TelemetryPoint {
  timestamp: string
  tick: number
  fleetOee: number
  totalPowerKw: number
  regenKw: number
  netGridKw: number
  batteryPct: number
  gridHz: number
  coolantTempC: number
  conduitPsi: number
  busVoltageV: number
  harmonicDistortionPct: number
}

export interface MaintenanceAlert {
  id: string
  machineId: string
  machineName: string
  title: string
  detail: string
  severity: AlertSeverity
  lifecycle: AlertLifecycle
  metricLabel: string
  metricValue: string
  createdAt: string
  assignedTech: string | null
}

export interface BreakerChannel {
  id: string
  label: string
  machineId: string
  closed: boolean // true = power flowing
  amps: number
  maxAmps: number
}

export interface DispatchLogEntry {
  id: string
  time: string
  targetCode: string
  message: string
}
