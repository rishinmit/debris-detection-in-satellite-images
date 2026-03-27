import React from 'react';
import './RiskCard.css';
import { formatPercent } from '../utils/analysis';

const RiskCard = ({ topPrediction, riskLevel }) => {
  return (
    <div className="risk-card">
      <div className="risk-header">
        <span className="risk-label">Risk Assessment</span>
        <div className={`risk-badge risk-${riskLevel.level.toLowerCase()}`}>
          {riskLevel.level} Risk
        </div>
      </div>

      <div className="risk-body">
        <div className="prediction-main">
          <div className="prediction-icon">{topPrediction.interpretation.icon}</div>
          <div className="prediction-info">
            <h3 className="prediction-class">{topPrediction.label}</h3>
            <p className="prediction-description">{topPrediction.interpretation.description}</p>
          </div>
        </div>

        <div className="confidence-display">
          <div className="confidence-label">Confidence Score</div>
          <div className="confidence-value">{formatPercent(topPrediction.confidence)}</div>
          <div className="confidence-bar-container">
            <div 
              className="confidence-bar"
              style={{ 
                width: formatPercent(topPrediction.confidence),
                backgroundColor: riskLevel.color 
              }}
            ></div>
          </div>
        </div>

        <div className="risk-interpretation">
          <div className="interpretation-icon">ℹ️</div>
          <p>{riskLevel.description}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskCard;
