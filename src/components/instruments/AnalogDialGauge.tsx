import React from 'react';
import {useStationTheme} from '../../context/ThemeContext';

interface AnalogDialGaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  warningStart?: number;
  dangerStart?: number;
  variant?: 'white' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export const AnalogDialGauge: React.FC<AnalogDialGaugeProps> = ({
  label,
  value,
  min,
  max,
  unit,
  warningStart,
  dangerStart,
  variant = 'white',
  size = 'md',
}) => {
  const {theme} = useStationTheme();
  const clamped = Math.min(max, Math.max(min, value));
  const ratio = (clamped - min) / (max - min || 1);
  const startAngle = -135;
  const endAngle = 135;
  const needleAngle = startAngle + ratio * (endAngle - startAngle);

  const isYellow = variant === 'yellow';
  const faceFill = isYellow ? '#FACC15' : '#FFFFFF';
  const outerRimFill = isYellow ? '#1E293B' : '#CBD5E1';

  const dimensions =
    size === 'sm' ? 'w-24 h-24' : size === 'lg' ? 'w-36 h-36' : 'w-28 h-28';

  const warnAngle =
    warningStart !== undefined
      ? startAngle + ((warningStart - min) / (max - min)) * 270
      : null;
  const dangerAngle =
    dangerStart !== undefined
      ? startAngle + ((dangerStart - min) / (max - min)) * 270
      : null;

  const ticks = Array.from({length: 19}, (_, i) => {
    const tAngle = startAngle + (i / 18) * 270;
    const isMajor = i % 3 === 0;
    const outer = polarToCartesian(60, 60, 44, tAngle);
    const inner = polarToCartesian(60, 60, isMajor ? 34 : 39, tAngle);
    return {outer, inner, isMajor, key: i};
  });

  const isAlert =
    (dangerStart !== undefined && value >= dangerStart) ||
    (warningStart !== undefined && value >= warningStart);

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div className={`relative ${dimensions}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Outer rounded sticker ring */}
          <circle
            cx="60"
            cy="60"
            r="56"
            fill={outerRimFill}
            stroke={theme.svgStrokeWidth === 0 ? 'none' : theme.borderColor}
            strokeWidth={theme.svgStrokeWidth}
          />
          {/* Dial face */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill={faceFill}
            stroke={theme.svgStrokeWidth === 0 ? 'none' : theme.borderColor}
            strokeWidth={theme.svgStrokeWidth === 0 ? 0 : Math.max(2, theme.svgStrokeWidth - 0.5)}
          />

          {/* Soft rounded hazard bands */}
          {warnAngle !== null && dangerAngle !== null && (
            <path
              d={describeArc(60, 60, 34, warnAngle, dangerAngle)}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="10"
              strokeLinecap="round"
            />
          )}
          {dangerAngle !== null && (
            <path
              d={describeArc(60, 60, 34, dangerAngle, endAngle)}
              fill="none"
              stroke="#EF4444"
              strokeWidth="10"
              strokeLinecap="round"
            />
          )}

          {/* Chunky rounded tick marks */}
          {ticks.map((t) => (
            <line
              key={t.key}
              x1={t.inner.x}
              y1={t.inner.y}
              x2={t.outer.x}
              y2={t.outer.y}
              stroke="#0F172A"
              strokeWidth={t.isMajor ? 3.2 : 1.8}
              strokeLinecap="round"
            />
          ))}

          {/* Soft pill LCD readout inside dial face */}
          <rect
            x="35"
            y="77"
            width="50"
            height="16"
            rx="8"
            fill={isYellow ? '#0F172A' : '#E2E8F0'}
            stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
            strokeWidth={theme.svgStrokeWidth === 0 ? 0 : 2.2}
          />
          <text
            x="60"
            y="88.5"
            textAnchor="middle"
            fill={isYellow ? '#F8FAFC' : '#0F172A'}
            fontSize="8.5"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
          >
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </text>

          {/* Chubby Rounded Capsule Needle */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: '60px 60px',
              transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <rect
              x="56"
              y="22"
              width="8"
              height="42"
              rx="4"
              fill="#EF4444"
              stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
              strokeWidth={theme.svgStrokeWidth === 0 ? 0 : 2.2}
            />
          </g>

          {/* Center Cap */}
          <circle
            cx="60"
            cy="60"
            r="7.5"
            fill="#334155"
            stroke={theme.svgStrokeWidth === 0 ? 'none' : '#0F172A'}
            strokeWidth={theme.svgStrokeWidth === 0 ? 0 : 2.5}
          />
          <circle cx="60" cy="60" r="2.8" fill="#CBD5E1" />
        </svg>
      </div>

      <div className="text-center">
        <div className="text-xs font-bold bv-ink leading-tight">{label}</div>
        <div
          className={`font-mono text-xs font-semibold tabular-nums ${
            isAlert
              ? theme.isDarkSurface
                ? 'text-rose-300'
                : 'text-red-700'
              : 'bv-muted'
          }`}
        >
          {Number.isInteger(value) ? value : value.toFixed(1)} {unit}
        </div>
      </div>
    </div>
  );
};
