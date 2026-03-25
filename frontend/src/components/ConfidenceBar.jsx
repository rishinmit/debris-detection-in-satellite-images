const CLASS_COLORS = {
  marine_debris: "#f97316",
  sargassum:     "#22c55e",
  turbid_water:  "#3b82f6",
  organic:       "#a855f7",
  cloud:         "#94a3b8",
};

const CLASS_LABELS = {
  marine_debris: "Marine Debris",
  sargassum:     "Sargassum",
  turbid_water:  "Turbid Water",
  organic:       "Organic Matter",
  cloud:         "Cloud Cover",
};

export default function ConfidenceBar({ label, value }) {
  const pct = Math.round(value * 100);
  const color = CLASS_COLORS[label] || "#6366f1";
  const displayLabel = CLASS_LABELS[label] || label;

  return (
    <div className="conf-row">
      <div className="conf-header">
        <span className="conf-label">{displayLabel}</span>
        <span className="conf-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="conf-track">
        <div
          className="conf-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export { CLASS_COLORS, CLASS_LABELS };
