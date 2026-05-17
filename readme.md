Steps to run backend, if encountered errors:
run these commands in terminal of project root, dont go inside frontend or backend folder

python3 -m venv venv

source venv/bin/activate

pip install fastapi uvicorn torch torchvision pillow numpy python-multipart rasterio

uvicorn backend.main:app --reload
[07/03/26, 8:06:44 PM] Rishi: pip install python-multipart
