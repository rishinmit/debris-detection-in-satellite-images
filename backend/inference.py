import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import io
import base64
from torchvision import transforms, models
import time

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

SELECTED_CLASSES = [
    "marine_debris",
    "sargassum",
    "turbid_water",
    "organic",
    "cloud"
]

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


print("Loading models...")

model1 = load_model1()
model2 = load_model2()
model3 = load_model3()

print("Models ready!")

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

    probs = probs.cpu().numpy()[0]

    result = {}

    for i,c in enumerate(SELECTED_CLASSES):

        result[c] = float(probs[i])

    return result

# ------------------------------------------------
# PREDICTION
# ------------------------------------------------
def predict_image(image_bytes):

    import rasterio
    start = time.time()
    with rasterio.open(io.BytesIO(image_bytes)) as src:

        band_count = src.count

        if band_count >= 7:
            bands = src.read([1,2,3,4,5,6,7]).astype(np.float32)

        elif band_count >= 3:
            bands = src.read([1,2,3]).astype(np.float32)

            extra = np.zeros((4,bands.shape[1],bands.shape[2]),dtype=np.float32)
            bands = np.concatenate([bands,extra],axis=0)

        else:
            bands = src.read(1).astype(np.float32)
            bands = np.expand_dims(bands,axis=0)

            extra = np.zeros((6,bands.shape[1],bands.shape[2]),dtype=np.float32)
            bands = np.concatenate([bands,extra],axis=0)

        bands = np.nan_to_num(bands)

        if bands.max() > 1:
            bands /= 10000.0

        img_tensor = torch.tensor(bands).unsqueeze(0).to(device)

        # RGB preview
        r = bands[min(3,bands.shape[0]-1)]
        g = bands[min(2,bands.shape[0]-1)]
        b = bands[min(1,bands.shape[0]-1)]

        rgb = np.stack([r,g,b],axis=-1)

        p2,p98 = np.percentile(rgb,(2,98))
        rgb = np.clip((rgb-p2)/(p98-p2+1e-6),0,1)

        rgb = (rgb*255).astype(np.uint8)

        preview = Image.fromarray(rgb)

    with torch.no_grad():

        out1 = torch.sigmoid(model1(img_tensor))
        out2 = torch.sigmoid(model2(img_tensor))
        out3 = torch.sigmoid(model3(img_tensor))

        ensemble = (out1 + out2 + out3)/3

    ensemble_result = probs_to_dict(ensemble)

    buffer = io.BytesIO()
    preview.save(buffer,format="PNG")

    preview_base64 = base64.b64encode(buffer.getvalue()).decode()
    end = time.time()
    time_taken = round(end - start, 3)

    metadata = {
    "width": preview.width,
    "height": preview.height,
    "format": "TIFF"
    }
    return {
        "ensemble": ensemble_result,
        "preview": preview_base64,
        "time": time_taken,
        "metadata": metadata
    }