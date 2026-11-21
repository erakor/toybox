import React, { useState } from 'react'
import { useToyboxTheme } from '../theme/ThemeProvider'
import { type MachineUnit } from '../types'

interface SilhouetteScannerProps {
  machine: MachineUnit
}

export const SilhouetteScanner: React.FC<SilhouetteScannerProps> = ({ machine }) => {
  const { theme } = useToyboxTheme()
  const [bayMode, setBayMode] = useState<'roller' | 'assembly'>('roller')

  const driftMm = machine.active ? Number((machine.vibrationMmS * 0.85).toFixed(2)) : 0

  return (
    <div className="flex flex-col gap-3 h-full justify-between">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">Kinetic Bay Scanner</h3>
          <p className="text-xs font-medium bv-muted">
            {machine.code} · {machine.name}
          </p>
        </div>

        {/* Rounded Bay Silhouette Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200 cartoon-box-sm rounded-2xl">
          <button
            type="button"
            onClick={() => setBayMode('roller')}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              bayMode === 'roller'
                ? 'bg-purple-600 text-white'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Roller Rig
          </button>
          <button
            type="button"
            onClick={() => setBayMode('assembly')}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              bayMode === 'assembly'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Bot Rig
          </button>
        </div>
      </div>

      {/* Purple Sunburst Reticle Screen */}
      <div className="relative rounded-3xl cartoon-box sunburst-purple h-52 overflow-hidden flex items-center justify-center p-4">
        <svg
          viewBox="0 0 260 180"
          className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 28 10 L 18 10 Q 10 10 10 18 L 10 162 Q 10 170 18 170 L 28 170"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 232 10 L 242 10 Q 250 10 250 18 L 250 162 Q 250 170 242 170 L 232 170"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[35, 62, 90, 118, 145].map((y) => (
            <React.Fragment key={y}>
              <line
                x1="10"
                y1={y}
                x2="22"
                y2={y}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="238"
                y1={y}
                x2="250"
                y2={y}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </React.Fragment>
          ))}
        </svg>

        <div className="relative z-10 flex items-center justify-center">
          {bayMode === 'roller' ? (
            <svg viewBox="0 0 120 140" className="w-28 h-32">
              <g
                fill={machine.active ? '#F472B6' : '#94A3B8'}
                stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
                strokeWidth={theme.svgStrokeWidth === 0 ? 0 : 2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <circle cx="52" cy="24" r="15" />
                <rect x="44" y="40" width="22" height="38" rx="9" />
                <rect x="26" y="46" width="22" height="10" rx="5" transform="rotate(-24 37 51)" />
                <rect x="61" y="47" width="24" height="10" rx="5" transform="rotate(24 73 52)" />
                <rect x="42" y="75" width="12" height="36" rx="6" transform="rotate(14 48 93)" />
                <rect x="59" y="74" width="12" height="34" rx="6" transform="rotate(-20 65 91)" />
                <rect x="28" y="110" width="24" height="10" rx="5" />
                <rect x="68" y="102" width="24" height="10" rx="5" />
                <circle cx="34" cy="124" r="4.5" />
                <circle cx="46" cy="124" r="4.5" />
                <circle cx="74" cy="116" r="4.5" />
                <circle cx="86" cy="116" r="4.5" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 120 140" className="w-28 h-32">
              <g
                fill={machine.active ? '#FACC15' : '#94A3B8'}
                stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
                strokeWidth={theme.svgStrokeWidth === 0 ? 0 : 2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                transform="rotate(-10 60 70)"
              >
                <rect x="52" y="12" width="16" height="9" rx="4.5" />
                <rect x="43" y="20" width="34" height="23" rx="9" />
                <rect x="40" y="44" width="40" height="40" rx="11" />
                <rect x="23" y="46" width="14" height="32" rx="7" />
                <rect x="83" y="46" width="14" height="32" rx="7" />
                <rect x="44" y="85" width="13" height="37" rx="6.5" />
                <rect x="63" y="85" width="13" height="37" rx="6.5" />
              </g>
            </svg>
          )}
        </div>

        {machine.active && (
          <div className="absolute left-7 right-7 h-1.5 rounded-full bg-white border border-purple-950/40 animate-laser-scan pointer-events-none" />
        )}

        <div className="absolute bottom-2.5 left-5 right-5 flex items-center justify-between text-[11px] font-mono font-bold text-white tabular-nums">
          <span>{machine.active ? 'SCANNING ACTIVE' : 'BAY STANDBY'}</span>
          <span>DRIFT {driftMm} mm</span>
        </div>
      </div>

      {/* Scanner Metrics */}
      <div
        className={`grid grid-cols-3 text-center bv-card cartoon-box-sm rounded-2xl py-2 px-2 ${
          theme.svgStrokeWidth === 0 ? 'divide-x divide-slate-200' : 'divide-x-2 bv-border'
        }`}
      >
        <div className="bv-border">
          <div className="text-[11px] font-semibold bv-muted">OEE Score</div>
          <div className="font-mono text-sm font-bold bv-ink tabular-nums">
            {machine.oee.toFixed(1)}%
          </div>
        </div>
        <div className="bv-border">
          <div className="text-[11px] font-semibold bv-muted">Throughput</div>
          <div className="font-mono text-sm font-bold bv-ink tabular-nums">
            {machine.throughputUnitsHr}/hr
          </div>
        </div>
        <div className="bv-border">
          <div className="text-[11px] font-semibold bv-muted">Alignment</div>
          <div
            className={`font-mono text-sm font-bold tabular-nums ${
              theme.isDarkSurface ? 'text-emerald-300' : 'text-emerald-700'
            }`}
          >
            {machine.active ? `${(100 - driftMm * 1.4).toFixed(1)}%` : 'OFF'}
          </div>
        </div>
      </div>
    </div>
  )
}
