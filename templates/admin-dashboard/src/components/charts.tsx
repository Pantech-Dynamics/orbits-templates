import { useState } from "react";

// Charts as plain SVG: no library, and they follow the page's colours through CSS variables.

export function AreaChart({ data, format }: { data: { label: string; value: number }[]; format: (n: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000;
  const H = 240;
  const pad = { top: 12, right: 6, bottom: 6, left: 6 };
  const max = Math.max(...data.map((d) => d.value), 1);
  const x = (i: number) => pad.left + (i / Math.max(data.length - 1, 1)) * (W - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - v / max) * (H - pad.top - pad.bottom);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - pad.bottom} L${x(0)},${H - pad.bottom} Z`;
  const shown = hover ?? data.length - 1;

  return (
    <div className="chart">
      <p className="chart-value">
        {format(data[shown]?.value ?? 0)} <span>{data[shown]?.label}</span>
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Revenue per day"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const step = (W - pad.left - pad.right) / Math.max(data.length - 1, 1);
          const i = Math.round((((e.clientX - box.left) / box.width) * W - pad.left) / step);
          setHover(Math.min(Math.max(i, 0), data.length - 1));
        }}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad.left} x2={W - pad.right} y1={y(max * f)} y2={y(max * f)} className="grid" />
        ))}
        <path d={area} className="area" />
        <path d={line} className="line" />
        <line x1={x(shown)} x2={x(shown)} y1={pad.top} y2={H - pad.bottom} className="cursor" />
        <circle cx={x(shown)} cy={y(data[shown]?.value ?? 0)} r={4} className="dot" />
      </svg>
      <div className="axis">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function BarList({ items, format }: { items: { label: string; value: number; tone?: string }[]; format?: (n: number) => string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="bars">
      {items.map((item) => (
        <li key={item.label}>
          <span className="bar-label">{item.label}</span>
          <span className="bar-track">
            <span className={`bar-fill ${item.tone ?? ""}`} style={{ width: `${(item.value / max) * 100}%` }} />
          </span>
          <span className="bar-value">{format ? format(item.value) : item.value}</span>
        </li>
      ))}
    </ul>
  );
}
