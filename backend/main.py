from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.inference import predict_image, SELECTED_CLASSES
import logging
import time
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Marine Debris Detection API",
    description="Multi-model ensemble for detecting marine debris in satellite imagery",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {'.tif', '.tiff', '.jpg', '.jpeg', '.png'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "api": "Marine Debris Detection",
        "version": "1.0.0"
    }

@app.get("/info")
async def api_info():
    """Get API and model information"""
    return {
        "title": "Marine Debris Detection System",
        "description": "AI-powered satellite image analysis using ensemble of 3 deep learning models",
        "models": [
            {"name": "DeepLabV3", "backbone": "ResNet-50", "input_channels": 7},
            {"name": "ResNet50", "input_channels": 7},
            {"name": "EfficientNet-B0", "input_channels": 7}
        ],
        "classes": SELECTED_CLASSES,
        "improvements": {
            "loss_functions": ["Binary Cross-Entropy", "Dice Loss", "Focal Loss"],
            "techniques": ["Class Weighting", "Data Augmentation", "Early Stopping", "Test-Time Augmentation"],
            "ensemble_method": "Weighted averaging by per-class AUC"
        },
        "supported_formats": list(ALLOWED_EXTENSIONS),
        "max_file_size_mb": MAX_FILE_SIZE // (1024 * 1024)
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict marine debris classes in satellite image"""

    start_time = time.time()
    request_id = f"{datetime.now().timestamp()}"

    try:
        logger.info(f"[{request_id}] Prediction request - File: {file.filename}")

        # Validate file extension
        if not any(file.filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
            logger.warning(f"[{request_id}] Invalid file extension: {file.filename}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file format. Supported: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Read file contents
        contents = await file.read()

        # Validate file size
        if len(contents) > MAX_FILE_SIZE:
            logger.warning(f"[{request_id}] File too large: {len(contents)} bytes")
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)} MB"
            )

        if len(contents) == 0:
            logger.warning(f"[{request_id}] Empty file")
            raise HTTPException(status_code=400, detail="File is empty")

        logger.info(f"[{request_id}] Processing image - Size: {len(contents) / (1024*1024):.2f} MB")

        # Get predictions
        result = predict_image(contents)

        if "error" in result:
            logger.error(f"[{request_id}] Prediction error: {result['error']}")
            raise HTTPException(status_code=500, detail=result["error"])

        elapsed = time.time() - start_time
        result["request_id"] = request_id
        result["total_time"] = round(elapsed, 3)

        logger.info(f"[{request_id}] Prediction successful - Time: {elapsed:.2f}s")
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/stats")
async def get_stats():
    """Get API usage statistics"""
    return {
        "message": "Stats tracking available in production deployment",
        "status": "ready"
    }