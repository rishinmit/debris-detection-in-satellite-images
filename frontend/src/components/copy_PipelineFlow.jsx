import React from 'react';
import './PipelineFlow.css';

const PipelineFlow = ({ isProcessing, currentStep }) => {
  const steps = [
    { id: 1, label: 'Upload', icon: '📤', description: 'Image received' },
    { id: 2, label: 'Preprocess', icon: '⚙️', description: 'Normalizing data' },
    { id: 3, label: 'Inference', icon: '🧠', description: 'Model analysis' },
    { id: 4, label: 'Ensemble', icon: '🔄', description: 'Combining results' },
    { id: 5, label: 'Result', icon: '✅', description: 'Classification complete' }
  ];

  const getStepStatus = (stepId) => {
    if (!isProcessing) return 'pending';
    if (currentStep > stepId) return 'complete';
    if (currentStep === stepId) return 'active';
    return 'pending';
  };

  return (
    <div className="pipeline-flow">
      <div className="pipeline-header">
        <h4>Processing Pipeline</h4>
      </div>

      <div className="pipeline-zigzag">

        {/* Row 1 (first 3 steps) */}
        <div className="pipeline-row">
          {steps.slice(0, 3).map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`pipeline-step step-${getStepStatus(step.id)}`}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <span className="step-label">{step.label}</span>
                  <span className="step-description">{step.description}</span>
                </div>
                {getStepStatus(step.id) === 'active' && (
                  <div className="step-spinner"></div>
                )}
              </div>

              {idx < 2 && (
                <div className="pipeline-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Turn Down */}
        <div className="pipeline-turn">↓</div>

        {/* Row 2 (last 2 steps reversed) */}
        <div className="pipeline-row reverse">
          {steps.slice(3).map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`pipeline-step step-${getStepStatus(step.id)}`}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <span className="step-label">{step.label}</span>
                  <span className="step-description">{step.description}</span>
                </div>
                {getStepStatus(step.id) === 'active' && (
                  <div className="step-spinner"></div>
                )}
              </div>

              {idx < 1 && (
                <div className="pipeline-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">←</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PipelineFlow;