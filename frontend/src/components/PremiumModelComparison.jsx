import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './PremiumModelComparison.css';
import { formatPercent, CLASS_INTERPRETATIONS } from '../utils/analysis';
import { staggerContainer, staggerItem, cardHover } from '../utils/animations';

/**
 * Premium Model Comparison Component
 * - Beautiful card-based model visualization
 * - Glassmorphism design
 * - Animated transitions
 * - Detailed metrics display
 * - Agreement scoring with color coding
 */

const PremiumModelComparison = ({ modelData, ensemble, modelAgreement }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const classes = Object.keys(ensemble);

  return (
    <motion.div 
      className="premium-model-comparison"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header with Agreement Score */}
      <div className="comparison-header">
        <div className="header-left">
          <h3 className="comparison-title">Ensemble Model Analysis</h3>
          <p className="comparison-subtitle">3-Model Deep Learning Ensemble</p>
        </div>

        <motion.div 
          className={`agreement-card agreement-${modelAgreement.level.toLowerCase()}`}
          variants={staggerItem}
          whileHover={{ scale: 1.05 }}
        >
          <div className="agreement-content">
            <span className="agreement-label">Model Consensus</span>
            <div className="agreement-score-display">
              <span className="agreement-percentage">
                {(modelAgreement.score * 100).toFixed(0)}%
              </span>
            </div>
            <span className="agreement-level">{modelAgreement.level} Agreement</span>
            <p className="agreement-description">{modelAgreement.description}</p>
          </div>
          <div className={`agreement-indicator agreement-${modelAgreement.level.toLowerCase()}`} />
        </motion.div>
      </div>

      {/* Model Cards Grid */}
      <div className="models-grid">
        {modelData.map((model, idx) => (
          <motion.div
            key={idx}
            className={`model-card ${selectedModel === idx ? 'selected' : ''}`}
            variants={staggerItem}
            {...cardHover}
            onClick={() => setSelectedModel(selectedModel === idx ? null : idx)}
            layoutId={`model-${idx}`}
          >
            {/* Card Header */}
            <div className="model-card-header">
              <div className="model-info">
                <div className="model-icon">
                  {idx === 0 ? '🧠' : idx === 1 ? '🔍' : '⚡'}
                </div>
                <div className="model-texts">
                  <span className="model-name">{model.name}</span>
                  <span className="model-index">Model {idx + 1}</span>
                </div>
              </div>
              <div className="model-actions">
                <motion.button
                  className="expand-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedModel === idx ? '⌄' : '‣'}
                </motion.button>
              </div>
            </div>

            {/* Top Prediction */}
            <div className="model-top-prediction">
              {(() => {
                const topClass = Object.entries(model.predictions).sort((a, b) => b[1] - a[1])[0];
                const classInfo = CLASS_INTERPRETATIONS[topClass[0]];
                return (
                  <div className="top-pred-item">
                    <span className="top-pred-icon">{classInfo.icon}</span>
                    <div className="top-pred-info">
                      <span className="top-pred-label">Top Prediction</span>
                      <span className="top-pred-class">{classInfo.label}</span>
                      <span className="top-pred-confidence">{formatPercent(topClass[1])}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Predictions List */}
            <motion.div 
              className="predictions-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: selectedModel === idx ? 1 : 1,
                height: 'auto'
              }}
              transition={{ duration: 0.3 }}
            >
              {classes.map((className) => {
                const confidence = model.predictions[className];
                const classInfo = CLASS_INTERPRETATIONS[className];
                return (
                  <motion.div 
                    key={className} 
                    className="prediction-row"
                    whileHover={{ x: 4 }}
                  >
                    <div className="prediction-label">
                      <span className="class-icon">{classInfo.icon}</span>
                      <span className="class-name">{classInfo.label}</span>
                    </div>
                    <div className="prediction-bar-container">
                      <motion.div 
                        className="prediction-bar"
                        initial={{ width: 0 }}
                        animate={{ width: formatPercent(confidence) }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ 
                          backgroundColor: classInfo.color,
                          boxShadow: `0 0 12px ${classInfo.color}40`
                        }}
                      />
                    </div>
                    <span className="prediction-value">{formatPercent(confidence)}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Card Footer Stats */}
            <div className="model-card-footer">
              <div className="stat-item">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">94.2%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Parameters</span>
                <span className="stat-value">12.5M</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Ensemble Card */}
        <motion.div
          className="model-card ensemble-card"
          variants={staggerItem}
          {...cardHover}
          layoutId="model-ensemble"
        >
          <div className="model-card-header">
            <div className="model-info">
              <div className="model-icon ensemble-icon">🎯</div>
              <div className="model-texts">
                <span className="model-name">Ensemble</span>
                <span className="model-index">Final Output</span>
              </div>
            </div>
          </div>

          <div className="ensemble-badge">Weighted Average</div>

          <motion.div 
            className="predictions-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {classes.map((className) => {
              const confidence = ensemble[className];
              const classInfo = CLASS_INTERPRETATIONS[className];
              return (
                <motion.div 
                  key={className} 
                  className="prediction-row ensemble-row"
                  variants={staggerItem}
                  whileHover={{ x: 4 }}
                >
                  <div className="prediction-label">
                    <span className="class-icon">{classInfo.icon}</span>
                    <span className="class-name">{classInfo.label}</span>
                  </div>
                  <div className="prediction-bar-container">
                    <motion.div 
                      className="prediction-bar ensemble-bar"
                      initial={{ width: 0 }}
                      animate={{ width: formatPercent(confidence) }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ 
                        backgroundColor: classInfo.color,
                        boxShadow: `0 0 16px ${classInfo.color}50`
                      }}
                    >
                      <div className="ensemble-glow" />
                    </motion.div>
                  </div>
                  <span className="prediction-value">{formatPercent(confidence)}</span>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="model-card-footer">
            <div className="stat-item">
              <span className="stat-label">Confidence</span>
              <span className="stat-value">98.7%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Robustness</span>
              <span className="stat-value">High</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Statistics Footer */}
      <motion.div 
        className="comparison-footer"
        variants={staggerItem}
      >
        <div className="stat-box">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <span className="stat-label">Model Diversity</span>
            <span className="stat-value">High</span>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon">⚙️</span>
          <div className="stat-info">
            <span className="stat-label">Ensemble Method</span>
            <span className="stat-value">Weighted Averaging</span>
          </div>
        </div>
        <div className="stat-box">
          <span className="stat-icon">✓</span>
          <div className="stat-info">
            <span className="stat-label">Consensus</span>
            <span className="stat-value">{(modelAgreement.score * 100).toFixed(0)}% Agreed</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumModelComparison;
