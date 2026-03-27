import React from 'react';
import './AlertBox.css';

const AlertBox = ({ predictions }) => {
  const shouldShow = predictions.marine_debris > 0.6;

  if (!shouldShow) return null;

  return (
    <div className="alert-box">
      <div className="alert-icon">⚠️</div>
      <div className="alert-content">
        <h4 className="alert-title">High Marine Pollution Detected</h4>
        <p className="alert-message">
          Critical levels of marine debris identified in this region. 
          Immediate environmental assessment and cleanup efforts may be required.
        </p>
        <div className="alert-severity">
          <span className="severity-label">Debris Concentration:</span>
          <span className="severity-value">{(predictions.marine_debris * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
