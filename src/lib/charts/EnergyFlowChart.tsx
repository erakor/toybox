import React, { useState } from 'react'
import { type TelemetryPoint } from '../types'

interface EnergyFlowChartProps {
  history: TelemetryPoint[]
  peakThresholdKw: number
  heightClass?: string
}

export const EnergyFlowChart: React.FC<EnergyFlowChartProps> = ({
  history,
  peakThresholdKw,
  heightClass = 'h-56',
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  if (history.length === 0) {
    return (
      <div
        className={`${heightClass} flex items-center justify-center text-sm text-slate-700 font-medium`}
      >
        No telemetry samples recorded yet.
      </div>
    )
  }

  const w = 640
  const h = 210
  const padL = 44
  const padR = 16
  const padT = 16
  const padB = 28
  const innerW = w - padL - padR
  const innerH = h - padT - padB

  const maxY = Math.max(560, peakThresholdKw + 40, ...history.map((p) => p.totalPowerKw + 20))
  const minY = 0

  const xFor = (idx: number) => padL + (idx / Math.max(1, history.length - 1)) * innerW
  const yFor = (val: number) => padT + innerH - ((val - minY) / (maxY - minY)) * innerH

  const powerPoints = history.map(
    (p, i) => `${xFor(i).toFixed(1)},${yFor(p.totalPowerKw).toFixed(1)}`,
  )
  const regenPoints = history.map((p, i) => `${xFor(i).toFixed(1)},${yFor(p.regenKw).toFixed(1)}`)

  const powerArea = `M ${xFor(0).toFixed(1)},${(padT + innerH).toFixed(1)} L ${powerPoints.join(' L ')} L ${xFor(history.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} Z`
  const regenArea = `M ${xFor(0).toFixed(1)},${(padT + innerH).toFixed(1)} L ${regenPoints.join(' L ')} L ${xFor(history.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} Z`

  const thresholdY = yFor(peakThresholdKw)
  const activePoint = hoverIdx !== null ? history[hoverIdx] : history[history.length - 1]
  const activeX = hoverIdx !== null ? xFor(hoverIdx) : xFor(history.length - 1)

  return (
    <div className="flex flex-col gap-3">
      {/* Legend & Active Readout Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex items-center gap-4 bv-ink">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 bg-amber-400 border bv-border rounded-full inline-block" />
            Gross Load (kW)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 bg-cyan-400 border bv-border rounded-full inline-block" />
            Kinetic Regen (kW)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-rose-500 inline-block" />
            Peak Cap ({peakThresholdKw} kW)
          </span>
        </div>

        <div className="font-mono text-slate-950 bg-slate-100 border-2 bv-border rounded-xl px-2.5 py-0.5 tabular-nums">
          {activePoint.timestamp} · Load {activePoint.totalPowerKw.toFixed(1)} kW · Regen{' '}
          {activePoint.regenKw.toFixed(1)} kW
        </div>
      </div>

      {/* Dark CRT Plot */}
      <div
        className={`relative w-full ${heightClass} crt-screen rounded-2xl p-2 shadow-[0_3px_0_#0F172A]`}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FACC15" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="regenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {[0, 150, 300, 450].map((val) => {
            const y = yFor(val)
            return (
              <g key={val}>
                <line
                  x1={padL}
                  y1={y}
                  x2={w - padR}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeOpacity="0.7"
                />
                <text
                  x={padL - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#CBD5E1"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {val}
                </text>
              </g>
            )
          })}

          <line
            x1={padL}
            y1={thresholdY}
            x2={w - padR}
            y2={thresholdY}
            stroke="#F87171"
            strokeWidth="1.8"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          <path d={powerArea} fill="url(#powerGrad)" />
          <path d={regenArea} fill="url(#regenGrad)" />

          <polyline
            fill="none"
            stroke="#FACC15"
            strokeWidth="3.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={powerPoints.join(' ')}
          />
          <polyline
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={regenPoints.join(' ')}
          />

          <line
            x1={activeX}
            y1={padT}
            x2={activeX}
            y2={padT + innerH}
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle
            cx={activeX}
            cy={yFor(activePoint.totalPowerKw)}
            r="4.5"
            fill="#FACC15"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <circle
            cx={activeX}
            cy={yFor(activePoint.regenKw)}
            r="4"
            fill="#22D3EE"
            stroke="#0F172A"
            strokeWidth="2"
          />

          {[0, Math.floor(history.length / 2), history.length - 1].map((idx) => (
            <text
              key={idx}
              x={xFor(idx)}
              y={h - 6}
              textAnchor={idx === 0 ? 'start' : idx === history.length - 1 ? 'end' : 'middle'}
              fill="#CBD5E1"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
            >
              {history[idx].timestamp}
            </text>
          ))}

          {history.map((_, idx) => {
            const colWidth = innerW / history.length
            return (
              <rect
                key={idx}
                x={xFor(idx) - colWidth / 2}
                y={padT}
                width={colWidth}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(idx)}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
