import React, { useMemo, useState } from 'react'
import { Power, Search, Sliders } from 'lucide-react'
import { MachineStatus, type MachineUnit, useStationTheme } from '@erakor/toybox'

interface MachineEfficiencyViewProps {
  machines: MachineUnit[]
  onToggleBreaker: (machineId: string) => void
  onAdjustTargetRpm: (machineId: string, targetRpm: number) => void
}

export const MachineEfficiencyView: React.FC<MachineEfficiencyViewProps> = ({
  machines,
  onToggleBreaker,
  onAdjustTargetRpm,
}) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | MachineStatus>('ALL')
  const [selectedId, setSelectedId] = useState<string>(machines[0]?.id ?? 'ps-01')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return machines.filter((m) => {
      const matchesFilter = statusFilter === 'ALL' || m.status === statusFilter
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.subsystem.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  }, [machines, search, statusFilter])

  const selectedMachine = machines.find((m) => m.id === selectedId) ?? machines[0]

  const activeMachines = machines.filter((m) => m.active)
  const avgAvailability = activeMachines.length
    ? activeMachines.reduce((a, m) => a + m.availability, 0) / activeMachines.length
    : 0
  const avgPerformance = activeMachines.length
    ? activeMachines.reduce((a, m) => a + m.performance, 0) / activeMachines.length
    : 0
  const avgQuality = activeMachines.length
    ? activeMachines.reduce((a, m) => a + m.quality, 0) / activeMachines.length
    : 0
  const totalThroughput = machines.reduce((a, m) => a + m.throughputUnitsHr, 0)

  const { theme } = useStationTheme()

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="cartoon-box bv-card rounded-3xl p-4">
          <div className="text-xs font-bold bv-muted">Mean Availability</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            {avgAvailability.toFixed(1)}%
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">Uptime vs scheduled shift</div>
        </div>
        <div className="cartoon-box rounded-3xl p-4" style={{ backgroundColor: theme.kpiYellowBg }}>
          <div className="text-xs font-bold bv-muted">Mean Performance</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            {avgPerformance.toFixed(1)}%
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">Actual vs target cycle speed</div>
        </div>
        <div className="cartoon-box bv-card rounded-3xl p-4">
          <div className="text-xs font-bold bv-muted">Mean Quality Yield</div>
          <div
            className={`font-mono text-2xl font-bold tabular-nums mt-1 ${theme.isDarkSurface ? 'text-emerald-300' : 'text-emerald-700'}`}
          >
            {avgQuality.toFixed(1)}%
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">First-pass modular tolerance</div>
        </div>
        <div className="cartoon-box rounded-3xl p-4" style={{ backgroundColor: theme.kpiBlueBg }}>
          <div className="text-xs font-bold bv-muted">Combined Throughput</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            {totalThroughput.toLocaleString()} u/hr
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">
            Across {activeMachines.length} active bays
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200 border-[2.5px] bv-border rounded-2xl overflow-x-auto">
          {(
            [
              'ALL',
              MachineStatus.Optimal,
              MachineStatus.Warning,
              MachineStatus.Critical,
              MachineStatus.Standby,
            ] as const
          ).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-400 text-slate-950 border-2 border-slate-950'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              {st === 'ALL' ? 'All Units' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by bay code or machine..."
            className="w-full pl-9 pr-4 py-2 bg-white border-[2.5px] bv-border rounded-2xl text-xs font-medium text-slate-950 placeholder:text-slate-500 focus:outline-none focus:bg-amber-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 cartoon-box bv-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-[3px] bv-border text-[11px] font-bold bv-muted bv-card-header">
                  <th className="py-3 px-4">Machine Unit</th>
                  <th className="py-3 px-3">State</th>
                  <th className="py-3 px-3 text-right">OEE</th>
                  <th className="py-3 px-3 text-right">RPM</th>
                  <th className="py-3 px-3 text-right">Vib</th>
                  <th className="py-3 px-3 text-right">Trend</th>
                  <th className="py-3 px-4 text-right">Breaker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/40 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center bv-muted font-medium">
                      No machines match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => {
                    const isSelected = m.id === selectedMachine?.id
                    const sparkPoints = m.efficiencyHistory
                      .map((val, idx) => {
                        const x = (idx / Math.max(1, m.efficiencyHistory.length - 1)) * 56
                        const y = 20 - ((Math.max(50, val) - 50) / 50) * 18
                        return `${x.toFixed(1)},${y.toFixed(1)}`
                      })
                      .join(' ')

                    return (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedId(m.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-400/20' : 'hover:bg-amber-400/10'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold bv-ink">
                            <span
                              className={`font-mono mr-1.5 ${theme.isDarkSurface ? 'text-cyan-300' : 'text-blue-700'}`}
                            >
                              {m.code}
                            </span>
                            {m.name}
                          </div>
                          <div className="text-[11px] bv-muted">{m.subsystem}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-bold ${
                              m.status === MachineStatus.Optimal
                                ? theme.isDarkSurface
                                  ? 'text-emerald-300'
                                  : 'text-emerald-700'
                                : m.status === MachineStatus.Warning
                                  ? theme.isDarkSurface
                                    ? 'text-amber-300'
                                    : 'text-amber-700'
                                  : m.status === MachineStatus.Critical
                                    ? theme.isDarkSurface
                                      ? 'text-rose-300'
                                      : 'text-red-600'
                                    : 'bv-muted'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold bv-ink tabular-nums">
                          {m.active ? `${m.oee.toFixed(1)}%` : '0.0%'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold bv-ink tabular-nums">
                          {m.actualRpm}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold bv-muted tabular-nums">
                          {m.vibrationMmS.toFixed(1)} mm/s
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="sr-only">{`${m.name} trend`}</span>
                          <svg viewBox="0 0 56 22" className="w-14 h-5 inline-block">
                            <polyline
                              fill="none"
                              stroke={
                                m.status === MachineStatus.Critical
                                  ? '#DC2626'
                                  : m.status === MachineStatus.Warning
                                    ? '#D97706'
                                    : '#16A34A'
                              }
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={sparkPoints}
                            />
                          </svg>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onToggleBreaker(m.id)
                            }}
                            className={`cartoon-btn px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1 ${
                              m.active
                                ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            {m.active ? 'Online' : 'Standby'}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedMachine && (
          <div className="xl:col-span-4 cartoon-box rounded-3xl steel-plate p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div
                  className={`font-mono text-xs font-bold ${theme.isDarkSurface ? 'text-cyan-300' : 'text-blue-800'}`}
                >
                  {selectedMachine.code} · {selectedMachine.hardwareRef}
                </div>
                <h3 className="font-display text-xl font-bold bv-ink mt-0.5">
                  {selectedMachine.name}
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-xl border-2 bv-border ${
                  selectedMachine.status === MachineStatus.Optimal
                    ? 'bg-emerald-300 text-slate-950'
                    : selectedMachine.status === MachineStatus.Warning
                      ? 'bg-amber-300 text-slate-950'
                      : selectedMachine.status === MachineStatus.Critical
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-300 text-slate-900'
                }`}
              >
                {selectedMachine.status}
              </span>
            </div>

            <div className="space-y-2.5 pt-3 border-t-2 bv-border">
              {[
                { label: 'Availability', val: selectedMachine.availability, bar: 'bg-cyan-400' },
                { label: 'Performance', val: selectedMachine.performance, bar: 'bg-amber-400' },
                { label: 'Quality Yield', val: selectedMachine.quality, bar: 'bg-emerald-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1 font-bold">
                    <span className="bv-ink">{item.label}</span>
                    <span className="font-mono bv-ink tabular-nums">
                      {selectedMachine.active ? `${item.val.toFixed(1)}%` : '0.0%'}
                    </span>
                  </div>
                  <div className="h-3 bg-white border-2 bv-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bar} transition-all duration-300`}
                      style={{ width: `${selectedMachine.active ? item.val : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t-2 bv-border bv-card cartoon-box-sm rounded-2xl p-3.5">
              <div className="flex items-center justify-between text-xs mb-2">
                <label
                  htmlFor="target-rpm-slider"
                  className="bv-ink font-bold flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  Target Governor RPM
                </label>
                <span className="font-mono font-bold bv-ink tabular-nums">
                  {selectedMachine.targetRpm} RPM
                </span>
              </div>
              <input
                id="target-rpm-slider"
                type="range"
                min={600}
                max={2200}
                step={25}
                value={selectedMachine.targetRpm}
                onChange={(e) => onAdjustTargetRpm(selectedMachine.id, Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-300 rounded-full"
              />
              <div className="flex justify-between text-[11px] font-mono font-bold bv-muted mt-1">
                <span>600 RPM</span>
                <span>Actual: {selectedMachine.actualRpm}</span>
                <span>2200 RPM</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 bv-border text-xs">
              <div className="bv-card border-2 bv-border rounded-2xl p-2.5">
                <div className="bv-muted font-semibold">Power Draw</div>
                <div className="font-mono text-sm font-bold bv-ink tabular-nums">
                  {selectedMachine.powerKw.toFixed(1)} kW
                </div>
              </div>
              <div className="bv-card border-2 bv-border rounded-2xl p-2.5">
                <div className="bv-muted font-semibold">Core Temp</div>
                <div className="font-mono text-sm font-bold bv-ink tabular-nums">
                  {selectedMachine.temperatureC.toFixed(1)} °C
                </div>
              </div>
              <div className="bv-card border-2 bv-border rounded-2xl p-2.5">
                <div className="bv-muted font-semibold">Conduit Pressure</div>
                <div className="font-mono text-sm font-bold bv-ink tabular-nums">
                  {selectedMachine.pressurePsi.toFixed(1)} PSI
                </div>
              </div>
              <div className="bv-card border-2 bv-border rounded-2xl p-2.5">
                <div className="bv-muted font-semibold">Throughput</div>
                <div className="font-mono text-sm font-bold bv-ink tabular-nums">
                  {selectedMachine.throughputUnitsHr} u/hr
                </div>
              </div>
              <div className="col-span-2 bv-card border-2 bv-border rounded-2xl p-2.5 flex items-center justify-between">
                <span className="bv-muted font-semibold">Preventive Service Due</span>
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    selectedMachine.serviceHoursLeft < 24 ? 'text-amber-600' : 'bv-ink'
                  }`}
                >
                  {selectedMachine.serviceHoursLeft.toFixed(1)} hrs remaining
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
