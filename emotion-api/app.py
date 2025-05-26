from fastapi import FastAPI
from routes import predict
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Include emotion prediction route
app.include_router(predict.router)

@app.get("/")
def read_root():
    return {"message": "Emotion Recognition API is running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002"],  # or your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)