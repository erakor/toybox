import React from 'react'
import { Zap } from 'lucide-react'
import { useStationTheme } from '../../context/ThemeContext'
import {
  type BreakerChannel,
  type MachineUnit,
  type PowerPreset,
  type TelemetryPoint,
} from '../../types/factory'
import { EnergyFlowChart } from '../charts/EnergyFlowChart'
import { BatterySunburstCore } from '../instruments/BatterySunburstCore'

interface EnergyGridViewProps {
  machines: MachineUnit[]
  history: TelemetryPoint[]
  latest: TelemetryPoint
  breakers: BreakerChannel[]
  peakThresholdKw: number
  shiftKwh: number
  surgeActive: boolean
  activePreset: PowerPreset
  onChangePeakThreshold: (kw: number) => void
  onToggleBreaker: (machineId: string) => void
  onToggleSurge: () => void
}

export const EnergyGridView: React.FC<EnergyGridViewProps> = ({
  machines,
  history,
  latest,
  breakers,
  peakThresholdKw,
  shiftKwh,
  surgeActive,
  activePreset,
  onChangePeakThreshold,
  onToggleBreaker,
  onToggleSurge,
}) => {
  const { theme } = useStationTheme()
  const ratePerKwh = 0.142
  const shiftCostUsd = shiftKwh * ratePerKwh
  const netPowerKw = Math.max(0, latest.totalPowerKw - latest.regenKw)
  const headroomKw = peakThresholdKw - latest.totalPowerKw

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="cartoon-box rounded-3xl p-4" style={{ backgroundColor: theme.kpiYellowBg }}>
          <div className="text-xs font-bold bv-muted">Net Grid Import</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            {netPowerKw.toFixed(1)} kW
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">
            Gross {latest.totalPowerKw.toFixed(1)} kW · Regen {latest.regenKw.toFixed(1)} kW
          </div>
        </div>
        <div className="cartoon-box bv-card rounded-3xl p-4">
          <div className="text-xs font-bold bv-muted">Peak Cap Headroom</div>
          <div
            className={`font-mono text-2xl font-bold tabular-nums mt-1 ${
              headroomKw < 30
                ? theme.isDarkSurface
                  ? 'text-rose-300'
                  : 'text-red-600'
                : theme.isDarkSurface
                  ? 'text-emerald-300'
                  : 'text-emerald-700'
            }`}
          >
            {headroomKw >= 0 ? `+${headroomKw.toFixed(1)}` : headroomKw.toFixed(1)} kW
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">
            Ceiling {peakThresholdKw} kW · {activePreset}
          </div>
        </div>
        <div className="cartoon-box bv-card rounded-3xl p-4">
          <div className="text-xs font-bold bv-muted">Shift Consumption Cost</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            ${shiftCostUsd.toFixed(2)}
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5 tabular-nums">
            {shiftKwh.toFixed(1)} kWh @ ${ratePerKwh.toFixed(3)}/kWh
          </div>
        </div>
        <div className="cartoon-box rounded-3xl p-4" style={{ backgroundColor: theme.kpiBlueBg }}>
          <div className="text-xs font-bold bv-muted">Bus Voltage & Frequency</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            {latest.busVoltageV.toFixed(1)} V
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5 tabular-nums">
            {latest.gridHz.toFixed(2)} Hz · THD {latest.harmonicDistortionPct.toFixed(2)}%
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-7 cartoon-box rounded-3xl steel-plate p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold bv-ink">Real-Time Load Demand Curve</h3>
              <p className="text-xs font-medium bv-muted">
                Adjust peak demand cap to monitor load-shedding headroom
              </p>
            </div>
            <div className="flex items-center gap-3 bv-card border-2 bv-border rounded-2xl px-3.5 py-1.5">
              <label htmlFor="peak-cap-slider" className="text-xs font-bold bv-ink">
                Cap: <span className="font-mono tabular-nums">{peakThresholdKw} kW</span>
              </label>
              <input
                id="peak-cap-slider"
                type="range"
                min={340}
                max={580}
                step={10}
                value={peakThresholdKw}
                onChange={(e) => onChangePeakThreshold(Number(e.target.value))}
                className="w-28 accent-amber-500 cursor-pointer h-2 bg-slate-300 rounded-full"
              />
            </div>
          </div>

          <EnergyFlowChart history={history} peakThresholdKw={peakThresholdKw} heightClass="h-64" />
        </div>

        <div className="xl:col-span-5 cartoon-box rounded-3xl steel-plate p-5">
          <BatterySunburstCore
            batteryPct={latest.batteryPct}
            totalPowerKw={latest.totalPowerKw}
            regenKw={latest.regenKw}
            shiftKwh={shiftKwh}
            surgeActive={surgeActive}
            onToggleSurge={onToggleSurge}
          />
        </div>
      </div>

      <section className="cartoon-box bv-card rounded-3xl overflow-hidden">
        <div className="px-5 py-3.5 border-b-[3px] bv-border bv-card-header flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold bv-ink">
              Bay Energy Allocation & Breaker Load Shedding
            </h3>
            <p className="text-xs font-medium bv-muted">
              Isolate non-critical bays to drop station demand below peak tariff threshold
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-slate-950 bg-amber-300 border-2 bv-border rounded-xl px-2.5 py-1 tabular-nums">
            {breakers.filter((b) => b.closed).length} Active Feeds
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 bv-border text-[11px] font-bold bv-muted bv-card-header">
                <th className="py-2.5 px-4">Unit</th>
                <th className="py-2.5 px-3">Share of Load</th>
                <th className="py-2.5 px-3 text-right">Current (A)</th>
                <th className="py-2.5 px-3 text-right">Power (kW)</th>
                <th className="py-2.5 px-3 text-right">Est. Shift Cost</th>
                <th className="py-2.5 px-4 text-right">Feed Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300/40 text-xs">
              {machines.map((m, idx) => {
                const breaker = breakers[idx]
                const sharePct =
                  latest.totalPowerKw > 0 ? (m.powerKw / latest.totalPowerKw) * 100 : 0
                return (
                  <tr key={m.id} className="hover:bg-amber-400/10 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono font-bold mr-1.5 ${theme.isDarkSurface ? 'text-cyan-300' : 'text-blue-700'}`}
                      >
                        {m.code}
                      </span>
                      <span className="font-bold bv-ink">{m.name}</span>
                    </td>
                    <td className="py-3 px-3 w-48">
                      <span className="sr-only">{`${m.name} share of output`}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-slate-200 border bv-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all duration-300"
                            style={{ width: `${Math.min(100, sharePct)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold bv-ink tabular-nums w-11 text-right">
                          {sharePct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold bv-ink tabular-nums">
                      {breaker ? `${breaker.amps.toFixed(1)} A` : '0.0 A'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold bv-ink tabular-nums">
                      {m.powerKw.toFixed(1)} kW
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold bv-muted tabular-nums">
                      ${(m.powerKw * 8 * ratePerKwh).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleBreaker(m.id)}
                        className={`cartoon-btn px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1 ${
                          m.active
                            ? 'bg-amber-300 text-slate-950 hover:bg-red-400 hover:text-white'
                            : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        {m.active ? 'Shed Load' : 'Restore Feed'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
