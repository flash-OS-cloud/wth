from fastapi import FastAPI, File, UploadFile
import numpy as np
from PIL import Image
import tensorflow as tf
import io

app = FastAPI()

# load model once
model = tf.keras.models.load_model("wound_model.h5")

IMG_SIZE = (224, 224)

# helper: split into 9 grids
def split_image(img):
    w, h = img.size
    grids = []
    
    for i in range(3):
        for j in range(3):
            left = j * w // 3
            top = i * h // 3
            right = (j + 1) * w // 3
            bottom = (i + 1) * h // 3
            
            grids.append(img.crop((left, top, right, bottom)))
    
    return grids

def preprocess(img):
    img = img.resize(IMG_SIZE)
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    
    grids = split_image(img)
    
    scores = []
    
    for g in grids:
        input_img = preprocess(g)
        pred = model.predict(input_img)[0][0]
        scores.append(float(pred))
    
    # sort grid indices by score
    sorted_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    
    return {
        "scores": scores,
        "priority_order": sorted_indices
    }