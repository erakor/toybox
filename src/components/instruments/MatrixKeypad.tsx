import React from 'react';
import {PowerPreset} from '../../types/factory';

interface MatrixKeypadProps {
  activePreset: PowerPreset;
  onSelectPreset: (preset: PowerPreset) => void;
  loadBias: number;
  onChangeLoadBias: (val: number) => void;
}

const MATRIX_TILES: {
  preset: PowerPreset;
  shortLabel: string;
  colorClass: string;
}[] = [
  {
    preset: PowerPreset.EcoBalance,
    shortLabel: 'ECO',
    colorClass: 'bg-emerald-400 text-slate-950',
  },
  {
    preset: PowerPreset.NominalRun,
    shortLabel: 'NOM',
    colorClass: 'bg-amber-400 text-slate-950',
  },
  {
    preset: PowerPreset.PeakBoost,
    shortLabel: 'PEAK',
    colorClass: 'bg-red-500 text-white',
  },
  {
    preset: PowerPreset.CoolantFlush,
    shortLabel: 'COOL',
    colorClass: 'bg-cyan-400 text-slate-950',
  },
  {
    preset: PowerPreset.HarmonicSync,
    shortLabel: 'SYNC',
    colorClass: 'bg-purple-500 text-white',
  },
  {
    preset: PowerPreset.LoadShed,
    shortLabel: 'SHED',
    colorClass: 'bg-white text-slate-950',
  },
];

export const MatrixKeypad: React.FC<MatrixKeypadProps> = ({
  activePreset,
  onSelectPreset,
  loadBias,
  onChangeLoadBias,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-sm font-bold bv-ink">
          Station Mode Matrix
        </span>
        <span className="font-mono text-xs font-bold text-slate-950 bg-amber-300 cartoon-box-sm rounded-xl px-2.5 py-0.5">
          {activePreset}
        </span>
      </div>

      {/* Soft-Rounded Tactile Color Tile Matrix */}
      <div className="grid grid-cols-3 gap-2.5 crt-screen p-3 rounded-2xl">
        {MATRIX_TILES.map((tile) => {
          const isSelected = activePreset === tile.preset;
          return (
            <button
              key={tile.preset}
              type="button"
              onClick={() => onSelectPreset(tile.preset)}
              aria-pressed={isSelected}
              className={`cartoon-btn h-10 rounded-xl font-mono text-xs font-bold tracking-tight cursor-pointer flex items-center justify-center ${
                tile.colorClass
              } ${isSelected ? 'ring-2 ring-white scale-[1.03]' : 'opacity-85 hover:opacity-100'}`}
            >
              {tile.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Pill-Rounded Cross-Actuator / Load Bias Track */}
      <div className="bv-card cartoon-box-sm rounded-2xl px-3.5 py-2.5 flex items-center gap-3">
        <div className="w-7 h-7 shrink-0 relative flex items-center justify-center" aria-hidden="true">
          <div className="w-2.5 h-7 bg-slate-700 rounded-full" />
          <div className="w-7 h-2.5 bg-slate-400 rounded-full absolute" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <label htmlFor="load-bias-slider" className="bv-ink font-bold">
              Conduit Load Bias
            </label>
            <span className="font-mono font-bold bv-ink tabular-nums">{loadBias}%</span>
          </div>
          <input
            id="load-bias-slider"
            type="range"
            min={15}
            max={95}
            value={loadBias}
            onChange={(e) => onChangeLoadBias(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-300 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
