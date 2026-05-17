/**
 * Custom hook for image enhancement state management
 */

import { useState, useCallback } from 'react';
import { preprocessImage } from '../utils/imageProcessing';

export function useImageEnhancement() {
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Enhancement controls
  const [brightness, setBrightness] = useState(10);
  const [contrast, setContrast] = useState(1.1);
  const [gamma, setGamma] = useState(0.65);
  const [enableClipping, setEnableClipping] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const processImage = useCallback(async (file) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await preprocessImage(file, {
        enablePercentileClipping: enableClipping,
        gamma,
        brightness,
        contrast,
      });

      setEnhancedImage(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [brightness, contrast, gamma, enableClipping]);

  const resetEnhancements = useCallback(() => {
    setBrightness(10);
    setContrast(1.1);
    setGamma(0.65);
    setEnableClipping(true);
    setShowComparison(false);
  }, []);

  return {
    enhancedImage,
    isProcessing,
    error,
    // Controls
    brightness,
    setBrightness,
    contrast,
    setContrast,
    gamma,
    setGamma,
    enableClipping,
    setEnableClipping,
    showComparison,
    setShowComparison,
    // Methods
    processImage,
    resetEnhancements,
  };
}
