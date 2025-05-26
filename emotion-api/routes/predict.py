import cv2
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
import numpy as np
from io import BytesIO
from PIL import Image
from tensorflow.keras.models import load_model

router = APIRouter()

#use: resnet50_fermixed2_68.h5 model
model = load_model("model/resnet50_fermixed2_68.h5")
emotion_labels = ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise']

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

class ImageData(BaseModel):
    image: str  # base64 encoded

@router.post("/predict-emotion")
def predict_emotion(data: ImageData):
    try:
        image_data = base64.b64decode(data.image.split(',')[1])
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            return {"message": "No face detected. Please face the camera."}
            #raise HTTPException(status_code=400, detail="No face detected in the image")

        x, y, w, h = faces[0]  # Assuming only one face for now
        face_roi = gray[y:y + h, x:x + w]
        resized_face = Image.fromarray(face_roi).resize((48, 48))
        face_array = np.array(resized_face) / 255.0
        face_array = np.expand_dims(face_array, axis=0)
        face_array = np.expand_dims(face_array, axis=-1)

        predictions = model.predict(face_array)
        predicted_emotion = emotion_labels[np.argmax(predictions)]
        return {"emotion": predicted_emotion}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))