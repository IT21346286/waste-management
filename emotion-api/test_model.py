from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

model = load_model("resnet50_tt_fermod_68.h5")
#model = load_model("model/emotion_detection_model.h5")

img = Image.open("test.jpg").convert('L').resize((48, 48))  # replace with real test image path
img_np = np.array(img) / 255.0
img_np = np.expand_dims(img_np, axis=0)
img_np = np.expand_dims(img_np, axis=-1)

prediction = model.predict(img_np)
print("Prediction:", prediction)
