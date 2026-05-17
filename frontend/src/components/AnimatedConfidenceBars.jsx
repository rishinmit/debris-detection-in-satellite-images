import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedConfidenceBars.css';
import { CLASS_INTERPRETATIONS, formatPercent } from '../utils/analysis';
import { staggerContainer, staggerItem } from '../utils/animations';

/**
 * Animated Confidence Bars Component
 * - Smooth animated bar fills
 * - Color-coded by class
 * - Interactive tooltips
 * - Responsive design
 */

const AnimatedConfidenceBars = ({ predictions }) => {
  // Sort predictions by confidence
  const sortedPredictions = Object.entries(predictions)
    .sort((a, b) => b[1] - a[1]);

  const maxConfidence = Math.max(...Object.values(predictions));

  return (
    <motion.div 
      className="animated-confidence-section"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="confidence-section-header">
        <h3 className="confidence-title">Classification Confidence</h3>
        <span className="confidence-subtitle">Ensemble Model Predictions</span>
      </div>

      <div className="bars-container">
        {sortedPredictions.map(([className, confidence], index) => {
          const classInfo = CLASS_INTERPRETATIONS[className];
          const percentage = (confidence / maxConfidence) * 100;

          return (
            <motion.div
              key={className}
              className="confidence-bar-item"
              variants={staggerItem}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bar-header">
                <div className="bar-label">
                  <span className="bar-icon">{classInfo.icon}</span>
                  <div className="bar-label-text">
                    <span className="bar-name">{classInfo.label}</span>
                    <span className="bar-description-mini">{classInfo.description}</span>
                  </div>
                </div>
                <motion.span 
                  className="bar-value"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {formatPercent(confidence)}
                </motion.span>
              </div>

              <div className="bar-track">
                <motion.div 
                  className="bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    duration: 1.2,
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 25
                  }}
                  style={{ 
                    backgroundColor: classInfo.color,
                    boxShadow: `0 0 20px ${classInfo.color}40`
                  }}
                >
                  <div className="bar-shimmer" />
                </motion.div>
              </div>

              <div className="bar-meta">
                <span className="meta-label">{classInfo.severity}</span>
                <span className="meta-description">{classInfo.description}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="confidence-legend">
        <div className="legend-item">
          <span className="legend-dot legend-high" />
          <span className="legend-text">High Confidence (70-100%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-medium" />
          <span className="legend-text">Medium Confidence (40-70%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-low" />
          <span className="legend-text">Low Confidence (0-40%)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedConfidenceBars;
