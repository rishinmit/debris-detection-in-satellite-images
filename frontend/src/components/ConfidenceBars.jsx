import React from 'react';
import './ConfidenceBars.css';
import { CLASS_INTERPRETATIONS, formatPercent } from '../utils/analysis';

const ConfidenceBars = ({ predictions }) => {
  // Sort predictions by confidence
  const sortedPredictions = Object.entries(predictions)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="confidence-bars">
      <h4 className="confidence-title">Classification Breakdown</h4>
      <div className="bars-container">
        {sortedPredictions.map(([className, confidence]) => {
          const classInfo = CLASS_INTERPRETATIONS[className];
          return (
            <div key={className} className="confidence-bar-item">
              <div className="bar-header">
                <div className="bar-label">
                  <span className="bar-icon">{classInfo.icon}</span>
                  <span className="bar-name">{classInfo.label}</span>
                </div>
                <span className="bar-value">{formatPercent(confidence)}</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: formatPercent(confidence),
                    backgroundColor: classInfo.color
                  }}
                ></div>
              </div>
              <p className="bar-description">{classInfo.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfidenceBars;
