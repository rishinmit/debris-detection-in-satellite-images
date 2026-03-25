# OrbisScan — Satellite Image Analysis Frontend

A clean, dark-themed React frontend for AI-powered satellite image classification.

## Requirements
- Node.js 18+
- Your FastAPI backend running at `http://127.0.0.1:8000`

## Setup & Run

```bash
# 1. Navigate to project folder
cd satellite-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# App runs at http://localhost:5173
```

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/
    ImageUploader.jsx     # Drag-and-drop image upload component
    ConfidenceBar.jsx     # Animated probability bar for each class
    ResultChart.jsx       # Recharts bar chart of all class scores
    ResultPanel.jsx       # Full results view (top prediction, bars, chart)
  pages/
    AnalysisPage.jsx      # Main page layout
  services/
    api.js                # POST /predict to FastAPI backend
  index.css               # All styles (CSS variables, dark theme)
  App.jsx
  main.jsx
index.html
vite.config.js
```

## Backend CORS

If you see CORS errors, add this to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```
