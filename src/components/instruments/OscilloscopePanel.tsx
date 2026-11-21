import React from 'react'
import { useStationTheme } from '../../context/ThemeContext'
import { type BreakerChannel } from '../../types/factory'

interface OscilloscopePanelProps {
  gridHz: number
  busVoltageV: number
  harmonicDistortionPct: number
  tick: number
  breakers: BreakerChannel[]
  onToggleBreaker: (machineId: string) => void
}

export const OscilloscopePanel: React.FC<OscilloscopePanelProps> = ({
  gridHz,
  busVoltageV,
  harmonicDistortionPct,
  tick,
  breakers,
  onToggleBreaker,
}) => {
  const { theme } = useStationTheme()
  const points: string[] = []
  const width = 240
  const height = 76
  const amp = 18 + harmonicDistortionPct * 2.2
  const freq = 0.14 + (gridHz - 60) * 0.2

  for (let x = 0; x <= width; x += 4) {
    const phase = x * freq + tick * 0.9
    const y =
      height / 2 + Math.sin(phase) * amp + Math.sin(phase * 3) * (harmonicDistortionPct * 1.1)
    points.push(`${x},${y.toFixed(1)}`)
  }

  return (
    <div className="flex flex-col gap-4 h-full justify-between">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">
            Harmonic Oscilloscope & Breakers
          </h3>
          <p className="text-xs font-medium bv-muted">
            Bus phase telemetry · Click fuses to toggle bays
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-slate-950 bg-emerald-300 cartoon-box-sm rounded-xl px-2.5 py-0.5 tabular-nums">
          {gridHz.toFixed(2)} Hz · {busVoltageV.toFixed(1)} V
        </span>
      </div>

      {/* Top Row: Green Oscilloscope CRT + Dual Green Phase Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center steel-plate-dark cartoon-box-sm rounded-2xl p-3">
        <div
          className="crt-screen rounded-2xl p-2.5 relative overflow-hidden"
          style={{ backgroundColor: '#0B2615' }}
        >
          <svg viewBox="0 0 240 76" className="w-full h-20">
            {[19, 38, 57].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="240"
                y2={y}
                stroke="#166534"
                strokeWidth="1"
                strokeLinecap="round"
              />
            ))}
            {[40, 80, 120, 160, 200].map((x) => (
              <line
                key={x}
                x1={x}
                y1="0"
                x2={x}
                y2="76"
                stroke="#166534"
                strokeWidth="1"
                strokeLinecap="round"
              />
            ))}
            {Array.from({ length: 13 }, (_, i) => (
              <line
                key={i}
                x1={i * 20}
                y1="68"
                x2={i * 20}
                y2="76"
                stroke="#84CC16"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ))}
            <polyline
              fill="none"
              stroke="#A3E635"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points.join(' ')}
            />
          </svg>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-lime-300 mt-1 tabular-nums">
            <span>THD {harmonicDistortionPct.toFixed(2)}%</span>
            <span>PHASE LOCKED</span>
          </div>
        </div>

        <div className="flex sm:flex-col items-center justify-center gap-3 px-1">
          {[
            { label: 'PH-A', pct: Math.min(98, 72 + harmonicDistortionPct * 4) },
            { label: 'PH-B', pct: Math.min(96, 68 - harmonicDistortionPct * 2) },
          ].map((dial) => (
            <div key={dial.label} className="flex items-center gap-2">
              <svg viewBox="0 0 44 44" className="w-10 h-10">
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="#166534"
                  stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
                  strokeWidth={theme.svgStrokeWidth}
                />
                <path
                  d={`M22,22 L22,5 A17,17 0 ${dial.pct > 50 ? 1 : 0},1 ${
                    22 + 17 * Math.sin((dial.pct / 100) * 2 * Math.PI)
                  },${22 - 17 * Math.cos((dial.pct / 100) * 2 * Math.PI)} Z`}
                  fill="#A3E635"
                  stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
                  strokeWidth={theme.svgStrokeWidth === 0 ? 0 : 2}
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="22" r="3.5" fill="#0F172A" />
              </svg>
              <div className="text-[11px] font-mono font-bold bv-ink tabular-nums">
                {dial.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Soft-Rounded Breaker Fuses */}
      <div>
        <div className="flex items-center justify-between mb-2 text-xs font-bold bv-ink">
          <span>Bus Circuit Breakers (6 Bays)</span>
          <span className="font-mono tabular-nums">
            {breakers.filter((b) => b.closed).length}/{breakers.length} Closed
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {breakers.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onToggleBreaker(b.machineId)}
              aria-pressed={b.closed}
              title={`Toggle ${b.label} (${b.closed ? 'Online' : 'Isolated'})`}
              className={`cartoon-btn flex flex-col items-center p-2 rounded-2xl cursor-pointer ${
                b.closed ? 'bg-slate-100 hover:bg-amber-100' : 'bg-slate-400 hover:bg-slate-300'
              }`}
            >
              <div className="w-7 h-12 rounded-xl bg-slate-950 p-1 flex flex-col justify-between border border-slate-950">
                <div
                  className={`h-4 rounded-full transition-colors ${
                    b.closed ? 'bg-orange-500' : 'bg-slate-700'
                  }`}
                />
                <div
                  className={`h-4 rounded-full transition-colors ${
                    b.closed ? 'bg-lime-400' : 'bg-red-500'
                  }`}
                />
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-950 mt-1.5 tabular-nums">
                {b.label}
              </span>
              <span className="font-mono text-[10px] font-semibold text-slate-700 tabular-nums">
                {b.closed ? `${b.amps}A` : 'OFF'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
