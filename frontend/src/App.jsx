import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import RiskCard from './components/RiskCard';
import AlertBox from './components/AlertBox';
import ModelComparison from './components/ModelComparison';
import ExplainabilitySection from './components/ExplainabilitySection';
import ConfidenceBars from './components/ConfidenceBars';
import PipelineFlow from './components/PipelineFlow';
import ReportButton from './components/ReportButton';
import ResultCard from './components/ResultCard';
import { predictImage } from './services/api';
import {
  getTopPrediction,
  getRiskLevel,
  calculateModelAgreement,
  generateExplanations,
  mockModelWiseData
} from './utils/analysis';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [apiReady, setApiReady] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/health');
      if (response.ok) {
        setApiReady(true);
      }
    } catch (err) {
      setApiReady(false);
    }
  };

  const handleImageUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setPipelineStep(1);

    try {
      setPipelineStep(2);
      await new Promise(resolve => setTimeout(resolve, 500));

      setPipelineStep(3);
      const data = await predictImage(file);

      setPipelineStep(4);
      await new Promise(resolve => setTimeout(resolve, 300));

      setPipelineStep(5);

      const topPrediction = getTopPrediction(data.ensemble);
      const riskLevel = getRiskLevel(topPrediction.confidence);
      const modelData = mockModelWiseData(data.ensemble);
      const modelAgreement = calculateModelAgreement(modelData);
      const explanations = generateExplanations(
        topPrediction.class,
        topPrediction.confidence,
        data.ensemble
      );

      setResult({
        raw: data,
        topPrediction,
        riskLevel,
        modelData,
        modelAgreement,
        explanations
      });

      setIsLoading(false);
      setPipelineStep(0);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setPipelineStep(0);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🛰️</span>
            <div className="logo-text">
              <h1>Marine Debris Detection</h1>
              <p>AI-Powered Satellite Image Analysis</p>
            </div>
          </div>
          <div className="header-controls">
            <button
              className="help-btn"
              onClick={() => setShowHelp(!showHelp)}
              title="Show help and information"
            >
              ❓
            </button>
            <div className={`status-indicator ${apiReady ? 'ready' : 'offline'}`}>
              <span className="status-dot"></span>
              <span className="status-text">{apiReady ? 'Connected' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
      </header>

      {showHelp && (
        <div className="help-banner">
          <div className="help-content">
            <h3>📖 How to Use</h3>
            <ul>
              <li>Upload a satellite image (TIFF, PNG, or JPG)</li>
              <li>The system uses 3 AI models to detect marine debris</li>
              <li>Get confidence scores, risk assessment, and detailed analysis</li>
              <li>Export results as a PDF report</li>
            </ul>
            <p className="help-models">
              <strong>Models:</strong> DeepLabV3 + ResNet50 + EfficientNet-B0 (Ensemble)
            </p>
            <button className="close-help" onClick={() => setShowHelp(false)}>✕</button>
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="dashboard-container">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />

            <PipelineFlow
              isProcessing={isLoading}
              currentStep={pipelineStep}
            />

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <div className="error-content">
                  <h4>Analysis Failed</h4>
                  <p>{error}</p>
                  <button onClick={() => setError(null)} className="error-close">Dismiss</button>
                </div>
              </div>
            )}

            {result && (
              <ImagePreview
                preview={result.raw.preview}
                metadata={result.raw.metadata}
              />
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            {result ? (
              <>
                <AlertBox predictions={result.raw.ensemble} />

                <div className="results-grid">
                  <RiskCard
                    topPrediction={result.topPrediction}
                    riskLevel={result.riskLevel}
                  />

                  <ResultCard title="Classification Confidence">
                    <ConfidenceBars predictions={result.raw.ensemble} />
                  </ResultCard>

                  <ExplainabilitySection explanations={result.explanations} />

                  <ModelComparison
                    modelData={result.modelData}
                    ensemble={result.raw.ensemble}
                    modelAgreement={result.modelAgreement}
                  />

                  <ResultCard title="Processing Metadata">
                    <div className="metadata-grid">
                      <div className="metadata-card">
                        <span className="metadata-icon">⏱️</span>
                        <div className="metadata-info">
                          <span className="metadata-label">Processing Time</span>
                          <span className="metadata-value">{result.raw.time.toFixed(3)}s</span>
                        </div>
                      </div>
                      <div className="metadata-card">
                        <span className="metadata-icon">📐</span>
                        <div className="metadata-info">
                          <span className="metadata-label">Image Size</span>
                          <span className="metadata-value">
                            {result.raw.metadata.width} × {result.raw.metadata.height}
                          </span>
                        </div>
                      </div>
                      <div className="metadata-card">
                        <span className="metadata-icon">🖼️</span>
                        <div className="metadata-info">
                          <span className="metadata-label">Format</span>
                          <span className="metadata-value">{result.raw.metadata.format}</span>
                        </div>
                      </div>
                      <div className="metadata-card">
                        <span className="metadata-icon">🔑</span>
                        <div className="metadata-info">
                          <span className="metadata-label">Request ID</span>
                          <span className="metadata-value">{result.raw.request_id?.slice(0, 8) || 'N/A'}...</span>
                        </div>
                      </div>
                    </div>
                  </ResultCard>

                  <ReportButton
                    data={result.raw}
                    topPrediction={result.topPrediction}
                    riskLevel={result.riskLevel}
                    modelAgreement={result.modelAgreement}
                  />
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🌊</div>
                <h2>Ready for Analysis</h2>
                <p>Upload a satellite image to begin debris detection</p>
                <div className="empty-features">
                  <div className="feature-item">
                    <span className="feature-icon">🤖</span>
                    <span>Multi-model ensemble (3 deep learning models)</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <span>Real-time risk assessment</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📊</span>
                    <span>Detailed classification breakdown</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📄</span>
                    <span>Exportable analysis reports (PDF)</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>Per-class confidence scores</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚙️</span>
                    <span>Model agreement analysis</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>🛰️ Marine Debris Detection System | DeepLabV3 + ResNet50 + EfficientNet-B0</p>
          <p className="footer-info">Final Year Deep Learning Project | Status: {apiReady ? '✅ Online' : '⚠️ Offline'}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;