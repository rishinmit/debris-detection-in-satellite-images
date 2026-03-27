import React from 'react';
import './ResultCard.css';

const ResultCard = ({ title, children, className = '' }) => {
  return (
    <div className={`result-card ${className}`}>
      {title && (
        <div className="result-card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="result-card-body">
        {children}
      </div>
    </div>
  );
};

export default ResultCard;
