"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface Props {
  data: object[];
  series: SeriesConfig[];
  type?: "line" | "area" | "bar";
  height?: number;
  valueFormatter?: (v: number) => string;
  xKey?: string;
}

const TOOLTIP_STYLE = { borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 };
const AXIS_TICK = { fontSize: 11, fill: "#9ca3af" };
const GRID_PROPS = { strokeDasharray: "3 3", stroke: "#f3f4f6", vertical: false } as const;

export default function TrendChart({
  data,
  series,
  type = "line",
  height = 220,
  valueFormatter,
  xKey = "date",
}: Props): React.ReactNode {
  const fmt = valueFormatter ?? ((v: number) => String(v));

  const commonProps = {
    data,
    margin: { top: 4, right: 4, bottom: 0, left: 0 },
  };

  const xAxis = <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} />;
  const yAxis = (
    <YAxis
      tickFormatter={fmt}
      tick={AXIS_TICK}
      axisLine={false}
      tickLine={false}
      width={60}
    />
  );
  const grid = <CartesianGrid {...GRID_PROPS} />;
  const tooltip = (
    <Tooltip
      formatter={(v: unknown) => [fmt(Number(v))]}
      contentStyle={TOOLTIP_STYLE}
      cursor={{ fill: "#f9fafb" }}
    />
  );
  const legend = <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === "bar" ? (
        <BarChart {...commonProps} barGap={4}>
          {grid}{xAxis}{yAxis}{tooltip}{legend}
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      ) : type === "area" ? (
        <AreaChart {...commonProps}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad_${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {grid}{xAxis}{yAxis}{tooltip}{legend}
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad_${s.key})`}
            />
          ))}
        </AreaChart>
      ) : (
        <LineChart {...commonProps}>
          {grid}{xAxis}{yAxis}{tooltip}{legend}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
