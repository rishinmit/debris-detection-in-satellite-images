import ConfidenceBar, { CLASS_LABELS } from "./ConfidenceBar";
import ResultChart from "./ResultChart";

function getRiskLevel(confidence) {
  if (confidence >= 0.7) return { label: "HIGH", cls: "risk-high" };
  if (confidence >= 0.4) return { label: "MEDIUM", cls: "risk-medium" };
  return { label: "LOW", cls: "risk-low" };
}

function getAgreement(maxConf) {
  if (maxConf >= 0.7) return { label: "Strong", stars: 3 };
  if (maxConf >= 0.45) return { label: "Moderate", stars: 2 };
  return { label: "Weak", stars: 1 };
}

export default function ResultPanel({ result }) {
  const { ensemble, preview, time, metadata } = result;

  const entries = Object.entries(ensemble).sort((a, b) => b[1] - a[1]);
  const [topClass, topConf] = entries[0];
  const risk = getRiskLevel(topConf);
  const agreement = getAgreement(topConf);

  return (
    <div className="results-wrapper">
      {/* Processed preview */}
      {preview && (
        <div className="card preview-card">
          <h3 className="card-heading">Processed Output</h3>
          <img
            src={`data:image/png;base64,${preview}`}
            alt="Processed"
            className="processed-img"
          />
        </div>
      )}

      {/* Top prediction */}
      <div className="card top-pred-card">
        <div className="top-pred-header">
          <span className="top-pred-label">Top Prediction</span>
          <span className={`risk-badge ${risk.cls}`}>{risk.label} RISK</span>
        </div>
        <div className="top-pred-class">{CLASS_LABELS[topClass] || topClass}</div>
        <div className="top-pred-conf">{Math.round(topConf * 100)}% confidence</div>

        <div className="meta-row">
          <div className="meta-chip">
            <span className="meta-key">Processing</span>
            <span className="meta-val">{time.toFixed(3)}s</span>
          </div>
          <div className="meta-chip">
            <span className="meta-key">Size</span>
            <span className="meta-val">{metadata.width}×{metadata.height}</span>
          </div>
          <div className="meta-chip">
            <span className="meta-key">Format</span>
            <span className="meta-val">{metadata.format}</span>
          </div>
          <div className="meta-chip">
            <span className="meta-key">Agreement</span>
            <span className="meta-val">{"★".repeat(agreement.stars)}{"☆".repeat(3 - agreement.stars)} {agreement.label}</span>
          </div>
        </div>
      </div>

      {/* Confidence bars */}
      <div className="card">
        <h3 className="card-heading">Class Probabilities</h3>
        <div className="bars-list">
          {entries.map(([label, value]) => (
            <ConfidenceBar key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <ResultChart ensemble={ensemble} />
    </div>
  );
}
