import React from 'react'
import { RotateCw, Timer } from 'lucide-react'
import { useToyboxTheme } from '../theme/ThemeProvider'
import { type MachineUnit } from '../types'

interface HopperCrewPanelProps {
  machines: MachineUnit[]
  hopperPct: number
  completedBatches: number
  onTipHopperBatch: () => void
  bayLightsOn: boolean
}

export const HopperCrewPanel: React.FC<HopperCrewPanelProps> = ({
  machines,
  hopperPct,
  completedBatches,
  onTipHopperBatch,
  bayLightsOn,
}) => {
  const { theme } = useToyboxTheme()
  const isLineless = theme.svgStrokeWidth === 0

  const activeList = machines.filter((m) => m.active)
  const avgAvailability = activeList.length
    ? activeList.reduce((a, m) => a + m.availability, 0) / activeList.length
    : 0
  const avgPerformance = activeList.length
    ? activeList.reduce((a, m) => a + m.performance, 0) / activeList.length
    : 0
  const avgQuality = activeList.length
    ? activeList.reduce((a, m) => a + m.quality, 0) / activeList.length
    : 0

  const nextServiceMachine = [...machines].sort(
    (a, b) => a.serviceHoursLeft - b.serviceHoursLeft,
  )[0]

  return (
    <div className="flex flex-col justify-between gap-3.5 h-full">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">Cab Crew, Hopper & OEE Split</h3>
          <p className="text-xs font-medium bv-muted">
            Batch dumper bin · Availability / Performance / Quality & service timer
          </p>
        </div>
        <span className="font-mono text-xs font-bold bv-ink bg-emerald-300 cartoon-box-sm rounded-xl px-2.5 py-0.5 tabular-nums">
          {completedBatches} Batches
        </span>
      </div>

      {/* Top Row: Cartoon Cab Crew Sticker + Red Tipping Hopper Bin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Dual-Operator Sky-Blue Cab Window Sticker */}
        <div
          className="rounded-2xl cartoon-box-sm p-2.5 flex items-center gap-3"
          style={{ backgroundColor: '#38BDF8' }}
        >
          <svg viewBox="0 0 116 68" className="w-24 h-14 shrink-0">
            {/* Operator 1 (Yellow Pigtails & Red Overalls) */}
            <circle
              cx="32"
              cy="28"
              r="14"
              fill="#FDBA74"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2.5}
            />
            <circle
              cx="17"
              cy="28"
              r="6"
              fill="#FACC15"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2}
            />
            <circle
              cx="47"
              cy="28"
              r="6"
              fill="#FACC15"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2}
            />
            <path
              d="M 20 22 Q 32 10 44 22"
              fill="#FACC15"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2}
              strokeLinecap="round"
            />
            <circle cx="27" cy="27" r="2" fill="#1E293B" />
            <circle cx="37" cy="27" r="2" fill="#1E293B" />
            <path
              d="M 27 33 Q 32 37 37 33"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <rect
              x="18"
              y="42"
              width="28"
              height="22"
              rx="10"
              fill="#EF4444"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2.5}
            />

            {/* Operator 2 (Yellow Hardhat & Blue Check Shirt) */}
            <circle
              cx="84"
              cy="30"
              r="14"
              fill="#FDBA74"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2.5}
            />
            <rect
              x="68"
              y="13"
              width="32"
              height="10"
              rx="5"
              fill="#FACC15"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2}
            />
            <circle cx="79" cy="29" r="2" fill="#1E293B" />
            <circle cx="89" cy="29" r="2" fill="#1E293B" />
            <path
              d="M 79 35 Q 84 39 89 35"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <rect
              x="70"
              y="44"
              width="28"
              height="20"
              rx="10"
              fill="#1D4ED8"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2.5}
            />
          </svg>
          <div className="min-w-0">
            <div className="font-display text-sm font-bold text-slate-950">Shift Crew A-04</div>
            <div className="text-[11px] font-bold text-slate-900">K. Sato · M. Lindqvist</div>
            <div className="text-[10px] font-mono font-bold text-slate-900 mt-0.5">
              {activeList.length}/6 Active · {bayLightsOn ? 'Lights ON' : 'Std'}
            </div>
          </div>
        </div>

        {/* Red Tipping Hopper Bin Module */}
        <div className="bv-card cartoon-box-sm rounded-2xl p-2.5 flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold bv-ink mb-1">
              <span>Hopper Bin</span>
              <span className="font-mono tabular-nums">{hopperPct.toFixed(0)}%</span>
            </div>
            <div
              className="h-4 rounded-full bg-slate-200 overflow-hidden p-0.5"
              style={{ border: isLineless ? 'none' : `2px solid ${theme.borderColor}` }}
            >
              <div
                className="h-full rounded-full bg-red-500 transition-all duration-300"
                style={{ width: `${Math.min(100, hopperPct)}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onTipHopperBatch}
            className="cartoon-btn px-3 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Tip Batch
          </button>
        </div>
      </div>

      {/* Bottom Row: OEE 3-Factor Breakdown + Preventive Service Countdown */}
      <div className="bv-card cartoon-box-sm rounded-2xl p-3 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Availability', val: avgAvailability, color: 'bg-sky-400' },
            { label: 'Performance', val: avgPerformance, color: 'bg-amber-400' },
            { label: 'Quality', val: avgQuality, color: 'bg-emerald-400' },
          ].map((factor) => (
            <div key={factor.label}>
              <div className="flex items-center justify-between text-[10px] font-bold bv-ink mb-1">
                <span>{factor.label}</span>
                <span className="font-mono tabular-nums">{factor.val.toFixed(0)}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${factor.color} transition-all duration-300`}
                  style={{ width: `${factor.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {nextServiceMachine && (
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
            <span className="font-bold bv-muted inline-flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-amber-600" />
              Next Preventive Service:
            </span>
            <span className="font-mono font-bold bv-ink tabular-nums">
              {nextServiceMachine.code} in {nextServiceMachine.serviceHoursLeft.toFixed(1)} hrs
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
