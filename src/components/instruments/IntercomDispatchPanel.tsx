import React, { useState } from 'react'
import { Radio, Send } from 'lucide-react'
import { useStationTheme } from '../../context/ThemeContext'
import { type DispatchLogEntry, type MachineUnit } from '../../types/factory'

interface IntercomDispatchPanelProps {
  machines: MachineUnit[]
  dispatchLogs: DispatchLogEntry[]
  onSendDispatch: (machineId: string, note: string) => void
}

export const IntercomDispatchPanel: React.FC<IntercomDispatchPanelProps> = ({
  machines,
  dispatchLogs,
  onSendDispatch,
}) => {
  const { theme } = useStationTheme()
  const isLineless = theme.svgStrokeWidth === 0
  const [targetId, setTargetId] = useState<string>(machines[2]?.id ?? machines[0]?.id ?? 'hg-03')
  const [note, setNote] = useState<string>('Inspect bay seals & alignment')

  const handleDispatch = () => {
    const trimmed = note.trim() || 'Routine inspection dispatched'
    onSendDispatch(targetId, trimmed)
  }

  return (
    <div className="flex flex-col justify-between gap-3.5 h-full">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold bv-ink">MIKE Floor Intercom & Dispatch</h3>
          <p className="text-xs font-medium bv-muted">
            Page bay technicians directly from the cockpit mic
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-white bg-red-500 cartoon-box-sm rounded-xl px-2.5 py-0.5 inline-flex items-center gap-1">
          <Radio className="w-3 h-3" />
          CH-04
        </span>
      </div>

      {/* Left Red CB Handset + Curved Cream Coiled Cord | Right Dispatch Form & Feed */}
      <div className="grid grid-cols-[auto_1fr] gap-3 items-stretch">
        {/* Chunky Red CB Mic + Curved Coiled Cord SVG */}
        <div className="bg-sky-100 cartoon-box-sm rounded-2xl p-3 flex flex-col items-center justify-between w-24">
          <svg viewBox="0 0 72 96" className="w-16 h-24">
            {/* Rounded Mic Loop */}
            <rect
              x="27"
              y="3"
              width="18"
              height="10"
              rx="5"
              fill="#EF4444"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 2.5}
            />
            {/* Chunky Red Handset Body */}
            <rect
              x="14"
              y="10"
              width="44"
              height="48"
              rx="16"
              fill="#EF4444"
              stroke={isLineless ? 'none' : '#1E293B'}
              strokeWidth={isLineless ? 0 : 3}
            />
            {/* Speaker Grille Slots (Round Pill Slots) */}
            {[20, 27, 34].map((y) => (
              <rect key={y} x="22" y={y} width="28" height="3.5" rx="1.75" fill="#B91C1C" />
            ))}
            <text
              x="36"
              y="50"
              textAnchor="middle"
              fill="#FFFBEB"
              fontSize="9"
              fontFamily="Fredoka, sans-serif"
              fontWeight="700"
            >
              MIKE
            </text>
            {/* Cream Coiled Cord */}
            <path
              d="M 36 58 C 20 64, 52 70, 34 76 C 18 82, 52 88, 36 93"
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {!isLineless && (
              <path
                d="M 36 58 C 20 64, 52 70, 34 76 C 18 82, 52 88, 36 93"
                fill="none"
                stroke="#1E293B"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray="2 3"
              />
            )}
          </svg>
          <span className="font-mono text-[10px] font-bold bv-ink">INTERCOM</span>
        </div>

        {/* Bay Selector + Quick Page + Live Dispatch Log */}
        <div className="flex flex-col justify-between gap-2.5 min-w-0">
          <div className="flex flex-wrap gap-2">
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              aria-label="Target Machine Bay"
              className="bg-white bv-ink text-xs font-mono font-bold px-2.5 py-1.5 rounded-xl cartoon-box-sm cursor-pointer"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              aria-label="Dispatch message"
              className="flex-1 min-w-[120px] bg-white text-slate-950 text-xs font-medium px-2.5 py-1.5 rounded-xl cartoon-box-sm focus:outline-none"
            />

            <button
              type="button"
              onClick={handleDispatch}
              className="cartoon-btn px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              Page Tech
            </button>
          </div>

          <div className="crt-screen rounded-2xl p-2.5 flex flex-col gap-1.5 max-h-24 overflow-y-auto">
            {dispatchLogs.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="flex items-baseline justify-between gap-2 text-[11px] leading-tight"
              >
                <span className="text-slate-100 font-medium truncate">
                  <span className="font-mono font-bold text-amber-300 mr-1.5">
                    [{entry.targetCode}]
                  </span>
                  {entry.message}
                </span>
                <span className="font-mono text-[10px] text-slate-400 shrink-0 tabular-nums">
                  {entry.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
