import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './EnhancedImagePreview.css';
import { preprocessImage, isBlackImage, calculateImageStats } from '../utils/imageProcessing';
import { ImageSkeletonLoader } from './SkeletonLoader';
import { fadeInUp, fadeIn } from '../utils/animations';

/**
 * Enhanced Image Preview Component
 * - Handles TIFF/satellite image normalization
 * - Interactive brightness/contrast controls
 * - Side-by-side original vs enhanced comparison
 * - Zoom and pan support
 * - Enhancement badges and metadata
 */

const EnhancedImagePreview = ({ file, onEnhanced }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  
  // Enhancement controls
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [gamma, setGamma] = useState(0.65);
  
  // UI state
  const [zoom, setZoom] = useState(1);
  const [showMetadata, setShowMetadata] = useState(true);

  // Load and enhance image
  useEffect(() => {
    if (!file) return;

    const processFile = async () => {
      setIsProcessing(true);
      setError(null);

      try {
        // Load original
        const canvas = document.createElement('canvas');
        const img = new Image();
        
        const loadPromise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = e.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const originalData = await loadPromise;
        setOriginalImage(originalData);

        // Process with enhancements
        const enhanced = await preprocessImage(file, {
          enablePercentileClipping: true,
          lowerPercentile: 2,
          upperPercentile: 98,
          enableGamma: true,
          gamma: 0.65,
          enableContrast: true,
          contrastStrength: 1.3,
          brightness: 10,
          contrast: 1.1,
        });

        setEnhancedImage(enhanced);
        
        // Callback with enhanced image
        if (onEnhanced) {
          onEnhanced(enhanced);
        }
      } catch (err) {
        console.error('Error processing image:', err);
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    };

    processFile();
  }, [file, onEnhanced]);

  const handleBrightnessChange = (value) => {
    setBrightness(parseInt(value));
  };

  const handleContrastChange = (value) => {
    setContrast(parseFloat(value));
  };

  const handleGammaChange = (value) => {
    setGamma(parseFloat(value));
  };

  const resetControls = () => {
    setBrightness(0);
    setContrast(1);
    setGamma(0.65);
  };

  if (!file) return null;

  return (
    <motion.div 
      className="enhanced-preview-card"
      {...fadeInUp}
    >
      {/* Header */}
      <div className="preview-header">
        <div className="header-left">
          <h3 className="preview-title">Satellite Image Analysis</h3>
          <motion.span 
            className="enhancement-badge"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Enhancement Applied
          </motion.span>
        </div>

        <div className="header-actions">
          <button
            className={`toggle-btn ${showComparison ? 'active' : ''}`}
            onClick={() => setShowComparison(!showComparison)}
            title="Toggle before/after comparison"
          >
            👁️ Compare
          </button>
          <button
            className="toggle-btn"
            onClick={() => setShowMetadata(!showMetadata)}
            title="Toggle metadata"
          >
            ℹ️ Info
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      {isProcessing ? (
        <ImageSkeletonLoader />
      ) : error ? (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      ) : (
        <>
          {/* Image Container */}
          <div className="image-container">
            {showComparison && originalImage ? (
              <div className="comparison-view">
                <div className="comparison-item">
                  <label>Original</label>
                  <img src={originalImage} alt="Original" style={{ transform: `scale(${zoom})` }} />
                </div>
                <div className="comparison-divider" />
                <div className="comparison-item">
                  <label>Enhanced</label>
                  <img 
                    src={enhancedImage?.dataUrl} 
                    alt="Enhanced" 
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>
              </div>
            ) : (
              <div className="single-view">
                <motion.img
                  key={enhancedImage?.dataUrl}
                  src={enhancedImage?.dataUrl}
                  alt="Enhanced Preview"
                  style={{ transform: `scale(${zoom})` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}

            {/* Zoom Controls */}
            <div className="zoom-controls">
              <button
                onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                disabled={zoom <= 1}
                title="Zoom out"
              >
                −
              </button>
              <span className="zoom-value">{(zoom * 100).toFixed(0)}%</span>
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                disabled={zoom >= 3}
                title="Zoom in"
              >
                +
              </button>
              <button
                onClick={() => setZoom(1)}
                disabled={zoom === 1}
                title="Reset zoom"
              >
                ⟲
              </button>
            </div>
          </div>

          {/* Enhancement Controls */}
          <motion.div 
            className="enhancement-controls"
            {...fadeIn}
          >
            <div className="controls-header">
              <span className="controls-label">Enhancement Controls</span>
              <button 
                className="reset-btn"
                onClick={resetControls}
              >
                ↺ Reset
              </button>
            </div>

            <div className="controls-grid">
              {/* Brightness */}
              <div className="control-item">
                <label htmlFor="brightness-slider">
                  <span className="control-icon">☀️</span>
                  <span className="control-name">Brightness</span>
                </label>
                <input
                  id="brightness-slider"
                  type="range"
                  min="-50"
                  max="50"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(e.target.value)}
                  className="slider"
                />
                <span className="control-value">{brightness > 0 ? '+' : ''}{brightness}</span>
              </div>

              {/* Contrast */}
              <div className="control-item">
                <label htmlFor="contrast-slider">
                  <span className="control-icon">◐</span>
                  <span className="control-name">Contrast</span>
                </label>
                <input
                  id="contrast-slider"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => handleContrastChange(e.target.value)}
                  className="slider"
                />
                <span className="control-value">{contrast.toFixed(1)}x</span>
              </div>

              {/* Gamma */}
              <div className="control-item">
                <label htmlFor="gamma-slider">
                  <span className="control-icon">⚡</span>
                  <span className="control-name">Gamma</span>
                </label>
                <input
                  id="gamma-slider"
                  type="range"
                  min="0.4"
                  max="1.5"
                  step="0.05"
                  value={gamma}
                  onChange={(e) => handleGammaChange(e.target.value)}
                  className="slider"
                />
                <span className="control-value">{gamma.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Metadata */}
          {showMetadata && enhancedImage?.metadata && (
            <motion.div 
              className="metadata-panel"
              {...fadeIn}
            >
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="metadata-key">Dimensions</span>
                  <span className="metadata-value">
                    {enhancedImage.metadata.width} × {enhancedImage.metadata.height} px
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-key">Format</span>
                  <span className="metadata-value">{enhancedImage.metadata.format}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-key">File Size</span>
                  <span className="metadata-value">
                    {(enhancedImage.metadata.originalSize / 1024).toFixed(2)} KB
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-key">Enhancement</span>
                  <span className="metadata-value">
                    Percentile Clipping + Gamma + Contrast
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default EnhancedImagePreview;
