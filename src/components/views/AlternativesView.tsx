import React from 'react'
import { Check, Sparkles } from 'lucide-react'
import {
  DashboardTab,
  type StationThemeConfig,
  StationThemeId,
  type TelemetryPoint,
  useStationTheme,
} from '@erakor/toybox'

interface AlternativesViewProps {
  latest: TelemetryPoint
  onNavigateTab: (tab: DashboardTab) => void
}

function getCardFrameStyle(cfg: StationThemeConfig, isActive: boolean): React.CSSProperties {
  switch (cfg.id) {
    case StationThemeId.LinelessBlocks:
      return {
        backgroundColor: cfg.canvasBg,
        border: '0px solid transparent',
        borderRadius: '2rem',
        boxShadow: isActive ? `0 0 0 4px ${cfg.bezelBg}` : 'none',
      }
    case StationThemeId.CreamDecal:
      return {
        backgroundColor: cfg.canvasBg,
        border: '3px solid #FEF3C7',
        boxShadow: isActive ? `0 0 0 4px ${cfg.bezelBg}` : `0 0 0 2.5px ${cfg.borderColor}`,
      }
    case StationThemeId.ScreenprintToy:
      return {
        backgroundColor: cfg.canvasBg,
        border: `3px solid ${cfg.borderColor}`,
        boxShadow: isActive ? `7px 7px 0 ${cfg.shadowColor}` : `5px 5px 0 ${cfg.shadowColor}`,
      }
    case StationThemeId.DumpCab:
    case StationThemeId.CockpitHorn:
    default:
      return {
        backgroundColor: cfg.canvasBg,
        border: `3px solid ${cfg.borderColor}`,
        boxShadow: isActive ? `0 0 0 4px ${cfg.bezelBg}` : 'none',
      }
  }
}

function getBezelStyle(cfg: StationThemeConfig): React.CSSProperties {
  switch (cfg.id) {
    case StationThemeId.LinelessBlocks:
      return {
        backgroundColor: cfg.bezelBg,
        border: '0px solid transparent',
        borderRadius: '2rem',
      }
    case StationThemeId.CreamDecal:
      return {
        backgroundColor: cfg.bezelBg,
        border: '3px solid #FEF3C7',
        boxShadow: `0 0 0 2.5px ${cfg.borderColor}`,
      }
    case StationThemeId.ScreenprintToy:
      return {
        backgroundColor: cfg.bezelBg,
        backgroundImage:
          'repeating-linear-gradient(-45deg, #16A34A 0px, #16A34A 12px, #15803D 12px, #15803D 24px)',
        border: `3px solid ${cfg.borderColor}`,
        boxShadow: `4px 4px 0 ${cfg.shadowColor}`,
      }
    case StationThemeId.DumpCab:
    case StationThemeId.CockpitHorn:
    default:
      return {
        backgroundColor: cfg.bezelBg,
        border: `3px solid ${cfg.borderColor}`,
      }
  }
}

function getStickerStyle(cfg: StationThemeConfig, bg: string, tiltDeg = 0): React.CSSProperties {
  const transform = tiltDeg !== 0 ? `rotate(${tiltDeg}deg)` : undefined
  switch (cfg.id) {
    case StationThemeId.LinelessBlocks:
      return {
        backgroundColor: bg,
        border: '0px solid transparent',
        borderRadius: '1.5rem',
        transform,
      }
    case StationThemeId.CreamDecal:
      return {
        backgroundColor: bg,
        border: '2.5px solid #FEF3C7',
        boxShadow: `0 0 0 2px ${cfg.borderColor}`,
        transform,
      }
    case StationThemeId.ScreenprintToy:
      return {
        backgroundColor: bg,
        border: `2.5px solid ${cfg.borderColor}`,
        boxShadow: `3px 3px 0 ${cfg.shadowColor}`,
        transform,
      }
    case StationThemeId.DumpCab:
      return {
        backgroundColor: bg,
        border: `2.5px solid ${cfg.borderColor}`,
        boxShadow: '0 0 0 2.5px #FFFFFF',
        transform,
      }
    case StationThemeId.CockpitHorn:
    default:
      return {
        backgroundColor: bg,
        border: `2.5px solid ${cfg.borderColor}`,
        transform,
      }
  }
}

const MiniDial: React.FC<{ cfg: StationThemeConfig; needleAngle: number; ringColor?: string }> = ({
  cfg,
  needleAngle,
  ringColor,
}) => {
  const lineless = cfg.svgStrokeWidth === 0
  return (
    <svg viewBox="0 0 80 80" className="w-13 h-13">
      <circle
        cx="40"
        cy="40"
        r="36"
        fill={ringColor ?? cfg.plateAltBg}
        stroke={lineless ? 'none' : cfg.borderColor}
        strokeWidth={cfg.svgStrokeWidth}
      />
      <circle
        cx="40"
        cy="40"
        r="28"
        fill="#FFFBEB"
        stroke={lineless ? 'none' : cfg.borderColor}
        strokeWidth={lineless ? 0 : Math.max(2, cfg.svgStrokeWidth - 1)}
      />
      <g
        style={{
          transform: `rotate(${needleAngle}deg)`,
          transformOrigin: '40px 40px',
        }}
      >
        <rect
          x="37.5"
          y="15"
          width="5"
          height="26"
          rx="2.5"
          fill="#EF4444"
          stroke={lineless ? 'none' : '#0F172A'}
          strokeWidth={lineless ? 0 : 1.5}
        />
      </g>
      <circle
        cx="40"
        cy="40"
        r="5"
        fill="#1E293B"
        stroke={lineless ? 'none' : '#0F172A'}
        strokeWidth={lineless ? 0 : 2}
      />
    </svg>
  )
}

const MiniBattery: React.FC<{ cfg: StationThemeConfig }> = ({ cfg }) => {
  const lineless = cfg.svgStrokeWidth === 0
  return (
    <svg viewBox="0 0 60 76" className="w-9 h-11">
      <rect
        x="18"
        y="3"
        width="24"
        height="8"
        rx="4"
        fill="#0284C7"
        stroke={lineless ? 'none' : cfg.borderColor}
        strokeWidth={lineless ? 0 : 2.5}
      />
      <rect
        x="7"
        y="10"
        width="46"
        height="62"
        rx="14"
        fill="#0F172A"
        stroke="#0EA5E9"
        strokeWidth="4"
      />
      <path
        d="M 32 23 Q 33 22 32 26 L 22 42 Q 20 45 24 45 L 29 45 L 26 60 Q 25 63 28 60 L 38 45 Q 40 42 36 42 L 31 42 Z"
        fill="#22D3EE"
        stroke={lineless ? 'none' : '#0F172A'}
        strokeWidth={lineless ? 0 : 2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

const MiniPreviewConsole: React.FC<{
  cfg: StationThemeConfig
  latest: TelemetryPoint
}> = ({ cfg, latest }) => {
  const ratio = Math.min(1, Math.max(0, (latest.fleetOee - 50) / 50))
  const needleAngle = -120 + ratio * 240
  const lineless = cfg.svgStrokeWidth === 0

  return (
    <div className="relative pt-2">
      {/* Top Toy Hardware Silhouettes directly inspired by the two photos */}
      {cfg.id === StationThemeId.CockpitHorn && (
        <div className="flex justify-center -mb-1 relative z-10 pointer-events-none">
          <div
            className="w-14 h-4 rounded-t-2xl siren-ribs border-[2.5px] border-b-0"
            style={{ borderColor: cfg.borderColor }}
          />
        </div>
      )}
      {cfg.id === StationThemeId.DumpCab && (
        <div className="flex justify-center gap-3 -mb-1 relative z-10 pointer-events-none">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="w-7 h-3 rounded-t-full border-[2.5px] border-b-0 bg-amber-300"
              style={{ borderColor: cfg.borderColor }}
            />
          ))}
        </div>
      )}
      {cfg.id === StationThemeId.LinelessBlocks && (
        <div className="flex justify-center gap-3 -mb-1 relative z-10 pointer-events-none">
          <span className="w-7 h-2.5 rounded-t-full bg-amber-400" />
          <span className="w-7 h-2.5 rounded-t-full bg-red-500" />
          <span className="w-7 h-2.5 rounded-t-full bg-emerald-500" />
        </div>
      )}

      <div className="rounded-3xl p-3" style={getBezelStyle(cfg)}>
        {/* Cream / Primary Nameplate */}
        <div
          className="rounded-2xl px-3 py-1.5 mb-2.5 flex items-center justify-between"
          style={getStickerStyle(cfg, cfg.nameplateBg)}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: cfg.id === StationThemeId.DumpCab ? '#FACC15' : '#EF4444',
                border: lineless ? 'none' : `2px solid ${cfg.borderColor}`,
              }}
            />
            <span
              className="font-display text-xs font-bold"
              style={{
                color: cfg.id === StationThemeId.DumpCab ? '#FFFFFF' : cfg.inkText,
              }}
            >
              Power Station
            </span>
          </div>
          <span
            className="font-mono text-[10px] font-bold tabular-nums"
            style={{
              color: cfg.id === StationThemeId.DumpCab ? '#FFFFFF' : cfg.inkText,
            }}
          >
            {latest.totalPowerKw.toFixed(0)} kW
          </span>
        </div>

        {/* Design-Specific Toy Console Mini Layouts */}
        {cfg.id === StationThemeId.CockpitHorn ? (
          /* 01 CockpitHorn: Big Red Steering Wheel Dial Ring + Cream PRNDL & L/W Tiles */
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
            <div
              className="rounded-2xl p-2 flex items-center justify-center gap-1.5"
              style={getStickerStyle(cfg, cfg.plateBg)}
            >
              <div
                className="rounded-full p-1.5 bg-red-500 flex items-center justify-center"
                style={{ border: `2.5px solid ${cfg.borderColor}` }}
              >
                <div
                  className="rounded-full bg-amber-50 p-1"
                  style={{ border: `2px solid ${cfg.borderColor}` }}
                >
                  <MiniDial cfg={cfg} needleAngle={needleAngle} ringColor="#FACC15" />
                </div>
              </div>
            </div>
            <div
              className="rounded-2xl p-2 flex flex-col justify-between gap-1.5"
              style={getStickerStyle(cfg, cfg.plateAltBg)}
            >
              <div className="flex items-center justify-around gap-1">
                {['L', 'W'].map((lbl) => (
                  <span
                    key={lbl}
                    className="w-6 h-6 rounded-full bg-red-500 text-white font-display text-[10px] font-bold flex items-center justify-center"
                    style={{ border: `2px solid ${cfg.borderColor}` }}
                  >
                    {lbl}
                  </span>
                ))}
              </div>
              <div
                className="rounded-xl bg-amber-300 px-1.5 py-1 text-center font-mono text-[9px] font-bold text-slate-950"
                style={{ border: `1.5px solid ${cfg.borderColor}` }}
              >
                P·R·N·D {latest.fleetOee.toFixed(0)}%
              </div>
            </div>
          </div>
        ) : cfg.id === StationThemeId.DumpCab ? (
          /* 02 DumpCab: Sky-Blue Windshield Sticker + Green Headlight Grille */
          <div className="flex flex-col gap-2">
            <div
              className="rounded-2xl p-2 grid grid-cols-2 gap-2"
              style={getStickerStyle(cfg, '#38BDF8')}
            >
              <div className="flex items-center justify-center">
                <MiniDial cfg={cfg} needleAngle={needleAngle} ringColor="#FFFFFF" />
              </div>
              <div className="flex items-center justify-center">
                <MiniBattery cfg={cfg} />
              </div>
            </div>
            <div
              className="rounded-2xl px-2.5 py-1.5 flex items-center justify-between"
              style={getStickerStyle(cfg, '#16A34A')}
            >
              <span
                className="w-4 h-4 rounded-full bg-amber-300"
                style={{ border: `2px solid ${cfg.borderColor}` }}
              />
              <div className="flex flex-col gap-1">
                <span className="w-12 h-1.5 rounded-full bg-amber-300 border border-slate-900" />
                <span className="w-12 h-1.5 rounded-full bg-amber-300 border border-slate-900" />
              </div>
              <span
                className="w-4 h-4 rounded-full bg-amber-300"
                style={{ border: `2px solid ${cfg.borderColor}` }}
              />
            </div>
          </div>
        ) : cfg.id === StationThemeId.CreamDecal ? (
          /* 04 CreamDecal: 3-Tower Kiosk with Cream Halos & Playful Tilts */
          <div className="grid grid-cols-3 gap-2">
            <div
              className="rounded-2xl p-2 flex flex-col items-center justify-between gap-1"
              style={getStickerStyle(cfg, cfg.plateBg, -1.2)}
            >
              <MiniDial cfg={cfg} needleAngle={needleAngle} />
              <span className="font-mono text-[9px] font-bold" style={{ color: cfg.inkText }}>
                {latest.fleetOee.toFixed(0)}%
              </span>
            </div>
            <div
              className="rounded-2xl p-2 sunburst-orange flex flex-col items-center justify-between gap-1"
              style={getStickerStyle(cfg, '#F97316', 1.1)}
            >
              <MiniBattery cfg={cfg} />
              <div className="w-full rounded-xl bg-slate-950 px-1 py-0.5 text-center font-mono text-[9px] font-bold text-cyan-300">
                {latest.batteryPct.toFixed(0)}%
              </div>
            </div>
            <div
              className="rounded-2xl p-2 flex flex-col justify-between gap-1"
              style={getStickerStyle(cfg, cfg.plateAltBg, -0.8)}
            >
              <div className="grid grid-cols-2 gap-1">
                {['#16A34A', '#FACC15', '#EF4444', '#2B99E8'].map((c) => (
                  <div
                    key={c}
                    className="h-3 rounded-lg"
                    style={{ backgroundColor: c, border: `1.5px solid ${cfg.borderColor}` }}
                  />
                ))}
              </div>
              <div className="rounded-xl bg-slate-900 px-1 py-0.5 text-center font-mono text-[9px] font-bold text-lime-300">
                {latest.gridHz.toFixed(1)}Hz
              </div>
            </div>
          </div>
        ) : cfg.id === StationThemeId.ScreenprintToy ? (
          /* 05 ScreenprintToy: Widescreen Hero Cockpit with Hard Offset */
          <div className="flex flex-col gap-2">
            <div
              className="rounded-2xl p-2 sunburst-orange flex items-center justify-between gap-2.5"
              style={getStickerStyle(cfg, '#F97316')}
            >
              <MiniBattery cfg={cfg} />
              <div className="flex-1 rounded-xl bg-slate-950 p-2 flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[9px] font-bold text-cyan-300">
                  <span>CELL CORE</span>
                  <span>{latest.batteryPct.toFixed(0)}%</span>
                </div>
                <svg viewBox="0 0 120 22" className="w-full h-4">
                  <path
                    d="M 2 12 Q 15 2, 30 12 T 60 12 T 90 12 T 118 12"
                    fill="none"
                    stroke="#A3E635"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-2xl p-2 flex items-center justify-center"
                style={getStickerStyle(cfg, cfg.plateBg)}
              >
                <MiniDial cfg={cfg} needleAngle={needleAngle} />
              </div>
              <div
                className="rounded-2xl p-2 flex flex-col justify-center gap-1"
                style={getStickerStyle(cfg, cfg.plateAltBg)}
              >
                <div className="grid grid-cols-3 gap-1">
                  {['#16A34A', '#FACC15', '#EF4444'].map((c) => (
                    <div
                      key={c}
                      className="h-3 rounded-lg"
                      style={{ backgroundColor: c, border: `1.5px solid ${cfg.borderColor}` }}
                    />
                  ))}
                </div>
                <div
                  className="font-mono text-[9px] font-bold text-center"
                  style={{ color: cfg.inkText }}
                >
                  PRINT OFFSET
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 03 LinelessBlocks: 0px Outline Chubby Toy Shapes */
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2.5">
            <div
              className="p-2.5 sunburst-orange flex flex-col items-center justify-between gap-1.5"
              style={getStickerStyle(cfg, '#F97316')}
            >
              <MiniBattery cfg={cfg} />
              <div className="w-full rounded-full bg-slate-950 px-2 py-0.5 text-center font-mono text-[9px] font-bold text-cyan-300">
                {latest.batteryPct.toFixed(0)}% CELL
              </div>
            </div>
            <div
              className="p-2.5 flex flex-col items-center justify-between gap-1.5"
              style={getStickerStyle(cfg, cfg.plateBg)}
            >
              <MiniDial cfg={cfg} needleAngle={needleAngle} />
              <div className="grid grid-cols-3 gap-1 w-full">
                {['#16A34A', '#FACC15', '#EF4444'].map((c) => (
                  <div key={c} className="h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Round Blue Truck Wheels on DumpCab & LinelessBlocks */}
      {(cfg.id === StationThemeId.DumpCab || cfg.id === StationThemeId.LinelessBlocks) && (
        <div className="flex justify-between px-6 -mt-1 pointer-events-none">
          <span
            className="w-9 h-3.5 rounded-b-full bg-blue-600"
            style={{ border: lineless ? 'none' : `2.5px solid ${cfg.borderColor}`, borderTop: 0 }}
          />
          <span
            className="w-9 h-3.5 rounded-b-full bg-blue-600"
            style={{ border: lineless ? 'none' : `2.5px solid ${cfg.borderColor}`, borderTop: 0 }}
          />
        </div>
      )}
    </div>
  )
}

export const AlternativesView: React.FC<AlternativesViewProps> = ({ latest, onNavigateTab }) => {
  const { theme, setThemeId, allThemes } = useStationTheme()

  return (
    <div className="flex flex-col gap-6">
      {/* Intro Banner with Inspiration Thumbnails */}
      <div className="cartoon-box bv-card rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <img
              src="/assets/aistudio/image_08d8f2cf.png"
              alt="Primary dump truck toy inspiration"
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-cover rounded-2xl border-2 bv-border"
            />
            <img
              src="/assets/aistudio/image_b6687530.png"
              alt="Blue cockpit dashboard toy inspiration"
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-cover rounded-2xl border-2 bv-border"
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold bv-ink">
              Five Vintage Toy-Inspired Designs
            </h2>
            <p className="text-xs font-medium bv-muted mt-1 max-w-2xl">
              Inspired directly by your primary dump truck and blue cockpit dashboard
              photos—combining bright flat primary colors, cream paper stickers, red sirens,
              steering-wheel bezels, roof domes, and green grilles with zero sharp edges.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab(DashboardTab.PowerStation)}
          className="cartoon-btn px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
          style={{
            backgroundColor: theme.accentBg,
            color: theme.accentText,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Open Full Console ({theme.name})
        </button>
      </div>

      {/* 5-Design Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allThemes.map((alt) => {
          const isActive = alt.id === theme.id
          const lineless = alt.svgStrokeWidth === 0
          return (
            <div
              key={alt.id}
              className="rounded-3xl p-5 flex flex-col justify-between gap-4 transition-transform"
              style={getCardFrameStyle(alt, isActive)}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className="font-mono text-[11px] font-bold"
                      style={{ color: alt.mutedText }}
                    >
                      Design {alt.number} · {alt.styleTag}
                    </div>
                    <h3
                      className="font-display text-xl font-bold mt-0.5"
                      style={{ color: alt.inkText }}
                    >
                      {alt.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    {alt.swatches.map((hex) => (
                      <span
                        key={hex}
                        className="w-3.5 h-3.5 rounded-full"
                        style={{
                          backgroundColor: hex,
                          border: lineless
                            ? '0px solid transparent'
                            : `2px solid ${alt.borderColor}`,
                        }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs font-medium leading-relaxed" style={{ color: alt.mutedText }}>
                  {alt.tagline}
                </p>

                {/* Live Mini Preview Console */}
                <MiniPreviewConsole cfg={alt} latest={latest} />

                <div
                  className="text-[11px] leading-snug space-y-0.5"
                  style={{ color: alt.mutedText }}
                >
                  <div>
                    <span className="font-bold" style={{ color: alt.inkText }}>
                      Toy Motif:
                    </span>{' '}
                    {alt.inspoNote}
                  </div>
                  <div>
                    <span className="font-bold" style={{ color: alt.inkText }}>
                      Stickers:
                    </span>{' '}
                    {alt.stickerNote}
                  </div>
                  <div>
                    <span className="font-bold" style={{ color: alt.inkText }}>
                      Layout:
                    </span>{' '}
                    {alt.layoutNote}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setThemeId(alt.id)}
                  className="flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  style={{
                    backgroundColor: isActive ? alt.accentBg : alt.cardBg,
                    color: isActive ? alt.accentText : alt.inkText,
                    border: lineless
                      ? '0px solid transparent'
                      : alt.id === StationThemeId.CreamDecal
                        ? '2.5px solid #FEF3C7'
                        : `2.5px solid ${alt.borderColor}`,
                    boxShadow:
                      alt.id === StationThemeId.ScreenprintToy
                        ? `3px 3px 0 ${alt.shadowColor}`
                        : alt.id === StationThemeId.CreamDecal
                          ? `0 0 0 2px ${alt.borderColor}`
                          : 'none',
                  }}
                >
                  {isActive && <Check className="w-3.5 h-3.5" />}
                  {isActive ? 'Currently Active' : `Apply Design ${alt.number}`}
                </button>

                {isActive && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab(DashboardTab.PowerStation)}
                    className="py-2.5 px-3.5 rounded-2xl text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: alt.cardBg,
                      color: alt.inkText,
                      border: lineless ? '0px solid transparent' : `2.5px solid ${alt.borderColor}`,
                      boxShadow:
                        alt.id === StationThemeId.ScreenprintToy
                          ? `3px 3px 0 ${alt.shadowColor}`
                          : 'none',
                    }}
                  >
                    Inspect
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
