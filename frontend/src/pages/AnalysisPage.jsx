import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ResultPanel from "../components/ResultPanel";
import { analyzeSatelliteImage } from "../services/api";

export default function AnalysisPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSatelliteImage(file);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">ORBIS<span className="logo-accent">SCAN</span></span>
          </div>
          <p className="header-sub">Satellite Image Intelligence Platform</p>
        </div>
      </header>

      <main className="main">
        <div className="left-col">
          <div className="card">
            <h2 className="card-heading">Upload Image</h2>
            <ImageUploader
              onImageSelect={handleImageSelect}
              previewUrl={previewUrl}
              isLoading={loading}
            />
            <button
              className={`analyze-btn ${loading ? "loading" : ""} ${!file ? "disabled" : ""}`}
              onClick={handleAnalyze}
              disabled={!file || loading}
            >
              {loading ? (
                <span className="btn-inner"><span className="spinner" />Analyzing…</span>
              ) : (
                <span className="btn-inner">⬡ Run Analysis</span>
              )}
            </button>

            {error && (
              <div className="error-box">
                <span className="error-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="card info-card">
            <h3 className="card-heading">Detection Classes</h3>
            <ul className="class-list">
              {[
                ["Marine Debris", "#f97316", "Floating waste, plastics"],
                ["Sargassum", "#22c55e", "Algae bloom formations"],
                ["Turbid Water", "#3b82f6", "Sediment-laden water"],
                ["Organic Matter", "#a855f7", "Natural bio-material"],
                ["Cloud Cover", "#94a3b8", "Atmospheric obstruction"],
              ].map(([name, color, desc]) => (
                <li key={name} className="class-item">
                  <span className="class-dot" style={{ background: color }} />
                  <span className="class-name">{name}</span>
                  <span className="class-desc">{desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="right-col">
          {result ? (
            <ResultPanel result={result} />
          ) : (
            <div className="empty-state">
              <div className="empty-hex">⬡</div>
              <p className="empty-title">Awaiting Analysis</p>
              <p className="empty-sub">Upload a satellite image and click Run Analysis to begin</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
