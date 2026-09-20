from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ScanRequest(BaseModel):
    farmer_id: str
    image_base64: str

@app.get('/')
def root():
    return {"message": "AGRI-NEST FastAPI stub"}

@app.post('/jicho/scan')
def jicho_scan(req: ScanRequest):
    import random
    diagnoses = ['Yellow Rust', 'Leaf Blight', 'Healthy', 'Bean Rust']
    choice = random.choice(diagnoses)
    confidence = round(0.5 + random.random() * 0.5, 2)
    return {"diagnosis": choice, "confidence": confidence}
