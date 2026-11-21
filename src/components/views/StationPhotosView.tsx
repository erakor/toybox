import React, { useState } from 'react'
import { Camera } from 'lucide-react'

const HARDWARE_MAPPINGS = [
  {
    region: 'Header & Red Siren / Roof Domes',
    physicalElement:
      'Blue toy dashboard ribbed red siren dome & primary truck 3 yellow roof domes + cream HORN/PRNDL stickers',
    telemetryMapped:
      'Power Station nameplate, coolant/manifold status, and 6-mode Station Matrix presets',
  },
  {
    region: 'Red Wheel Dual-Gauge Centerpiece',
    physicalElement:
      'Chunky red steering wheel ring framing recessed cream dial gauges and yellow truck headlights',
    telemetryMapped:
      'Core Turbine RPM, Fleet OEE %, Coolant Temp, Conduit PSI, Grid Hz & Load Factor',
  },
  {
    region: 'Centerpiece Amber Sunburst',
    physicalElement:
      'Radial orange striped panel with thick blue battery housing and rounded cyan lightning bolt',
    telemetryMapped:
      'Battery Cell Reserve %, Net Grid Draw vs Kinetic Regen (kW), and Surge Load Test trigger',
  },
  {
    region: 'Middle Spectral & Oscilloscope Bays',
    physicalElement:
      'Toy radio frequency scale bar, CRT sine screen, and 6 chunky clickable fuse breakers',
    telemetryMapped:
      'Per-Bay Power Spectrum, 60.0 Hz AC Harmonics (THD %), and 6 live bay circuit breakers',
  },
  {
    region: 'Purple Reticle Bay Scanner',
    physicalElement:
      'Purple sunburst backdrop with rounded reticle rails and cartoon worker/bot silhouettes',
    telemetryMapped:
      'MN-06 Kinetic Bay Scanner alignment drift (mm), throughput, and switchable Rig profiles',
  },
]

export const StationPhotosView: React.FC = () => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const markError = (key: string) => setImgErrors((prev) => ({ ...prev, [key]: true }))

  return (
    <div className="flex flex-col gap-6">
      {/* Vintage Toy Inspiration Photos */}
      <div className="cartoon-box bv-card rounded-3xl p-5">
        <h2 className="font-display text-xl font-bold bv-ink">Vintage Toy Design Inspiration</h2>
        <p className="text-xs font-medium bv-muted mt-1 max-w-3xl">
          The five flat dashboard designs channel these two chunky primary-colored toy references:
          rounded dome roofs, ribbed red sirens, steering-wheel dial frames, and crisp cream-paper
          sticker decals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <figure className="flex flex-col gap-2">
            <div className="rounded-3xl cartoon-box bg-slate-100 overflow-hidden aspect-[4/3] flex items-center justify-center">
              {imgErrors['toy1'] ? (
                <div className="flex flex-col items-center gap-2 text-slate-600 p-6 text-center">
                  <Camera className="w-8 h-8 text-amber-500" />
                  <span className="text-sm font-bold">Primary Dump Truck Toy Reference</span>
                </div>
              ) : (
                <img
                  src="/assets/aistudio/image_08d8f2cf.png"
                  alt="Chunky primary red, yellow, green, and blue plastic toy dump truck with three roof domes and cartoon windshield sticker"
                  referrerPolicy="no-referrer"
                  onError={() => markError('toy1')}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <figcaption className="text-xs font-semibold bv-muted">
              Toy Inspiration 1 · Sunny yellow cab with 3 rounded domes, red side bumpers, comic
              sky-blue decal & kelly green headlight grille
            </figcaption>
          </figure>

          <figure className="flex flex-col gap-2">
            <div className="rounded-3xl cartoon-box bg-slate-100 overflow-hidden aspect-[4/3] flex items-center justify-center">
              {imgErrors['toy2'] ? (
                <div className="flex flex-col items-center gap-2 text-slate-600 p-6 text-center">
                  <Camera className="w-8 h-8 text-blue-500" />
                  <span className="text-sm font-bold">Blue Toy Cockpit Dashboard Reference</span>
                </div>
              ) : (
                <img
                  src="/assets/aistudio/image_b6687530.png"
                  alt="Cerulean blue plastic toy cockpit dashboard with red siren, big red steering wheel, cream HORN and PRNDL stickers, and red mic"
                  referrerPolicy="no-referrer"
                  onError={() => markError('toy2')}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <figcaption className="text-xs font-semibold bv-muted">
              Toy Inspiration 2 · Blue cockpit dash with top red siren dome, red wheel framing dial
              gauges, L/W buttons & cream paper stickers
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Physical Factory Reference Photos */}
      <div className="cartoon-box bv-card rounded-3xl p-5">
        <h2 className="font-display text-xl font-bold bv-ink">Physical Station Reference Photos</h2>
        <p className="text-xs font-medium bv-muted mt-1 max-w-3xl">
          Every cartoon meter, sunburst battery cell, breaker bank, and reticle scanner maps
          directly to these physical Power Station hardware panels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <figure className="flex flex-col gap-2">
            <div className="rounded-3xl cartoon-box bg-slate-900 overflow-hidden aspect-[3/4] flex items-center justify-center">
              {imgErrors['img1'] ? (
                <div className="flex flex-col items-center gap-2 text-slate-300 p-6 text-center">
                  <Camera className="w-8 h-8 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    Power Station Front View (Photo 1)
                  </span>
                </div>
              ) : (
                <img
                  src="/assets/aistudio/PXL_20260406_182800662.MP_cb297606.jpg"
                  alt="Physical Power Station front panel with corrugated silver conduits, white intake cylinders, and yellow robot reticle"
                  referrerPolicy="no-referrer"
                  onError={() => markError('img1')}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <figcaption className="text-xs font-semibold bv-muted">
              Unit Front Elevation · Corrugated silver hoses, twin white top cylinders, yellow bot
              scanner & pink-trimmed panels
            </figcaption>
          </figure>

          <figure className="flex flex-col gap-2">
            <div className="rounded-3xl cartoon-box bg-slate-900 overflow-hidden aspect-[3/4] flex items-center justify-center">
              {imgErrors['img2'] ? (
                <div className="flex flex-col items-center gap-2 text-slate-300 p-6 text-center">
                  <Camera className="w-8 h-8 text-amber-400" />
                  <span className="text-sm font-medium text-white">
                    Power Station Side & Lower Base View (Photo 2)
                  </span>
                </div>
              ) : (
                <img
                  src="/assets/aistudio/PXL_20260406_183215975.MP_c1f21514.jpg"
                  alt="Power Station panel angled view showing lavender modular column, crimson gear rotor, and pink roller figure scanner"
                  referrerPolicy="no-referrer"
                  onError={() => markError('img2')}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <figcaption className="text-xs font-semibold bv-muted">
              Unit Angled Elevation · Lavender conduit stack, crimson fluted gear rotor, black stud
              base & pink roller-rig scanner
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Hardware-to-Telemetry Table */}
      <div className="cartoon-box bv-card rounded-3xl overflow-hidden">
        <div className="px-5 py-3.5 border-b-[3px] bv-border bv-card-header">
          <h3 className="font-display text-lg font-bold bv-ink">
            Toy & Hardware-to-Telemetry Mapping
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 bv-border text-[11px] font-bold bv-muted bv-card-header">
                <th className="py-2.5 px-4">Panel Region</th>
                <th className="py-2.5 px-4">Toy & Hardware Feature</th>
                <th className="py-2.5 px-4">Live Dashboard Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300/40 text-xs">
              {HARDWARE_MAPPINGS.map((row) => (
                <tr key={row.region} className="hover:bg-amber-400/10 transition-colors">
                  <td className="py-3 px-4 font-bold bv-ink whitespace-nowrap">{row.region}</td>
                  <td className="py-3 px-4 bv-muted font-medium">{row.physicalElement}</td>
                  <td className="py-3 px-4 bv-ink font-bold">{row.telemetryMapped}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
