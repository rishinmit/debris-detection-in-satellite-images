import React from 'react';
import './ModelComparison.css';
import { formatPercent, CLASS_INTERPRETATIONS } from '../utils/analysis';

const ModelComparison = ({ modelData, ensemble, modelAgreement }) => {
  const classes = Object.keys(ensemble);

  return (
    <div className="model-comparison">
      <div className="comparison-header">
        <h3>Model Analysis</h3>
        <div className={`agreement-badge agreement-${modelAgreement.level.toLowerCase()}`}>
          {modelAgreement.level} Agreement
        </div>
      </div>

      <div className="agreement-info">
        <div className="agreement-score">
          <span className="score-label">Consensus Score</span>
          <span className="score-value">{(modelAgreement.score * 100).toFixed(0)}%</span>
        </div>
        <p className="agreement-description">{modelAgreement.description}</p>
      </div>

      <div className="models-grid">
        {modelData.map((model, idx) => (
          <div key={idx} className="model-card">
            <div className="model-header">
              <span className="model-name">{model.name}</span>
              <span className="model-label">Model {idx + 1}</span>
            </div>
            <div className="predictions-list">
              {classes.map((className) => {
                const confidence = model.predictions[className];
                const classInfo = CLASS_INTERPRETATIONS[className];
                return (
                  <div key={className} className="prediction-row">
                    <div className="prediction-label">
                      <span className="class-icon">{classInfo.icon}</span>
                      <span className="class-name">{classInfo.label}</span>
                    </div>
                    <div className="prediction-bar-container">
                      <div 
                        className="prediction-bar"
                        style={{ 
                          width: formatPercent(confidence),
                          backgroundColor: classInfo.color
                        }}
                      ></div>
                    </div>
                    <span className="prediction-value">{formatPercent(confidence)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="model-card ensemble-card">
          <div className="model-header">
            <span className="model-name">Ensemble</span>
            <span className="model-label ensemble-label">Final Output</span>
          </div>
          <div className="predictions-list">
            {classes.map((className) => {
              const confidence = ensemble[className];
              const classInfo = CLASS_INTERPRETATIONS[className];
              return (
                <div key={className} className="prediction-row">
                  <div className="prediction-label">
                    <span className="class-icon">{classInfo.icon}</span>
                    <span className="class-name">{classInfo.label}</span>
                  </div>
                  <div className="prediction-bar-container">
                    <div 
                      className="prediction-bar ensemble-bar"
                      style={{ 
                        width: formatPercent(confidence),
                        backgroundColor: classInfo.color
                      }}
                    ></div>
                  </div>
                  <span className="prediction-value">{formatPercent(confidence)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
