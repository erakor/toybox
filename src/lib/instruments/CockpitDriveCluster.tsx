import React from 'react'
import { Lightbulb, Waves } from 'lucide-react'
import { useToyboxTheme } from '../theme/ThemeProvider'
import { ShiftGear } from '../types'

interface CockpitDriveClusterProps {
  shiftGear: ShiftGear
  onSelectGear: (gear: ShiftGear) => void
  bayLightsOn: boolean
  onToggleBayLights: () => void
  coolantPurgeOn: boolean
  onToggleCoolantPurge: () => void
  shiftUnits: number
  shiftKwh: number
}

const GEARS: { gear: ShiftGear; label: string; hint: string }[] = [
  { gear: ShiftGear.Park, label: 'P', hint: 'Standby' },
  { gear: ShiftGear.Reverse, label: 'R', hint: 'Regen' },
  { gear: ShiftGear.Neutral, label: 'N', hint: 'Idle' },
  { gear: ShiftGear.Drive, label: 'D', hint: 'Nominal' },
  { gear: ShiftGear.Low, label: 'L', hint: 'Torque' },
]

export const CockpitDriveCluster: React.FC<CockpitDriveClusterProps> = ({
  shiftGear,
  onSelectGear,
  bayLightsOn,
  onToggleBayLights,
  coolantPurgeOn,
  onToggleCoolantPurge,
  shiftUnits,
  shiftKwh,
}) => {
  const { theme } = useToyboxTheme()
  const isLineless = theme.svgStrokeWidth === 0
  const activeIdx = Math.max(
    0,
    GEARS.findIndex((g) => g.gear === shiftGear),
  )
  const unitDigits = String(shiftUnits).padStart(6, '0').split('')

  return (
    <div className="flex flex-col justify-between gap-3.5 h-full">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">Gear Shifter, L/W & Odometer</h3>
          <p className="text-xs font-medium bv-muted">
            PRNDL drive selector · Bay lights & coolant purge
          </p>
        </div>
        <span className="font-mono text-xs font-bold bv-ink bg-amber-200 cartoon-box-sm rounded-xl px-2.5 py-0.5">
          GEAR {shiftGear}
        </span>
      </div>

      {/* Main Split: Left PRNDL Shifter Gate + Right L/W Buttons & Rolling Odometer */}
      <div className="grid grid-cols-[1.05fr_1fr] gap-3 items-stretch">
        {/* PRNDL Cream Gate & Chunky Red T-Bar Lever */}
        <div className="bg-[#FEF3C7] cartoon-box-sm rounded-2xl p-3 flex items-center gap-3">
          <div className="flex flex-col gap-1 flex-1">
            {GEARS.map((item) => {
              const selected = item.gear === shiftGear
              return (
                <button
                  key={item.gear}
                  type="button"
                  onClick={() => onSelectGear(item.gear)}
                  aria-pressed={selected}
                  className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    selected
                      ? 'bg-[#dc2626] text-white'
                      : 'bg-white text-slate-900 hover:bg-amber-100'
                  }`}
                  style={{
                    border: isLineless ? 'none' : `2px solid ${theme.borderColor}`,
                  }}
                >
                  <span>{item.label}</span>
                  <span className="font-sans text-[10px] font-semibold">{item.hint}</span>
                </button>
              )
            })}
          </div>

          {/* Red T-Bar Lever Track */}
          <div
            className="w-8 h-36 rounded-full bg-slate-900 p-1 relative flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <div
              className="w-10 h-6 rounded-full bg-red-500 absolute transition-all duration-200 flex items-center justify-center"
              style={{
                top: `${8 + activeIdx * 28}px`,
                border: isLineless ? 'none' : `2.5px solid ${theme.borderColor}`,
              }}
            >
              <span className="w-4 h-1.5 rounded-full bg-red-300" />
            </div>
          </div>
        </div>

        {/* Right: Circular L & W Red Push Buttons + Rolling Odometer */}
        <div className="flex flex-col justify-between gap-3">
          <div className="bv-card cartoon-box-sm rounded-2xl p-3 flex items-center justify-around gap-2">
            <button
              type="button"
              onClick={onToggleBayLights}
              aria-pressed={bayLightsOn}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <span
                className={`w-11 h-11 rounded-full cartoon-btn flex items-center justify-center font-display text-base font-bold transition-transform ${
                  bayLightsOn ? 'bg-amber-300 text-slate-950 scale-105' : 'bg-[#dc2626] text-white'
                }`}
              >
                L
              </span>
              <span className="text-[10px] font-bold bv-ink inline-flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                {bayLightsOn ? 'Lights ON' : 'Lights OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleCoolantPurge}
              aria-pressed={coolantPurgeOn}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <span
                className={`w-11 h-11 rounded-full cartoon-btn flex items-center justify-center font-display text-base font-bold transition-transform ${
                  coolantPurgeOn
                    ? 'bg-cyan-400 text-slate-950 scale-105'
                    : 'bg-[#dc2626] text-white'
                }`}
              >
                W
              </span>
              <span className="text-[10px] font-bold bv-ink inline-flex items-center gap-1">
                <Waves className="w-3 h-3 text-cyan-600" />
                {coolantPurgeOn ? 'Purging' : 'Coolant'}
              </span>
            </button>
          </div>

          {/* Rolling Mechanical Odometer Drum */}
          <div className="crt-screen rounded-2xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
              <span>UNIT ODOMETER</span>
              <span className="font-mono text-amber-300 tabular-nums">
                {shiftKwh.toFixed(0)} kWh
              </span>
            </div>
            <div className="flex items-center justify-between gap-1">
              {unitDigits.map((digit, i) => (
                <span
                  key={i}
                  className={`flex-1 h-8 rounded-xl font-mono text-sm font-bold flex items-center justify-center tabular-nums ${
                    i === unitDigits.length - 1
                      ? 'bg-amber-300 text-slate-950'
                      : 'bg-white text-slate-950'
                  }`}
                  style={{
                    border: isLineless ? 'none' : '2px solid #1E293B',
                  }}
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
