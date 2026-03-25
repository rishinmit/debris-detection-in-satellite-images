import { useRef, useState } from "react";

export default function ImageUploader({ onImageSelect, previewUrl, isLoading }) {
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.match(/image\/.*/)) return;
    onImageSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="uploader-card">
      <div
        className={`drop-zone ${dragOver ? "drag-active" : ""} ${previewUrl ? "has-preview" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current.click()}
      >
        {previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="Uploaded satellite" className="preview-img" />
            <div className="preview-overlay">
              <span className="replace-text">↑ Click or drop to replace</span>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">⬡</div>
            <p className="upload-title">Drop satellite image here</p>
            <p className="upload-sub">or click to browse — TIFF, PNG, JPG supported</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.tif,.tiff"
          className="hidden-input"
          onChange={(e) => handleFile(e.target.files[0])}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
