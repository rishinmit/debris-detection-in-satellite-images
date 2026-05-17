# ⚡ Quick Reference - Commands & APIs

## 🚀 Start Everything (Copy & Paste)

### Terminal 1 - Backend
```bash
cd "/Users/rishiraj/Downloads/FYP React"
source venv/bin/activate
python3 -m uvicorn backend.main:app --reload
```

### Terminal 2 - Frontend  
```bash
cd "/Users/rishiraj/Downloads/FYP React/frontend"
npm run dev
```

### Open Browser
```
http://localhost:5173
```

---

## 🔗 API Endpoints

| Endpoint | Method | Purpose | Example |
|---|---|---|---|
| `/health` | GET | Check API status | `curl http://127.0.0.1:8000/health` |
| `/info` | GET | Get API/model info | `curl http://127.0.0.1:8000/info` |
| `/predict` | POST | Predict image | `curl -F "file=@image.tiff" http://127.0.0.1:8000/predict` |
| `/stats` | GET | Usage stats | `curl http://127.0.0.1:8000/stats` |

---

## 📦 File Structure

```
backend/models/
  ├── model1_deeplabv3_final.pth    ← Must be present
  ├── model2_resnet50_final.pth     ← Must be present
  └── model3_efficientnet_final.pth ← Must be present

frontend/src/
  ├── App.jsx              ← Main app (with help banner)
  ├── services/api.js      ← Backend communication
  └── components/          ← UI components
```

---

## 🛠️ Setup (First Time Only)

```bash
# 1. Create venv
python3 -m venv venv

# 2. Activate venv
source venv/bin/activate

# 3. Install backend deps
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install fastapi uvicorn pillow numpy rasterio scikit-image

# 4. Install frontend deps
cd frontend && npm install && cd ..

# 5. Verify models exist
ls -lh backend/models/
```

---

## ✅ Startup Checklist

- [ ] Virtual env activated: `source venv/bin/activate`
- [ ] Backend running: `python3 -m uvicorn backend.main:app --reload`
- [ ] Frontend running: `npm run dev`
- [ ] Browser: http://localhost:5173
- [ ] Status indicator shows "Connected" ✓
- [ ] Help button (?) works
- [ ] Ready to upload images

---

## 🆘 Quick Fixes

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: torch` | `source venv/bin/activate` then `pip install torch...` |
| `Port 8000 already in use` | `lsof -i :8000` then `kill -9 <PID>` |
| `Models not found` | Check `backend/models/` has 3 `.pth` files |
| `Frontend won't connect` | Check backend health: `curl http://127.0.0.1:8000/health` |
| `No module named axios` | `cd frontend && npm install && cd ..` |

---

## 📊 Expected Response (Prediction)

```json
{
  "ensemble": {
    "marine_debris": 0.75,
    "sargassum": 0.25,
    "turbid_water": 0.10,
    "organic": 0.05,
    "cloud": 0.02
  },
  "preview": "iVBORw0KGgo...(base64 image)...",
  "time": 0.342,
  "metadata": {
    "width": 256,
    "height": 256,
    "format": "TIFF"
  },
  "request_id": "1715000000.123456",
  "total_time": 0.350
}
```

---

## 🎯 What's New (Upgrades)

### Backend
- ✅ `/health` endpoint - Check API status
- ✅ `/info` endpoint - Model & class info
- ✅ Better error messages with status codes
- ✅ File validation (size, format)
- ✅ Request logging with IDs

### Frontend
- ✅ Help banner (?) with instructions
- ✅ Connection status indicator
- ✅ Error dismiss button
- ✅ Request ID in metadata
- ✅ Better footer with status

---

## 📁 Important Files Modified

```
backend/main.py          ← New endpoints, validation, logging
backend/inference.py     ← Better startup messages
frontend/src/App.jsx     ← Help banner, status indicator
frontend/src/App.css     ← New styles
frontend/src/services/api.js ← Enhanced error handling
```

---

## 🔧 Configuration

### Change Backend Port
```bash
python3 -m uvicorn backend.main:app --port 8001
```

### Change Frontend Port
Edit `frontend/vite.config.js`:
```javascript
export default {
  server: {
    port: 5174
  }
}
```

### Increase File Size Limit
Edit `backend/main.py`:
```python
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB
```

### Add Supported File Types
Edit `backend/main.py`:
```python
ALLOWED_EXTENSIONS = {'.tif', '.tiff', '.jpg', '.jpeg', '.png', '.new_ext'}
```

---

## 📈 Performance Tips

### Backend
- Use GPU: Install CUDA version of PyTorch
- Multiple workers: `--workers 4` for production
- Check GPU: `nvidia-smi`

### Frontend
- Production build: `npm run build`
- Check size: `npm run build` then check `dist/` folder
- Optimize images before uploading

---

## 🔍 Debugging

### Check Backend Health
```bash
curl -v http://127.0.0.1:8000/health
```

### Check Model Loading
Look for this in backend terminal:
```
✅ All models loaded! System ready for predictions.
```

### Check API Info
```bash
curl http://127.0.0.1:8000/info | python3 -m json.tool
```

### Check Frontend Logs
Open browser DevTools: `F12` → Console tab

### Check Network Requests
DevTools → Network tab → Upload image → See request/response

---

## 📚 Documentation

| File | Purpose |
|---|---|
| `START_HERE.md` | Getting started with notebooks |
| `SETUP_GUIDE.md` | Complete setup instructions |
| `UPGRADES.md` | Detailed upgrade list |
| `NOTEBOOK_REFERENCE.txt` | Training notebook details |
| `WORKFLOW_SUMMARY.md` | Training improvements |
| `RETRAINING_GUIDE.md` | Step-by-step retraining |

---

## 💡 Pro Tips

1. **Keep terminal open** - Don't close backend terminal while working
2. **Use separate terminals** - One for backend, one for frontend
3. **Check logs** - Backend logs show what's happening
4. **Help button** - Click (?) for usage instructions
5. **API docs** - Visit http://127.0.0.1:8000/docs for interactive docs

---

## 🎯 Common Workflows

### Upload & Predict
1. Navigate to http://localhost:5173
2. Click upload area or drag-drop image
3. Wait for prediction (0.3-0.5s)
4. See results in right panel
5. Export PDF report

### Check API Status
```bash
curl http://127.0.0.1:8000/health
```

### Test Upload
```bash
curl -X POST \
  -F "file=@test_image.tiff" \
  http://127.0.0.1:8000/predict | python3 -m json.tool
```

### Restart Everything
```bash
# Ctrl+C in both terminals

# Terminal 1
source venv/bin/activate
python3 -m uvicorn backend.main:app --reload

# Terminal 2
cd frontend && npm run dev
```

---

## 🚀 You're Ready!

Everything is configured and ready. Just:
1. Run the two commands above
2. Open http://localhost:5173
3. Upload images
4. Get predictions
5. Export reports

**Questions?** Check the docs above or look at backend/frontend logs. Happy detecting! 🛰️🌊