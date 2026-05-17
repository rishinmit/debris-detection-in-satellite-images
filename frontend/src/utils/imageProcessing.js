/**
 * Advanced TIFF/Satellite Image Processing Pipeline
 * Handles normalization, enhancement, and rendering of satellite imagery
 */

// ============================================================================
// 1. IMAGE LOADING & PREPROCESSING
// ============================================================================

/**
 * Load image and extract pixel data
 */
export async function loadImageData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve({
          data: imageData.data,
          width: img.width,
          height: img.height,
          format: file.type || 'image/tiff'
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// 2. NORMALIZATION & SCALING
// ============================================================================

/**
 * Min-Max Normalization: scales values to 0-255 range
 */
export function minMaxNormalization(imageData) {
  const { data } = imageData;
  let min = Infinity, max = -Infinity;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (gray < min) min = gray;
    if (gray > max) max = gray;
  }
  
  const range = max - min || 1;
  const normalized = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = ((gray - min) / range) * 255;
    normalized[i] = value;
    normalized[i + 1] = value;
    normalized[i + 2] = value;
    normalized[i + 3] = data[i + 3];
  }
  
  return {
    ...imageData,
    data: normalized,
    stats: { min, max, range }
  };
}

/**
 * Percentile Clipping: removes extreme values (typically 2-98%)
 * Crucial for satellite imagery with outliers
 */
export function percentileClipping(imageData, lowerPercentile = 2, upperPercentile = 98) {
  const { data } = imageData;
  const values = [];
  
  for (let i = 0; i < data.length; i += 4) {
    values.push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  
  values.sort((a, b) => a - b);
  const lowerIdx = Math.floor(values.length * (lowerPercentile / 100));
  const upperIdx = Math.floor(values.length * (upperPercentile / 100));
  
  const lowerBound = values[lowerIdx];
  const upperBound = values[upperIdx];
  const range = upperBound - lowerBound || 1;
  
  const clipped = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const clippedValue = Math.max(lowerBound, Math.min(upperBound, gray));
    const normalized = ((clippedValue - lowerBound) / range) * 255;
    
    clipped[i] = normalized;
    clipped[i + 1] = normalized;
    clipped[i + 2] = normalized;
    clipped[i + 3] = data[i + 3];
  }
  
  return {
    ...imageData,
    data: clipped,
    stats: { lowerBound, upperBound, range }
  };
}

// ============================================================================
// 3. CONTRAST & BRIGHTNESS ENHANCEMENT
// ============================================================================

/**
 * Gamma Correction: brightens or darkens image in a non-linear way
 * gamma < 1.0 = brighter, gamma > 1.0 = darker
 */
export function gammaCorrection(imageData, gamma = 0.6) {
  const { data } = imageData;
  const corrected = new Uint8ClampedArray(data.length);
  const invGamma = 1 / gamma;
  
  for (let i = 0; i < data.length; i += 4) {
    const normalized = data[i] / 255;
    const correctedValue = Math.pow(normalized, invGamma) * 255;
    
    corrected[i] = correctedValue;
    corrected[i + 1] = correctedValue;
    corrected[i + 2] = correctedValue;
    corrected[i + 3] = data[i + 3];
  }
  
  return {
    ...imageData,
    data: corrected,
    enhancement: { type: 'gamma', value: gamma }
  };
}

/**
 * Contrast Stretching: enhances contrast by expanding value range
 */
export function contrastStretching(imageData, strength = 1.5) {
  const { data } = imageData;
  const stretched = new Uint8ClampedArray(data.length);
  
  // Find current range
  let min = 255, max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    min = Math.min(min, gray);
    max = Math.max(max, gray);
  }
  
  const range = max - min || 1;
  const midpoint = (min + max) / 2;
  
  for (let i = 0; i < data.length; i += 4) {
    const normalized = (data[i] - midpoint) / (range / 2);
    const stretched_val = midpoint + (normalized * (range / 2) * strength);
    const clamped = Math.max(0, Math.min(255, stretched_val));
    
    stretched[i] = clamped;
    stretched[i + 1] = clamped;
    stretched[i + 2] = clamped;
    stretched[i + 3] = data[i + 3];
  }
  
  return {
    ...imageData,
    data: stretched,
    enhancement: { type: 'contrast', value: strength }
  };
}

/**
 * Brightness and Contrast Adjustment via Sliders
 */
export function adjustBrightnessContrast(imageData, brightness = 0, contrast = 1) {
  const { data } = imageData;
  const adjusted = new Uint8ClampedArray(data.length);
  
  for (let i = 0; i < data.length; i += 4) {
    let value = data[i];
    
    // Apply contrast
    value = (value - 128) * contrast + 128;
    
    // Apply brightness
    value += brightness;
    
    // Clamp
    value = Math.max(0, Math.min(255, value));
    
    adjusted[i] = value;
    adjusted[i + 1] = value;
    adjusted[i + 2] = value;
    adjusted[i + 3] = data[i + 3];
  }
  
  return {
    ...imageData,
    data: adjusted,
    adjustments: { brightness, contrast }
  };
}

// ============================================================================
// 4. HISTOGRAM EQUALIZATION (CLAHE)
// ============================================================================

/**
 * Histogram Equalization: improves contrast distribution
 * Great for satellite imagery with uneven lighting
 */
export function histogramEqualization(imageData) {
  const { data } = imageData;
  const histogram = new Array(256).fill(0);
  
  // Build histogram
  for (let i = 0; i < data.length; i += 4) {
    histogram[data[i]]++;
  }
  
  // Calculate CDF (Cumulative Distribution Function)
  const cdf = new Array(256);
  let sum = 0;
  const pixelCount = data.length / 4;
  
  for (let i = 0; i < 256; i++) {
    sum += histogram[i];
    cdf[i] = Math.round((sum / pixelCount) * 255);
  }
  
  // Apply histogram equalization
  const equalized = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const newValue = cdf[data[i]];
    equalized[i] = newValue;
    equalized[i + 1] = newValue;
    equalized[i + 2] = newValue;
    equalized[i + 3] = data[i + 3];
  }
  
  return {
    ...imageData,
    data: equalized,
    enhancement: { type: 'histogram_equalization' }
  };
}

// ============================================================================
// 5. MULTISPECTRAL / FALSE COLOR RENDERING
// ============================================================================

/**
 * Auto-detect if image is grayscale or multispectral
 */
export function detectImageType(imageData) {
  const { data } = imageData;
  let isGrayscale = true;
  
  // Sample pixels to check if R, G, B channels vary
  for (let i = 0; i < Math.min(data.length, 10000); i += 4) {
    if (data[i] !== data[i + 1] || data[i + 1] !== data[i + 2]) {
      isGrayscale = false;
      break;
    }
  }
  
  return {
    type: isGrayscale ? 'grayscale' : 'multispectral',
    hasAlpha: true,
    width: imageData.width,
    height: imageData.height
  };
}

/**
 * Apply False Color Rendering (useful for Sentinel-2)
 * Common: NIR-Red-Green = [B8, B4, B3]
 */
export function applyFalseColorRendering(imageData, mode = 'nrg') {
  const { data } = imageData;
  const rendered = new Uint8ClampedArray(data.length);
  
  // NIR-Red-Green rendering
  if (mode === 'nrg') {
    for (let i = 0; i < data.length; i += 4) {
      rendered[i] = Math.min(255, data[i] * 1.2);      // R
      rendered[i + 1] = data[i];                         // G
      rendered[i + 2] = Math.max(0, data[i] * 0.8);    // B
      rendered[i + 3] = data[i + 3];
    }
  }
  // False color for water detection
  else if (mode === 'water') {
    for (let i = 0; i < data.length; i += 4) {
      rendered[i] = Math.min(255, data[i] * 1.5);      // Enhance red for water
      rendered[i + 1] = data[i] * 0.5;
      rendered[i + 2] = data[i];
      rendered[i + 3] = data[i + 3];
    }
  }
  
  return {
    ...imageData,
    data: rendered,
    enhancement: { type: 'false_color', mode }
  };
}

// ============================================================================
// 6. MAIN PROCESSING PIPELINE
// ============================================================================

/**
 * Complete preprocessing pipeline
 * Automatically handles most cases
 */
export async function preprocessImage(file, options = {}) {
  const {
    enablePercentileClipping = true,
    lowerPercentile = 2,
    upperPercentile = 98,
    enableGamma = true,
    gamma = 0.65,
    enableContrast = true,
    contrastStrength = 1.3,
    enableHistogramEq = false,
    brightness = 10,
    contrast = 1.1,
  } = options;

  try {
    // Load image
    let processed = await loadImageData(file);
    
    // Detect image type
    const imageType = detectImageType(processed);
    
    // Apply percentile clipping first (removes outliers)
    if (enablePercentileClipping) {
      processed = percentileClipping(processed, lowerPercentile, upperPercentile);
    }
    
    // Apply gamma correction
    if (enableGamma) {
      processed = gammaCorrection(processed, gamma);
    }
    
    // Apply contrast stretching
    if (enableContrast) {
      processed = contrastStretching(processed, contrastStrength);
    }
    
    // Optional: Histogram equalization
    if (enableHistogramEq) {
      processed = histogramEqualization(processed);
    }
    
    // Fine-tune brightness/contrast
    processed = adjustBrightnessContrast(processed, brightness, contrast);
    
    // Convert to canvas for rendering
    const canvas = document.createElement('canvas');
    canvas.width = processed.width;
    canvas.height = processed.height;
    
    const ctx = canvas.getContext('2d');
    const imageDataObj = ctx.createImageData(processed.width, processed.height);
    imageDataObj.data.set(processed.data);
    ctx.putImageData(imageDataObj, 0, 0);
    
    return {
      canvas,
      dataUrl: canvas.toDataURL('image/png'),
      metadata: {
        width: processed.width,
        height: processed.height,
        format: imageType.type,
        originalFile: file.name,
        originalSize: file.size,
      },
      stats: processed.stats || {},
      enhancement: processed.enhancement || {}
    };
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error(`Image preprocessing failed: ${error.message}`);
  }
}

/**
 * Generate side-by-side comparison
 */
export async function generateComparison(file) {
  const original = await loadImageData(file);
  const enhanced = await preprocessImage(file, {
    enablePercentileClipping: true,
    enableGamma: true,
    enableContrast: true,
  });

  const comparisonCanvas = document.createElement('canvas');
  comparisonCanvas.width = original.width * 2;
  comparisonCanvas.height = original.height;

  const ctx = comparisonCanvas.getContext('2d');
  
  // Original on left
  const originalImageData = ctx.createImageData(original.width, original.height);
  originalImageData.data.set(original.data);
  ctx.putImageData(originalImageData, 0, 0);
  
  // Enhanced on right
  ctx.drawImage(enhanced.canvas, original.width, 0);

  return {
    canvas: comparisonCanvas,
    dataUrl: comparisonCanvas.toDataURL('image/png'),
  };
}

// ============================================================================
// 7. UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate image statistics for display
 */
export function calculateImageStats(imageData) {
  const { data } = imageData;
  let sum = 0, min = 255, max = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    sum += gray;
    min = Math.min(min, gray);
    max = Math.max(max, gray);
  }
  
  const pixelCount = data.length / 4;
  const mean = sum / pixelCount;
  
  return {
    min,
    max,
    mean: Math.round(mean),
    range: max - min,
    pixelCount,
  };
}

/**
 * Check if image appears to be entirely black
 */
export function isBlackImage(imageData, threshold = 30) {
  const { data } = imageData;
  let darkPixels = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    if (gray < threshold) darkPixels++;
  }
  
  const darkRatio = darkPixels / (data.length / 4);
  return darkRatio > 0.95; // If >95% is very dark
}
