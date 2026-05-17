import React from 'react';
import { motion } from 'framer-motion';
import './SkeletonLoader.css';

/**
 * Generic Skeleton Loader Component
 * Used for loading states across the dashboard
 */

export const ImageSkeletonLoader = () => (
  <motion.div 
    className="skeleton-image-container"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <div className="skeleton-shimmer" />
  </motion.div>
);

export const CardSkeletonLoader = () => (
  <div className="skeleton-card">
    <motion.div 
      className="skeleton-line skeleton-line-lg"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.div 
      className="skeleton-line skeleton-line-sm"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ marginTop: '12px' }}
    />
    <motion.div 
      className="skeleton-line skeleton-line-md"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ marginTop: '12px' }}
    />
  </div>
);

export const BarSkeletonLoader = () => (
  <div className="skeleton-bar-group">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="skeleton-bar-item">
        <motion.div 
          className="skeleton-bar"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      </div>
    ))}
  </div>
);

/**
 * Dashboard Loading Skeleton
 * Shows multiple loading states
 */
export const DashboardSkeletonLoader = () => (
  <div className="skeleton-dashboard">
    <div className="skeleton-section">
      <h3 className="skeleton-heading">Image Upload</h3>
      <ImageSkeletonLoader />
    </div>
    
    <div className="skeleton-section">
      <h3 className="skeleton-heading">Analysis Results</h3>
      <CardSkeletonLoader />
      <CardSkeletonLoader style={{ marginTop: '16px' }} />
    </div>

    <div className="skeleton-section">
      <h3 className="skeleton-heading">Model Confidence</h3>
      <BarSkeletonLoader />
    </div>
  </div>
);
