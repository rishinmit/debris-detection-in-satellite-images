import React from 'react';
import './ExplainabilitySection.css';

const ExplainabilitySection = ({ explanations }) => {
  return (
    <div className="explainability-section">
      <div className="explain-header">
        <span className="explain-icon">🔍</span>
        <h3>Why This Prediction?</h3>
      </div>
      
      <div className="explanations-list">
        {explanations.map((explanation, idx) => (
          <div key={idx} className="explanation-item" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="explanation-number">{idx + 1}</div>
            <p className="explanation-text">{explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplainabilitySection;
