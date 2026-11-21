import React from 'react'
import { Zap } from 'lucide-react'
import { useToyboxTheme } from '../theme/ThemeProvider'

interface BatterySunburstCoreProps {
  batteryPct: number
  totalPowerKw: number
  regenKw: number
  shiftKwh: number
  surgeActive: boolean
  onToggleSurge: () => void
}

export const BatterySunburstCore: React.FC<BatterySunburstCoreProps> = ({
  batteryPct,
  totalPowerKw,
  regenKw,
  shiftKwh,
  surgeActive,
  onToggleSurge,
}) => {
  const { theme } = useToyboxTheme()
  const clampedPct = Math.min(100, Math.max(0, batteryPct))
  const netDraw = Number((totalPowerKw - regenKw).toFixed(1))

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">Battery & Energy Surge Core</h3>
          <p className="text-xs font-medium bv-muted">
            Primary kinetic cell · {surgeActive ? 'Peak Surge Load Active' : 'Balanced Storage'}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleSurge}
          className={`cartoon-btn px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            surgeActive
              ? 'bg-[#dc2626] text-white hover:bg-red-500'
              : 'bg-amber-300 text-slate-950 hover:bg-amber-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {surgeActive ? 'Stop Surge Test' : 'Run Surge Test'}
        </button>
      </div>

      {/* Comic Sunburst Hero Panel */}
      <div className="relative rounded-3xl cartoon-box overflow-hidden sunburst-orange min-h-[225px] flex items-center justify-center p-5">
        {theme.svgStrokeWidth > 0 &&
          ['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
            <span
              key={pos}
              className="absolute w-3.5 h-3.5 rounded-full bg-slate-200 border-2 bv-border"
              style={{
                top: pos.includes('top') ? '0.75rem' : undefined,
                bottom: pos.includes('bottom') ? '0.75rem' : undefined,
                left: pos.includes('left') ? '0.75rem' : undefined,
                right: pos.includes('right') ? '0.75rem' : undefined,
              }}
            />
          ))}

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-center gap-5">
          <div className="w-28 h-40 relative flex items-center justify-center">
            <svg viewBox="0 0 112 168" className="w-full h-full">
              <rect
                x="35"
                y="6"
                width="42"
                height="16"
                rx="8"
                fill="#0284C7"
                stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
                strokeWidth={theme.svgStrokeWidth}
              />
              <rect
                x="14"
                y="18"
                width="84"
                height="140"
                rx="22"
                fill="#1E293B"
                stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
                strokeWidth={theme.svgStrokeWidth === 0 ? 0 : theme.svgStrokeWidth + 0.5}
              />
              <rect
                x="20"
                y="24"
                width="72"
                height="128"
                rx="17"
                fill="#0F172A"
                stroke="#0EA5E9"
                strokeWidth="4"
              />

              <defs>
                <clipPath id="cartoonBatteryClip">
                  <rect x="24" y="28" width="64" height="120" rx="13" />
                </clipPath>
              </defs>
              <g clipPath="url(#cartoonBatteryClip)">
                <rect
                  x="24"
                  y={28 + (1 - clampedPct / 100) * 120}
                  width="64"
                  height={(clampedPct / 100) * 120}
                  fill={surgeActive ? '#FACC15' : '#0284C7'}
                  style={{ transition: 'y 350ms ease, height 350ms ease' }}
                />
                <rect x="28" y="34" width="10" height="108" rx="5" fill="#FFFFFF" opacity="0.2" />
                {[54, 78, 102, 126].map((yPos) => (
                  <line
                    key={yPos}
                    x1="24"
                    y1={yPos}
                    x2="88"
                    y2={yPos}
                    stroke="#0F172A"
                    strokeWidth="2.5"
                    opacity={theme.svgStrokeWidth === 0 ? 0.15 : 0.35}
                  />
                ))}
              </g>

              <path
                d="M 60 48 Q 62 46 60 52 L 42 84 Q 39 89 45 89 L 55 89 L 50 124 Q 49 128 53 123 L 73 89 Q 76 84 70 84 L 59 84 Z"
                fill={surgeActive ? '#FEF08A' : '#22D3EE'}
                stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
                strokeWidth={theme.svgStrokeWidth === 0 ? 0 : theme.svgStrokeWidth + 0.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="crt-screen rounded-2xl px-4 py-3.5 min-w-[172px]">
            <div className="text-xs font-semibold text-slate-300">Cell Reserve</div>
            <div className="font-mono text-2xl font-bold text-cyan-300 tabular-nums mt-0.5">
              {clampedPct.toFixed(1)}%
            </div>
            <div className="h-0.5 bg-slate-700 rounded-full my-2" />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-400">Net Grid</div>
                <div className="font-mono font-bold text-white tabular-nums">{netDraw} kW</div>
              </div>
              <div>
                <div className="text-slate-400">Regen</div>
                <div className="font-mono font-bold text-emerald-400 tabular-nums">
                  +{regenKw.toFixed(1)} kW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3-column quantitative strip */}
      <div
        className={`grid grid-cols-3 bv-card cartoon-box-sm rounded-2xl py-2.5 px-2 text-center ${
          theme.svgStrokeWidth === 0 ? 'divide-x divide-slate-200' : 'divide-x-2 bv-border'
        }`}
      >
        <div className="bv-border">
          <div className="text-[11px] font-semibold bv-muted">Gross Draw</div>
          <div className="font-mono text-sm font-bold bv-ink tabular-nums">
            {totalPowerKw.toFixed(1)} kW
          </div>
        </div>
        <div className="bv-border">
          <div className="text-[11px] font-semibold bv-muted">Shift Total</div>
          <div className="font-mono text-sm font-bold bv-ink tabular-nums">
            {shiftKwh.toFixed(1)} kWh
          </div>
        </div>
        <div className="bv-border">
          <div className="text-[11px] font-semibold bv-muted">Recovery Ratio</div>
          <div
            className={`font-mono text-sm font-bold tabular-nums ${
              theme.isDarkSurface ? 'text-emerald-300' : 'text-emerald-700'
            }`}
          >
            {totalPowerKw > 0 ? ((regenKw / totalPowerKw) * 100).toFixed(1) : '0.0'}%
          </div>
        </div>
      </div>
    </div>
  )
}
