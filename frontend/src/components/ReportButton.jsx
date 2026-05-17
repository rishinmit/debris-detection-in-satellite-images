import React, { useState } from 'react';
import './ReportButton.css';
import { generateReport } from '../utils/reportGenerator';

const ReportButton = ({ data, topPrediction, riskLevel, modelAgreement }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      const filename = generateReport(data, topPrediction, riskLevel, modelAgreement);
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
      setIsGenerating(false);
    }
  };

  return (
    <button 
      className="report-button"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <span className="button-spinner"></span>
          Generating...
        </>
      ) : (
        <>
          <span className="button-icon">📄</span>
          Download Report
        </>
      )}
    </button>
  );
};

export default ReportButton;
