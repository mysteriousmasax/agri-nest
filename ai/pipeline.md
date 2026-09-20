AI Pipeline — Jicho & related models

Overview
The ML pipeline supports device inference (TFLite), cloud retraining, and an active learning loop with human-in-the-loop verification.

Components
- Inference: TFLite models embedded in mobile app for offline diagnosis
- Ingestion: cloud endpoint collects labelled images and farmer feedback
- Active learning: low-confidence or farmer-disagreed cases flagged into reviewer queue
- Retraining: weekly batch jobs produce versioned model artifacts and evaluation metrics

Data storage
- Store images in object storage (`ai/datasets/jicho/`) with metadata (label, farmer_id, gps, timestamp, verifier_id)

Monitoring
- Track accuracy per crop and per region; alert if accuracy drops >5% after a retrain
