// Class interpretations
export const CLASS_INTERPRETATIONS = {
  marine_debris: {
    label: 'Marine Debris',
    description: 'Plastic waste and floating pollution',
    icon: '🗑️',
    color: '#ff4757',
    severity: 'critical'
  },
  sargassum: {
    label: 'Sargassum',
    description: 'Seaweed and algae blooms',
    icon: '🌿',
    color: '#2ed573',
    severity: 'moderate'
  },
  turbid_water: {
    label: 'Turbid Water',
    description: 'Muddy or sediment-rich water',
    icon: '🌊',
    color: '#ffa502',
    severity: 'moderate'
  },
  organic: {
    label: 'Organic Material',
    description: 'Natural biological matter',
    icon: '🍂',
    color: '#5f27cd',
    severity: 'low'
  },
  cloud: {
    label: 'Cloud Cover',
    description: 'Atmospheric cloud coverage',
    icon: '☁️',
    color: '#70a1ff',
    severity: 'low'
  }
};

// Get top prediction
export const getTopPrediction = (predictions) => {
  const entries = Object.entries(predictions);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return {
    class: sorted[0][0],
    confidence: sorted[0][1],
    label: CLASS_INTERPRETATIONS[sorted[0][0]]?.label || sorted[0][0],
    interpretation: CLASS_INTERPRETATIONS[sorted[0][0]]
  };
};

// Calculate risk level
export const getRiskLevel = (confidence) => {
  if (confidence < 0.4) {
    return { level: 'Low', color: '#2ed573', description: 'Detection confidence is below critical threshold' };
  } else if (confidence < 0.7) {
    return { level: 'Medium', color: '#ffa502', description: 'Moderate confidence - further investigation recommended' };
  } else {
    return { level: 'High', color: '#ff4757', description: 'High confidence detection - immediate action may be required' };
  }
};

// Calculate model agreement score
export const calculateModelAgreement = (modelPredictions) => {
  if (!modelPredictions || modelPredictions.length < 2) {
    return { score: 0, level: 'Unknown', description: 'Insufficient model data' };
  }

  // Get top class for each model
  const topClasses = modelPredictions.map(model => {
    const entries = Object.entries(model.predictions);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  });

  // Calculate agreement percentage
  const mostCommon = topClasses.reduce((acc, cls) => {
    acc[cls] = (acc[cls] || 0) + 1;
    return acc;
  }, {});

  const maxAgreement = Math.max(...Object.values(mostCommon));
  const agreementScore = maxAgreement / topClasses.length;

  if (agreementScore >= 0.8) {
    return { 
      score: agreementScore, 
      level: 'High', 
      description: 'Models strongly agree on the prediction',
      color: '#2ed573'
    };
  } else if (agreementScore >= 0.5) {
    return { 
      score: agreementScore, 
      level: 'Medium', 
      description: 'Models show moderate agreement',
      color: '#ffa502'
    };
  } else {
    return { 
      score: agreementScore, 
      level: 'Low', 
      description: 'Models show divergent predictions - use ensemble with caution',
      color: '#ff4757'
    };
  }
};

// Generate explanations based on prediction
export const generateExplanations = (topClass, confidence, predictions) => {
  const explanations = [];
  
  const classInfo = CLASS_INTERPRETATIONS[topClass];
  
  if (topClass === 'marine_debris') {
    explanations.push(`Detected patterns consistent with floating plastic debris with ${(confidence * 100).toFixed(1)}% confidence`);
    explanations.push('Spectral signature matches synthetic materials in marine environment');
    if (predictions.turbid_water > 0.2) {
      explanations.push('Concurrent turbidity may indicate pollution mixing with sediment');
    }
  } else if (topClass === 'sargassum') {
    explanations.push(`Identified organic seaweed formations with ${(confidence * 100).toFixed(1)}% confidence`);
    explanations.push('Characteristic reflectance patterns of algae blooms detected');
    if (predictions.organic > 0.2) {
      explanations.push('Additional organic material signals support classification');
    }
  } else if (topClass === 'turbid_water') {
    explanations.push(`Water turbidity detected with ${(confidence * 100).toFixed(1)}% confidence`);
    explanations.push('High sediment concentration indicated by reduced water clarity');
    if (predictions.organic > 0.15) {
      explanations.push('Some organic content may be contributing to turbidity');
    }
  } else if (topClass === 'organic') {
    explanations.push(`Natural organic material identified with ${(confidence * 100).toFixed(1)}% confidence`);
    explanations.push('Biological signatures detected in spectral analysis');
    explanations.push('Likely natural debris or biological aggregations');
  } else if (topClass === 'cloud') {
    explanations.push(`Cloud coverage detected with ${(confidence * 100).toFixed(1)}% confidence`);
    explanations.push('Atmospheric interference may obscure surface features');
    explanations.push('Consider acquiring imagery from different time period');
  }

  return explanations;
};

// Check if alert should be shown
export const shouldShowAlert = (predictions) => {
  return predictions.marine_debris > 0.6;
};

// Format percentage
export const formatPercent = (value) => {
  return `${(value * 100).toFixed(1)}%`;
};

// Mock model-wise data (for when backend doesn't provide it yet)
export const mockModelWiseData = (ensemble) => {
  const addNoise = (value, variance = 0.05) => {
    const noise = (Math.random() - 0.5) * variance;
    return Math.max(0, Math.min(1, value + noise));
  };

  return [
    {
      name: 'DeepLabV3',
      predictions: {
        marine_debris: addNoise(ensemble.marine_debris, 0.08),
        sargassum: addNoise(ensemble.sargassum, 0.08),
        turbid_water: addNoise(ensemble.turbid_water, 0.08),
        organic: addNoise(ensemble.organic, 0.08),
        cloud: addNoise(ensemble.cloud, 0.08)
      }
    },
    {
      name: 'ResNet50',
      predictions: {
        marine_debris: addNoise(ensemble.marine_debris, 0.1),
        sargassum: addNoise(ensemble.sargassum, 0.1),
        turbid_water: addNoise(ensemble.turbid_water, 0.1),
        organic: addNoise(ensemble.organic, 0.1),
        cloud: addNoise(ensemble.cloud, 0.1)
      }
    },
    {
      name: 'EfficientNet-B0',
      predictions: {
        marine_debris: addNoise(ensemble.marine_debris, 0.07),
        sargassum: addNoise(ensemble.sargassum, 0.07),
        turbid_water: addNoise(ensemble.turbid_water, 0.07),
        organic: addNoise(ensemble.organic, 0.07),
        cloud: addNoise(ensemble.cloud, 0.07)
      }
    }
  ];
};
