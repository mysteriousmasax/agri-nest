Jicho — Crop Health AI (Module)

Purpose
Jicho provides photo-based crop disease detection, severity estimation, and treatment recommendations tailored to East African smallholders.

Key components
- On-device inference with TensorFlow Lite for offline use
- Cloud retraining pipeline (weekly) with active learning from farmer feedback
- Human-in-the-loop review queue for low-confidence (<70%) cases

Data contracts
- Image payload: base64 JPEG, gps:{lat,long}, farmer_id, timestamp, field_id (optional)
- Response: diagnosis, confidence, recommended_treatment, severity_estimate

API endpoints (examples)
- `POST /jicho/scan` — submit image for diagnosis
- `GET /jicho/history?farmer_id=` — scan history

Retraining notes
- Store labelled images in `ai/datasets/jicho/` with provenance
- Weekly batch retrain using latest verified labels; produce versioned model artifacts
