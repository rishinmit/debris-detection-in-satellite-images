import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { CLASS_COLORS, CLASS_LABELS } from "./ConfidenceBar";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0];
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{CLASS_LABELS[name] || name}</p>
        <p className="tooltip-val">{Math.round(value * 100)}%</p>
      </div>
    );
  }
  return null;
};

export default function ResultChart({ ensemble }) {
  const data = Object.entries(ensemble).map(([key, val]) => ({
    name: key,
    value: val,
    fill: CLASS_COLORS[key] || "#6366f1",
  }));

  return (
    <div className="chart-card">
      <h3 className="card-heading">Confidence Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="name"
            tickFormatter={(k) => CLASS_LABELS[k]?.split(" ")[0] || k}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 1]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
