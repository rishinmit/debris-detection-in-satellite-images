import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import io
import base64
from torchvision import transforms, models
import time
import logging
import os
import torch.nn.functional as F

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger = logging.getLogger(__name__)

IMAGE_SIZE = int(os.getenv("INFERENCE_IMAGE_SIZE", "256"))
SIGMOID_EPS = 1e-6

SELECTED_CLASSES = [
    "marine_debris",
    "sargassum",
    "turbid_water",
    "organic",
    "cloud"
]

DISPLAY_CLASSES = [
    "Marine Debris",
    "Sargassum",
    "Turbid Water",
    "Organic Material",
    "Cloud Cover",
]

MODEL_WEIGHTS = {
    "DeepLabV3": float(os.getenv("MODEL_WEIGHT_DEEPLABV3", "1.0")),
    "ResNet50": float(os.getenv("MODEL_WEIGHT_RESNET50", "1.0")),
    "EfficientNet": float(os.getenv("MODEL_WEIGHT_EFFICIENTNET", "1.0")),
}

CLASS_THRESHOLDS = {
    "marine_debris": float(os.getenv("THRESHOLD_MARINE_DEBRIS", "0.5")),
    "sargassum": float(os.getenv("THRESHOLD_SARGASSUM", "0.5")),
    "turbid_water": float(os.getenv("THRESHOLD_TURBID_WATER", "0.5")),
    "organic": float(os.getenv("THRESHOLD_ORGANIC", "0.5")),
    "cloud": float(os.getenv("THRESHOLD_CLOUD", "0.5")),
}

# ------------------------------------------------
# MODEL 1
# ------------------------------------------------

class DeepLabV3Classifier(nn.Module):

    def __init__(self, num_classes=5, in_channels=7):
        super().__init__()

        self.deeplab = models.segmentation.deeplabv3_resnet50(
            weights=None,
            weights_backbone=None
        )

        orig_conv = self.deeplab.backbone.conv1

        self.deeplab.backbone.conv1 = nn.Conv2d(
            in_channels,
            orig_conv.out_channels,
            kernel_size=orig_conv.kernel_size,
            stride=orig_conv.stride,
            padding=orig_conv.padding,
            bias=False
        )

        self.deeplab.classifier = models.segmentation.deeplabv3.DeepLabHead(2048,256)

        self.classifier = nn.Sequential(
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(256,num_classes)
        )

    def forward(self,x):

        x = self.deeplab(x)["out"]
        return self.classifier(x)

# ------------------------------------------------
# LOAD MODELS
# ------------------------------------------------

def load_model1():

    model = DeepLabV3Classifier()

    model.load_state_dict(
        torch.load("backend/models/model1_deeplabv3.pth",map_location=device),
        strict=False
    )

    model.to(device)
    model.eval()

    return model


def load_model2():

    model = models.resnet50(weights=None)

    model.conv1 = nn.Conv2d(7,64,7,2,3,bias=False)
    model.fc = nn.Linear(model.fc.in_features,5)

    model.load_state_dict(
        torch.load("backend/models/model2_resnet50.pth",map_location=device)
    )

    model.to(device)
    model.eval()

    return model


def load_model3():

    model = models.efficientnet_b0(weights=None)

    model.features[0][0] = nn.Conv2d(7,32,3,2,1,bias=False)

    model.classifier[1] = nn.Linear(
        model.classifier[1].in_features,5
    )

    model.load_state_dict(
        torch.load("backend/models/model3_efficientnet.pth",map_location=device),
        strict=False
    )

    model.to(device)
    model.eval()

    return model


print("\n" + "="*60)
print("🚀 MARINE DEBRIS DETECTION SYSTEM - MODEL LOADING")
print("="*60)

models_loaded = []
model1 = None
model2 = None
model3 = None

try:
    model1 = load_model1()
    print("✅ Model 1 (DeepLabV3 + ResNet-50) loaded successfully")
    models_loaded.append("DeepLabV3")
except FileNotFoundError as e:
    print(f"⚠️  Model 1 (DeepLabV3) not found: {e}")
except Exception as e:
    print(f"❌ Error loading Model 1: {e}")

try:
    model2 = load_model2()
    print("✅ Model 2 (ResNet50) loaded successfully")
    models_loaded.append("ResNet50")
except FileNotFoundError as e:
    print(f"⚠️  Model 2 (ResNet50) not found: {e}")
except Exception as e:
    print(f"❌ Error loading Model 2: {e}")

try:
    model3 = load_model3()
    print("✅ Model 3 (EfficientNet-B0) loaded successfully")
    models_loaded.append("EfficientNet")
except FileNotFoundError as e:
    print(f"⚠️  Model 3 (EfficientNet) not found: {e}")
except Exception as e:
    print(f"❌ Error loading Model 3: {e}")

print("-" * 60)
if model1 and model2 and model3:
    print("🎯 All models loaded! System ready for predictions.")
    print(f"📊 Classes: {', '.join(SELECTED_CLASSES)}")
    print(f"🔧 Device: {device}")
else:
    loaded_str = ', '.join(models_loaded) if models_loaded else "None"
    print(f"⚠️  Partial models loaded: {loaded_str}")
    print("    Download models from Google Drive to /backend/models/")
    print("    Required files:")
    print("      - model1_deeplabv3_final.pth")
    print("      - model2_resnet50_final.pth")
    print("      - model3_efficientnet_final.pth")
print("=" * 60 + "\n")

# ------------------------------------------------
# IMAGE PREPROCESSING
# ------------------------------------------------

transform = transforms.Compose([
    transforms.Resize((256,256)),
    transforms.ToTensor()
])

def preprocess_image(image):

    img = transform(image)

    if img.shape[0] == 3:

        extra = torch.zeros((4,img.shape[1],img.shape[2]))

        img = torch.cat([img,extra],dim=0)

    img = img.unsqueeze(0)

    return img.to(device)

# ------------------------------------------------
# PREVIEW IMAGE
# ------------------------------------------------

def create_preview(image):

    img = np.array(image)

    img = img - img.min()
    img = img / (img.max()+1e-6)
    img = (img*255).astype(np.uint8)

    preview = Image.fromarray(img)

    buffer = io.BytesIO()
    preview.save(buffer,format="PNG")

    return buffer.getvalue()

# ------------------------------------------------
# HELPER
# ------------------------------------------------

def probs_to_dict(probs):

    if isinstance(probs, torch.Tensor):
        probs = probs.detach().cpu().numpy()

    probs = np.asarray(probs, dtype=np.float32).reshape(-1)

    result = {}

    for i,c in enumerate(SELECTED_CLASSES):

        result[c] = float(probs[i])

    return result

def _stats_dict(array):
    """Compact numeric stats for debug logs and API diagnostics."""
    array = np.asarray(array)
    finite = array[np.isfinite(array)]
    if finite.size == 0:
        return {
            "min": None,
            "max": None,
            "mean": None,
            "std": None,
            "finite_ratio": 0.0,
        }

    return {
        "min": round(float(finite.min()), 6),
        "max": round(float(finite.max()), 6),
        "mean": round(float(finite.mean()), 6),
        "std": round(float(finite.std()), 6),
        "finite_ratio": round(float(finite.size / array.size), 6),
    }

def _per_channel_stats(bands):
    stats = {}
    for index, name in enumerate(["blue", "green", "red", "nir", "ndvi", "ndwi", "fdi"]):
        stats[name] = _stats_dict(bands[index])
    return stats

def _base_channel_stats(bands):
    stats = {}
    for index, name in enumerate(["blue", "green", "red", "nir"]):
        stats[name] = _stats_dict(bands[index])
    return stats

def _scale_reflectance(raw_bands):
    """Match training-time Sentinel-2 scaling while tolerating odd TIFF ranges."""
    bands = raw_bands.astype(np.float32, copy=False)
    bands = np.nan_to_num(bands, nan=0.0, posinf=0.0, neginf=0.0)

    finite = bands[np.isfinite(bands)]
    max_value = float(finite.max()) if finite.size else 0.0

    scale = 1.0
    if max_value > 2.0:
        scale = 10000.0
        bands = bands / scale

    # Training used reflectance-like inputs after /10000. Clamp only physically
    # implausible tails so corrupt NoData spikes do not dominate the indices.
    bands = np.clip(bands, 0.0, 1.5).astype(np.float32, copy=False)
    return bands, scale

def _build_training_channels(base_bands):
    """Create [B, G, R, NIR, NDVI, NDWI, FDI], exactly as training expected."""
    blue, green, red, nir = base_bands[0], base_bands[1], base_bands[2], base_bands[3]

    ndvi = (nir - red) / (nir + red + 1e-6)
    ndwi = (green - nir) / (green + nir + 1e-6)
    fdi = nir - (red + (nir - red) * (833 - 665) / (1610 - 665))

    indices = np.stack([
        np.clip(ndvi, -1.0, 1.0),
        np.clip(ndwi, -1.0, 1.0),
        np.clip(fdi, -1.0, 1.0),
    ]).astype(np.float32)

    return np.concatenate([base_bands, indices], axis=0).astype(np.float32, copy=False)

def _resize_tensor(channels, image_size=IMAGE_SIZE):
    tensor = torch.from_numpy(np.ascontiguousarray(channels)).float()
    if tensor.shape[-2:] != (image_size, image_size):
        tensor = F.interpolate(
            tensor.unsqueeze(0),
            size=(image_size, image_size),
            mode="bilinear",
            align_corners=False,
        ).squeeze(0)
    return tensor.unsqueeze(0).to(device)

def _read_tiff_bytes(image_bytes):
    import rasterio

    with rasterio.open(io.BytesIO(image_bytes)) as src:
        band_count = src.count
        if band_count < 1:
            raise ValueError("TIFF contains no readable bands")

        read_indexes = list(range(1, min(4, band_count) + 1))
        base_bands = src.read(read_indexes).astype(np.float32)

        if band_count < 4:
            pad_count = 4 - band_count
            padding = np.zeros((pad_count, base_bands.shape[1], base_bands.shape[2]), dtype=np.float32)
            base_bands = np.concatenate([base_bands, padding], axis=0)

        metadata = {
            "width": int(src.width),
            "height": int(src.height),
            "format": "TIFF",
            "band_count": int(band_count),
            "used_bands": read_indexes,
            "crs": str(src.crs) if src.crs else None,
            "dtype": list(src.dtypes),
            "nodata": src.nodata,
        }

    return base_bands, metadata

def _read_standard_image_bytes(image_bytes):
    opened = Image.open(io.BytesIO(image_bytes))
    image_format = opened.format or "IMAGE"
    image = opened.convert("RGB")
    rgb = np.asarray(image).astype(np.float32) / 255.0
    # PIL is RGB; training expects blue, green, red, nir.
    blue_green_red = np.transpose(rgb[..., [2, 1, 0]], (2, 0, 1))
    nir = np.zeros((1, blue_green_red.shape[1], blue_green_red.shape[2]), dtype=np.float32)
    metadata = {
        "width": int(image.width),
        "height": int(image.height),
        "format": image_format,
        "band_count": 3,
        "used_bands": ["B", "G", "R", "NIR=0"],
        "crs": None,
        "dtype": ["uint8"],
        "nodata": None,
    }
    return np.concatenate([blue_green_red, nir], axis=0), metadata

def preprocess_image_bytes(image_bytes):
    try:
        base_bands, metadata = _read_tiff_bytes(image_bytes)
    except Exception as tiff_error:
        logger.info("Falling back to PIL image reader after TIFF read failed: %s", tiff_error)
        base_bands, metadata = _read_standard_image_bytes(image_bytes)

    raw_stats = _base_channel_stats(base_bands)
    scaled_bands, scale = _scale_reflectance(base_bands)
    channels = _build_training_channels(scaled_bands)
    tensor = _resize_tensor(channels)

    debug = {
        "input": metadata,
        "scaling": {
            "divisor": scale,
            "image_size": IMAGE_SIZE,
            "channel_order": ["blue", "green", "red", "nir", "ndvi", "ndwi", "fdi"],
        },
        "raw_stats": raw_stats,
        "processed_stats": _per_channel_stats(channels),
        "tensor_shape": list(tensor.shape),
        "tensor_dtype": str(tensor.dtype),
        "device": str(device),
    }

    logger.info(
        "Preprocessed image: source=%sx%s bands=%s used=%s tensor=%s scale=/%s stats=%s",
        metadata["width"],
        metadata["height"],
        metadata["band_count"],
        metadata["used_bands"],
        tuple(tensor.shape),
        scale,
        debug["processed_stats"],
    )

    return tensor, channels, metadata, debug

def create_preview_from_channels(channels):
    # Training channels are B, G, R, NIR. Preview is true-color RGB.
    rgb = np.stack([channels[2], channels[1], channels[0]], axis=-1)
    finite = rgb[np.isfinite(rgb)]
    if finite.size:
        p2, p98 = np.percentile(finite, (2, 98))
    else:
        p2, p98 = 0.0, 1.0
    rgb = np.clip((rgb - p2) / (p98 - p2 + 1e-6), 0, 1)
    rgb = (rgb * 255).astype(np.uint8)
    return Image.fromarray(rgb)

def _safe_sigmoid(logits):
    probs = torch.sigmoid(logits)
    return probs.clamp(SIGMOID_EPS, 1.0 - SIGMOID_EPS)

def _model_prediction(name, model, img_tensor):
    logits = model(img_tensor)
    probs = _safe_sigmoid(logits)
    probs_np = probs.detach().cpu().numpy()[0]
    predicted_index = int(probs_np.argmax())
    return {
        "name": name,
        "probabilities_tensor": probs,
        "probabilities": probs_to_dict(probs_np),
        "logits": probs_to_dict(logits.detach().cpu().numpy()[0]),
        "predicted_class": SELECTED_CLASSES[predicted_index],
        "predicted_label": DISPLAY_CLASSES[predicted_index],
        "confidence": round(float(probs_np[predicted_index]), 6),
    }

def _weighted_average(model_outputs):
    active = [output for output in model_outputs if output is not None]
    if not active:
        raise RuntimeError("No models are loaded")

    weights = torch.tensor(
        [max(MODEL_WEIGHTS.get(output["name"], 1.0), 0.0) for output in active],
        dtype=torch.float32,
        device=device,
    )
    if float(weights.sum().item()) <= 0.0:
        weights = torch.ones_like(weights)
    weights = weights / weights.sum()

    stacked = torch.stack([output["probabilities_tensor"].squeeze(0) for output in active], dim=0)
    ensemble = (stacked * weights[:, None]).sum(dim=0)
    return ensemble, {output["name"]: round(float(weight), 6) for output, weight in zip(active, weights)}

def _positive_classes(probabilities):
    positives = []
    for index, class_name in enumerate(SELECTED_CLASSES):
        threshold = CLASS_THRESHOLDS[class_name]
        probability = float(probabilities[index])
        if probability >= threshold:
            positives.append({
                "class": class_name,
                "label": DISPLAY_CLASSES[index],
                "probability": round(probability, 6),
                "threshold": round(threshold, 6),
            })
    return positives

# ------------------------------------------------
# PREDICTION
# ------------------------------------------------
def predict_image(image_bytes):

    start = time.time()
    img_tensor, channels, metadata, preprocess_debug = preprocess_image_bytes(image_bytes)
    preview = create_preview_from_channels(channels)
    active_models = [
        ("DeepLabV3", model1),
        ("ResNet50", model2),
        ("EfficientNet", model3),
    ]
    active_models = [(name, model) for name, model in active_models if model is not None]

    # Check if models are loaded
    if not active_models:
        return {
            "error": "Models not loaded. Please download models from Google Drive and place in backend/models/",
            "ensemble": {c: 0.0 for c in SELECTED_CLASSES},
            "preview": base64.b64encode(io.BytesIO()).getvalue().decode(),
            "time": 0.0,
            "metadata": {"width": 0, "height": 0, "format": "ERROR"}
        }

    with torch.no_grad():

        model_outputs = [
            _model_prediction(name, model, img_tensor)
            for name, model in active_models
        ]
        ensemble, normalized_weights = _weighted_average(model_outputs)

    ensemble_result = probs_to_dict(ensemble)
    ensemble_np = ensemble.detach().cpu().numpy()
    predicted_index = int(ensemble_np.argmax())
    sorted_indices = np.argsort(ensemble_np)[::-1]
    margin = float(ensemble_np[sorted_indices[0]] - ensemble_np[sorted_indices[1]]) if len(sorted_indices) > 1 else 0.0
    positive_classes = _positive_classes(ensemble_np)
    confidence_status = "high" if float(ensemble_np[predicted_index]) >= 0.5 and margin >= 0.1 else "low"

    logger.info(
        "Per-model predictions: %s | ensemble=%s top=%s confidence=%.4f margin=%.4f",
        {
            output["name"]: {
                "predicted_class": output["predicted_class"],
                "confidence": output["confidence"],
                "probabilities": output["probabilities"],
            }
            for output in model_outputs
        },
        ensemble_result,
        SELECTED_CLASSES[predicted_index],
        float(ensemble_np[predicted_index]),
        margin,
    )

    buffer = io.BytesIO()
    preview.save(buffer,format="PNG")

    preview_base64 = base64.b64encode(buffer.getvalue()).decode()
    end = time.time()
    time_taken = round(end - start, 3)

    metadata = {
        **metadata,
        "preview_width": preview.width,
        "preview_height": preview.height,
    }
    return {
        "ensemble": ensemble_result,
        "prediction": SELECTED_CLASSES[predicted_index],
        "prediction_label": DISPLAY_CLASSES[predicted_index],
        "confidence": round(float(ensemble_np[predicted_index]), 6),
        "margin": round(margin, 6),
        "confidence_status": confidence_status,
        "positive_classes": positive_classes,
        "class_thresholds": CLASS_THRESHOLDS,
        "class_labels": dict(zip(SELECTED_CLASSES, DISPLAY_CLASSES)),
        "per_model": [
            {
                "name": output["name"],
                "predicted_class": output["predicted_class"],
                "predicted_label": output["predicted_label"],
                "confidence": output["confidence"],
                "probabilities": output["probabilities"],
            }
            for output in model_outputs
        ],
        "ensemble_weights": normalized_weights,
        "debug": preprocess_debug,
        "loaded_models": [name for name, _ in active_models],
        "preview": preview_base64,
        "time": time_taken,
        "metadata": metadata
    }
