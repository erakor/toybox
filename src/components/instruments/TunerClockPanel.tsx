import React from 'react'
import { useStationTheme } from '../../context/ThemeContext'

interface TunerClockPanelProps {
  shiftElapsedSec: number
  peakThresholdKw: number
  onChangePeakThreshold: (val: number) => void
  harmonicTrim: number
  onChangeHarmonicTrim: (val: number) => void
  surgeActive: boolean
  criticalCount: number
  bayLightsOn: boolean
}

export const TunerClockPanel: React.FC<TunerClockPanelProps> = ({
  shiftElapsedSec,
  peakThresholdKw,
  onChangePeakThreshold,
  harmonicTrim,
  onChangeHarmonicTrim,
  surgeActive,
  criticalCount,
  bayLightsOn,
}) => {
  const { theme } = useStationTheme()
  const isLineless = theme.svgStrokeWidth === 0

  const hours = Math.floor((shiftElapsedSec / 3600) % 12)
  const mins = Math.floor((shiftElapsedSec / 60) % 60)
  const secs = shiftElapsedSec % 60
  const minAngle = mins * 6
  const hourAngle = hours * 30 + mins * 0.5
  const secAngle = secs * 6

  const formattedShift = `${String(Math.floor(shiftElapsedSec / 3600)).padStart(2, '0')}:${String(
    mins,
  ).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const tunerPercent = Math.min(100, Math.max(0, ((peakThresholdKw - 360) / 240) * 100))

  return (
    <div className="flex flex-col justify-between gap-3.5 h-full">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">Shift Clock, Tuner & Lamps</h3>
          <p className="text-xs font-medium bv-muted">
            Peak threshold dial · Harmonic filter & grid sync lights
          </p>
        </div>

        {/* Twin Round Yellow Toy Headlight Status Lamps */}
        <div className="flex items-center gap-2 bg-emerald-600 cartoon-box-sm rounded-2xl px-2.5 py-1.5">
          <span
            className={`w-4 h-4 rounded-full transition-colors ${
              criticalCount > 0 ? 'bg-red-500' : bayLightsOn ? 'bg-amber-300' : 'bg-amber-100'
            }`}
            style={{ border: isLineless ? 'none' : `2px solid ${theme.borderColor}` }}
            title="Primary Bus Status Lamp"
          />
          <span
            className={`w-4 h-4 rounded-full transition-colors ${
              surgeActive ? 'bg-red-500' : 'bg-amber-300'
            }`}
            style={{ border: isLineless ? 'none' : `2px solid ${theme.borderColor}` }}
            title="Surge Sync Lamp"
          />
        </div>
      </div>

      {/* Top Row: Analog Toy Shift Clock + Horizontal Radio Frequency/Load Tuner */}
      <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
        {/* Analog Shift Clock Sticker */}
        <div className="crt-screen rounded-2xl p-2.5 flex flex-col items-center gap-1">
          <svg viewBox="0 0 80 80" className="w-16 h-16">
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="#FFFBEB"
              stroke={isLineless ? 'none' : theme.borderColor}
              strokeWidth={isLineless ? 0 : 3}
            />
            {[0, 90, 180, 270].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180
              return (
                <circle
                  key={deg}
                  cx={40 + Math.cos(rad) * 26}
                  cy={40 + Math.sin(rad) * 26}
                  r="2.8"
                  fill="#0F172A"
                />
              )
            })}
            <g style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '40px 40px' }}>
              <rect x="37.5" y="21" width="5" height="20" rx="2.5" fill="#1E293B" />
            </g>
            <g style={{ transform: `rotate(${minAngle}deg)`, transformOrigin: '40px 40px' }}>
              <rect x="38" y="13" width="4" height="28" rx="2" fill="#2B99E8" />
            </g>
            <g style={{ transform: `rotate(${secAngle}deg)`, transformOrigin: '40px 40px' }}>
              <rect x="39" y="12" width="2" height="30" rx="1" fill="#EF4444" />
            </g>
            <circle cx="40" cy="40" r="4" fill="#EF4444" />
          </svg>
          <span className="font-mono text-[10px] font-bold text-amber-300 tabular-nums">
            {formattedShift}
          </span>
        </div>

        {/* Radio-Style Load Tuner Bar + Twin Control Sliders */}
        <div className="flex flex-col gap-2.5">
          {/* Yellow-on-Black Scale Bar */}
          <div className="crt-screen rounded-2xl px-3 py-2 flex flex-col gap-1.5">
            <div className="flex justify-between font-mono text-[10px] font-bold text-amber-300 tabular-nums">
              <span>360</span>
              <span>420</span>
              <span>480</span>
              <span>540</span>
              <span>600 kW</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 relative overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-amber-300 transition-all duration-200"
                style={{ width: `${tunerPercent}%` }}
              />
              <span
                className="w-3 h-3 rounded-full bg-red-500 absolute top-0 transition-all duration-200"
                style={{
                  left: `calc(${tunerPercent}% - 6px)`,
                  border: isLineless ? 'none' : '1.5px solid #FFFFFF',
                }}
              />
            </div>
          </div>

          {/* Twin Rotary-Style Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bv-card cartoon-box-sm rounded-2xl px-2.5 py-2">
              <div className="flex justify-between text-[10px] font-bold bv-ink mb-1">
                <span>Peak Cap</span>
                <span className="font-mono tabular-nums">{peakThresholdKw}kW</span>
              </div>
              <input
                type="range"
                min={360}
                max={600}
                step={10}
                value={peakThresholdKw}
                onChange={(e) => onChangePeakThreshold(Number(e.target.value))}
                aria-label="Peak kW Cap Tuner"
                className="w-full accent-red-500 cursor-pointer h-2 bg-slate-200 rounded-full"
              />
            </div>

            <div className="bv-card cartoon-box-sm rounded-2xl px-2.5 py-2">
              <div className="flex justify-between text-[10px] font-bold bv-ink mb-1">
                <span>THD Trim</span>
                <span className="font-mono tabular-nums">{harmonicTrim}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={2}
                value={harmonicTrim}
                onChange={(e) => onChangeHarmonicTrim(Number(e.target.value))}
                aria-label="Harmonic Filter Trim"
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
