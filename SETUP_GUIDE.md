# 🛠️ Complete Setup & Deployment Guide

## Quick Start (5 Minutes)

### Prerequisites
- Python 3.9+ installed
- Node.js 16+ installed
- Models in `backend/models/` (527 MB total)

### Step 1: Backend Setup
```bash
cd "/Users/rishiraj/Downloads/FYP React"

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install fastapi uvicorn pillow numpy rasterio scikit-image
```

**For GPU (CUDA):**
```bash
pip install torch torchvision torchaudio
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
cd ..
```

### Step 3: Run Backend
```bash
source venv/bin/activate
python3 -m uvicorn backend.main:app --reload
```

✅ You should see:
```
✅ Model 1 (DeepLabV3 + ResNet-50) loaded successfully
✅ Model 2 (ResNet50) loaded successfully
✅ Model 3 (EfficientNet-B0) loaded successfully
🎯 All models loaded! System ready for predictions.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 4: Run Frontend (New Terminal)
```bash
cd "/Users/rishiraj/Downloads/FYP React/frontend"
npm run dev
```

✅ You should see:
```
VITE v8.0.1  ready in 234 ms
➜  Local:   http://localhost:5173/
```

### Step 5: Open Application
Visit: **http://localhost:5173**

---

## Detailed Setup

### Backend Configuration

#### Python Version Check
```bash
python3 --version  # Should be 3.9+
```

#### Virtual Environment
```bash
# Create
python3 -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Verify activation (should show "venv" prefix)
```

#### Dependencies

**CPU Only (Default):**
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

**GPU (CUDA 11.8):**
```bash
pip install torch torchvision torchaudio
```

**Other Packages:**
```bash
pip install fastapi uvicorn pillow numpy rasterio scikit-image
```

#### Verify Installation
```bash
python3 -c "import torch; print(f'PyTorch: {torch.__version__}'); print(f'Device: {torch.device(\"cuda\" if torch.cuda.is_available() else \"cpu\")}')"
```

### Frontend Configuration

#### Node.js Check
```bash
node --version   # Should be 16+
npm --version    # Should be 8+
```

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Build Optimizations
```bash
# Production build
npm run build

# View output size
npm run build -- --outDir dist
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
python3 -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## API Usage

### Health Check
```bash
curl http://127.0.0.1:8000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-18T10:30:00",
  "api": "Marine Debris Detection",
  "version": "1.0.0"
}
```

### API Info
```bash
curl http://127.0.0.1:8000/info
```

### Predict Image
```bash
curl -X POST \
  -F "file=@path/to/image.tiff" \
  http://127.0.0.1:8000/predict
```

Response:
```json
{
  "ensemble": {
    "marine_debris": 0.75,
    "sargassum": 0.25,
    "turbid_water": 0.10,
    "organic": 0.05,
    "cloud": 0.02
  },
  "preview": "iVBORw0KGgo...",
  "time": 0.342,
  "metadata": {
    "width": 256,
    "height": 256,
    "format": "TIFF"
  },
  "request_id": "1715000000.123456"
}
```

---

## Troubleshooting

### Backend Issues

#### "ModuleNotFoundError: No module named 'torch'"
```bash
# Activate virtual environment first
source venv/bin/activate

# Then install torch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

#### "FileNotFoundError: Models not found"
```bash
# Check if models exist
ls -lh backend/models/

# Should show:
# model1_deeplabv3_final.pth (152 MB)
# model2_resnet50_final.pth (90 MB)
# model3_efficientnet_final.pth (16 MB)
```

#### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill the process
kill -9 <PID>

# Try different port
python3 -m uvicorn backend.main:app --port 8001
```

#### CUDA out of memory
Backend will fall back to CPU automatically. For larger batches, restart:
```bash
# Make sure no other processes use GPU
nvidia-smi

# Then restart backend
python3 -m uvicorn backend.main:app --reload
```

### Frontend Issues

#### "Cannot find module 'axios'"
```bash
cd frontend
npm install
```

#### Port 5173 already in use
```bash
# Frontend will auto-select next port (5174, 5175, etc.)
# Or kill the process using it
lsof -i :5173
kill -9 <PID>
```

#### "Failed to connect to backend"
Check:
1. Backend is running: `curl http://127.0.0.1:8000/health`
2. Correct backend URL in `frontend/src/services/api.js`
3. CORS is enabled in backend

### File Upload Issues

#### "File too large"
- Max 50 MB per file
- Compress image if needed
- For production, increase in `backend/main.py`:
  ```python
  MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB
  ```

#### "Invalid file format"
Supported: `.tif`, `.tiff`, `.jpg`, `.jpeg`, `.png`

To add support for more formats, edit `backend/main.py`:
```python
ALLOWED_EXTENSIONS = {'.tif', '.tiff', '.jpg', '.jpeg', '.png', '.new_ext'}
```

---

## Performance Tuning

### Backend

**Increase Workers (Production):**
```bash
python3 -m uvicorn backend.main:app --workers 8
```

**Use Gunicorn (Better for production):**
```bash
pip install gunicorn
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

**Optimize Build:**
```bash
cd frontend
npm run build

# Check size
npm run build -- --analyze
```

**Enable Compression:**
Add to `vite.config.js`:
```javascript
import compression from 'vite-plugin-compression';

export default {
  plugins: [compression()],
}
```

---

## Project Structure

```
FYP React/
├── backend/
│   ├── models/
│   │   ├── model1_deeplabv3_final.pth    (152 MB)
│   │   ├── model2_resnet50_final.pth     (90 MB)
│   │   └── model3_efficientnet_final.pth (16 MB)
│   ├── inference.py                       (Model loading & prediction)
│   └── main.py                            (FastAPI server)
│
├── frontend/
│   ├── src/
│   │   ├── components/                    (React components)
│   │   ├── services/                      (API calls)
│   │   ├── utils/                         (Analysis & report generation)
│   │   ├── App.jsx                        (Main app)
│   │   └── App.css                        (Styling)
│   ├── package.json
│   └── vite.config.js
│
├── venv/                                  (Python virtual environment)
├── SETUP_GUIDE.md                         (This file)
├── UPGRADES.md                            (Upgrade details)
└── START_HERE.md                          (Getting started)
```

---

## Deployment

### Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Backend
COPY backend/ ./backend/
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install fastapi uvicorn pillow numpy rasterio scikit-image

# Frontend (requires Node)
FROM node:16-alpine
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

EXPOSE 8000 5173

CMD ["uvicorn backend.main:app --host 0.0.0.0"]
```

### Cloud Deployment

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**AWS/GCP/Azure:**
See their respective documentation for containerized Flask/FastAPI apps.

---

## Performance Benchmarks

| Operation | Time | Device |
|---|---|---|
| Backend startup | 2-3s | CPU/GPU |
| Single image prediction | 0.3-0.5s | T4 GPU |
| API health check | <10ms | - |
| Help banner toggle | Instant | - |
| Image upload | <1s | 100 MB file |

---

## Monitoring

### Backend Health
```bash
watch -n 1 'curl -s http://127.0.0.1:8000/health | python3 -m json.tool'
```

### GPU Usage (if available)
```bash
watch -n 1 nvidia-smi
```

### Check Model Loading
Logs appear on backend startup:
```
🚀 MARINE DEBRIS DETECTION SYSTEM - MODEL LOADING
==============================================================
✅ Model 1 (DeepLabV3 + ResNet-50) loaded successfully
✅ Model 2 (ResNet50) loaded successfully
✅ Model 3 (EfficientNet-B0) loaded successfully
...
```

---

## Support & Documentation

- **API Docs**: http://127.0.0.1:8000/docs (Swagger UI)
- **ReDoc**: http://127.0.0.1:8000/redoc
- **Backend Guide**: See `UPGRADES.md`
- **Model Info**: Fetch from `GET /info`

---

## Summary

✅ **You're all set!**

1. **Backend running?** → http://127.0.0.1:8000/health ✓
2. **Frontend running?** → http://localhost:5173 ✓
3. **Models loaded?** → Check backend logs ✓
4. **Ready to detect debris?** → Upload image! 🛰️

For issues, check troubleshooting section above. Happy detecting! 🎯