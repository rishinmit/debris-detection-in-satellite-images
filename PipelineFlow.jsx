import React from 'react';
import './PipelineFlow.css';

const PipelineFlow = ({ isProcessing, currentStep, isComplete }) => {
  const steps = [
    { id: 1, label: 'Upload', icon: '📤', description: 'Image received' },
    { id: 2, label: 'Preprocess', icon: '⚙️', description: 'Normalizing data' },
    { id: 3, label: 'Inference', icon: '🧠', description: 'Model analysis' },
    { id: 4, label: 'Ensemble', icon: '🔄', description: 'Combining results' },
    { id: 5, label: 'Result', icon: '✅', description: 'Classification complete' }
  ];

  const getStepStatus = (stepId) => {
    if (isComplete) return 'complete';
    if (!isProcessing) return 'pending';
    if (currentStep > stepId) return 'complete';
    if (currentStep === stepId) return 'active';
    return 'pending';
  };

  return (
    <div className="pipeline-flow">
      <div className="pipeline-header">
        <h4>Processing Pipeline</h4>
        {isComplete && (
          <div className="pipeline-status-badge complete">
            <span className="status-dot"></span>
            Analysis Complete
          </div>
        )}
        {isProcessing && (
          <div className="pipeline-status-badge processing">
            <span className="status-dot"></span>
            Processing...
          </div>
        )}
      </div>

      <div className="pipeline-steps">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`pipeline-step step-${getStepStatus(step.id)}`}>
              <div className="step-glow"></div>
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <span className="step-label">{step.label}</span>
                <span className="step-description">{step.description}</span>
              </div>
              {getStepStatus(step.id) === 'active' && (
                <div className="step-spinner"></div>
              )}
            </div>

            {idx < steps.length - 1 && (
              <div className={`pipeline-connector connector-${getStepStatus(step.id)}`}>
                <div className="connector-line"></div>
                <div className="connector-glow"></div>
                <div className="connector-arrow">→</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PipelineFlow;
