import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Camera,
  Gauge,
  Menu,
  Palette,
  Pause,
  Play,
  RotateCcw,
  X,
  Zap,
  ZapOff,
} from 'lucide-react'
import { useStationTheme } from './context/ThemeContext'
import { useFactoryTelemetry } from './hooks/useFactoryTelemetry'
import { DashboardTab } from './types/factory'
import { PowerStationView } from './components/views/PowerStationView'
import { MachineEfficiencyView } from './components/views/MachineEfficiencyView'
import { EnergyGridView } from './components/views/EnergyGridView'
import { MaintenanceAlertsView } from './components/views/MaintenanceAlertsView'
import { StationPhotosView } from './components/views/StationPhotosView'
import { AlternativesView } from './components/views/AlternativesView'

const NAV_ITEMS: {
  id: DashboardTab
  label: string
  breadcrumb: string
  icon: typeof Gauge
}[] = [
  {
    id: DashboardTab.Alternatives,
    label: '5 Alternatives',
    breadcrumb: '5 Style Alternatives',
    icon: Palette,
  },
  {
    id: DashboardTab.PowerStation,
    label: 'Power Station',
    breadcrumb: 'Power Station 01',
    icon: Gauge,
  },
  {
    id: DashboardTab.MachineEfficiency,
    label: 'Machine Efficiency',
    breadcrumb: 'Machine Efficiency',
    icon: Activity,
  },
  {
    id: DashboardTab.EnergyGrid,
    label: 'Energy & Grid',
    breadcrumb: 'Energy & Grid',
    icon: Zap,
  },
  {
    id: DashboardTab.MaintenanceAlerts,
    label: 'Maintenance Alerts',
    breadcrumb: 'Maintenance Alerts',
    icon: AlertTriangle,
  },
  {
    id: DashboardTab.StationPhotos,
    label: 'Station Photos',
    breadcrumb: 'Physical Reference',
    icon: Camera,
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.Alternatives)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme } = useStationTheme()

  const {
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
  } = useFactoryTelemetry()

  const currentNav = NAV_ITEMS.find((item) => item.id === activeTab) ?? NAV_ITEMS[0]

  const handleSelectTab = (tab: DashboardTab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <div
      className="min-h-screen flex transition-colors duration-200"
      style={{ backgroundColor: theme.canvasBg, color: theme.inkText }}
    >
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Workspace Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 border-r-[3px] bv-border flex flex-col justify-between transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: theme.sidebarBg }}
      >
        <div className="flex flex-col">
          <div
            className="h-16 px-5 border-b-[3px] bv-border flex items-center justify-between"
            style={{ backgroundColor: theme.sidebarHeaderBg }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full cartoon-box-sm flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.accentBg }}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0">
                BrickVolt
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-xl cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 flex flex-col gap-1.5" aria-label="Primary Workspace Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-between gap-3 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'cartoon-btn'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white border-2 border-transparent'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: theme.accentBg, color: theme.accentText }
                      : undefined
                  }
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.id === DashboardTab.MaintenanceAlerts && openAlerts.length > 0 && (
                    <span className="font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded-full bg-red-500 text-white">
                      {openAlerts.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div
          className="p-4 border-t-[3px] bv-border flex flex-col gap-3"
          style={{ backgroundColor: theme.sidebarHeaderBg }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Tick Cadence</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-800 border-2 border-slate-950 rounded-xl">
              <button
                type="button"
                onClick={() => setSpeedMultiplier(1)}
                className="px-2.5 py-0.5 rounded-lg font-mono text-[11px] font-bold cursor-pointer"
                style={
                  speedMultiplier === 1
                    ? { backgroundColor: theme.accentBg, color: theme.accentText }
                    : { color: '#CBD5E1' }
                }
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setSpeedMultiplier(2)}
                className="px-2.5 py-0.5 rounded-lg font-mono text-[11px] font-bold cursor-pointer"
                style={
                  speedMultiplier === 2
                    ? { backgroundColor: theme.accentBg, color: theme.accentText }
                    : { color: '#CBD5E1' }
                }
              >
                2x
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={resetStation}
            className="cartoon-btn w-full px-3 py-2 rounded-2xl bg-slate-200 hover:bg-white text-xs font-bold text-slate-950 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Station Defaults
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="h-16 px-4 sm:px-6 border-b-[3px] bv-border sticky top-0 z-20 flex items-center justify-between gap-6"
          style={{ backgroundColor: theme.topBarBg }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 bv-ink rounded-xl cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm bv-muted font-medium truncate">
              <span className="hidden sm:inline whitespace-nowrap">BrickVolt Works</span>
              <span className="hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span className="hidden md:inline whitespace-nowrap">Sector A</span>
              <span className="hidden md:inline" aria-hidden="true">
                /
              </span>
              <span className="font-display text-base font-bold bv-ink truncate">
                {currentNav.breadcrumb}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={injectFault}
              className="cartoon-btn px-3.5 py-2 rounded-2xl bg-red-100 hover:bg-red-200 text-xs font-bold text-slate-950 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ZapOff className="w-3.5 h-3.5 text-red-600" />
              Simulate Fault
            </button>

            <button
              type="button"
              onClick={toggleStream}
              className="cartoon-btn px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
              style={
                isStreaming
                  ? { backgroundColor: theme.accentBg, color: theme.accentText }
                  : { backgroundColor: '#34D399', color: '#0F172A' }
              }
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause Stream
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume Stream
                </>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto">
          {activeTab === DashboardTab.Alternatives && (
            <AlternativesView latest={latest} onNavigateTab={handleSelectTab} />
          )}

          {activeTab === DashboardTab.PowerStation && (
            <PowerStationView
              machines={machines}
              latest={latest}
              history={history}
              breakers={breakers}
              openAlerts={openAlerts}
              activePreset={activePreset}
              shiftGear={shiftGear}
              loadBias={loadBias}
              harmonicTrim={harmonicTrim}
              surgeActive={surgeActive}
              bayLightsOn={bayLightsOn}
              coolantPurgeOn={coolantPurgeOn}
              hornActive={hornActive}
              peakThresholdKw={peakThresholdKw}
              shiftKwh={shiftKwh}
              shiftUnits={shiftUnits}
              hopperPct={hopperPct}
              completedBatches={completedBatches}
              shiftElapsedSec={shiftElapsedSec}
              dispatchLogs={dispatchLogs}
              onSelectPreset={setActivePreset}
              onSelectGear={setShiftGear}
              onChangeLoadBias={setLoadBias}
              onChangePeakThreshold={setPeakThresholdKw}
              onChangeHarmonicTrim={setHarmonicTrim}
              onToggleBreaker={toggleBreaker}
              onToggleBayLights={toggleBayLights}
              onToggleCoolantPurge={toggleCoolantPurge}
              onToggleSurge={triggerSurgeTest}
              onTipHopperBatch={tipHopperBatch}
              onHonkHorn={honkHorn}
              onSendDispatch={sendIntercomDispatch}
              onResolveAlert={resolveAlert}
              onNavigateTab={handleSelectTab}
            />
          )}

          {activeTab === DashboardTab.MachineEfficiency && (
            <MachineEfficiencyView
              machines={machines}
              onToggleBreaker={toggleBreaker}
              onAdjustTargetRpm={adjustMachineTarget}
            />
          )}

          {activeTab === DashboardTab.EnergyGrid && (
            <EnergyGridView
              machines={machines}
              history={history}
              latest={latest}
              breakers={breakers}
              peakThresholdKw={peakThresholdKw}
              shiftKwh={shiftKwh}
              surgeActive={surgeActive}
              activePreset={activePreset}
              onChangePeakThreshold={setPeakThresholdKw}
              onToggleBreaker={toggleBreaker}
              onToggleSurge={triggerSurgeTest}
            />
          )}

          {activeTab === DashboardTab.MaintenanceAlerts && (
            <MaintenanceAlertsView
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
              onDispatch={dispatchTech}
              onResolve={resolveAlert}
              onInjectFault={injectFault}
            />
          )}

          {activeTab === DashboardTab.StationPhotos && <StationPhotosView />}
        </main>
      </div>
    </div>
  )
}
