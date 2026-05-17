import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({ preview, metadata }) => {
  if (!preview) return null;

  return (
    <div className="image-preview-card">
      <div className="preview-header">
        <h3>Analyzed Image</h3>
      </div>
      
      <div className="preview-image-container">
        <img 
          src={`data:image/png;base64,${preview}`} 
          alt="Analysis Preview" 
          className="preview-image"
        />
      </div>

      {metadata && (
        <div className="metadata-section">
          <div className="metadata-item">
            <span className="metadata-label">Dimensions</span>
            <span className="metadata-value">{metadata.width} × {metadata.height} px</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Format</span>
            <span className="metadata-value">{metadata.format}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
