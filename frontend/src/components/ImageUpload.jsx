import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    } else {
      alert('Please upload a valid image file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.tif,.tiff"
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <span className="preview-text">Click to change image</span>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📡</div>
            <h3>Drop satellite image here</h3>
            <p>or click to browse</p>
            <span className="upload-hint">Supports TIFF, PNG, JPEG formats</span>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <span>Analyzing image...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
