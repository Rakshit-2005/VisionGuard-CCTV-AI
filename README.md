# Safety-AI-Detection

Safety-AI-Detection is a real-time workplace safety monitoring system that combines a React dashboard, a FastAPI backend, and a YOLO-based model for PPE and safety-violation detection. It supports both live CCTV (RTSP) streams and offline image/video analysis.

## Key Features

- Real-time CCTV monitoring via RTSP with live detection overlays.
- Image and video inference endpoints for offline audits and training.
- Dashboard for KPIs, employees, violations, and analytics.
- Reports and summaries for compliance tracking.
- MongoDB-backed data storage.

## Screenshots

![Sidebar navigation](images/Screenshot%202026-05-20%20235226.png)
![Image model results](images/Screenshot%202026-05-20%20235236.png)
![CCTV stream overlay](images/Screenshot%202026-01-17%20165657.png)
![CCTV stream modal](images/Screenshot%202026-01-17%20165715.png)

## Tech Stack

- Frontend: React (Vite) + Tailwind
- Backend: FastAPI
- Database: MongoDB
- ML: Ultralytics YOLO
- Streaming: MediaMTX (RTSP) + ffmpeg

## Project Structure

```
backend/
	app/                # FastAPI app, routes, DB, models
	apis/               # Legacy API prototype (not used)
	model/              # ML notebooks, weights, inference scripts
frontend/
	src/                # React app
```

## Requirements

- Python 3.10+ (use the backend .venv if present)
- Node.js 18+
- MongoDB (local or cloud)
- ffmpeg
- MediaMTX (for RTSP streaming)

## Environment Variables

Create a backend `.env` file if you do not already have one:

```
MONGODB_URI=mongodb://localhost:27017
```

## Installation

### Backend

```
cd backend
.
.venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```
cd frontend
npm install
```

## Running the App

### Backend

```
cd backend
set MONGODB_URI=mongodb://localhost:27017
python -m uvicorn app.main:app --reload
```

Backend runs at:
```
http://127.0.0.1:8000
```

### Frontend

```
cd frontend
npm run dev
```

Frontend runs at:
```
http://localhost:8080
```

## RTSP CCTV Setup (Windows)

This project uses RTSP to ingest live CCTV feeds. The example below publishes your local webcam to a local RTSP server.

### 1) Start MediaMTX

```
C:\mediamtx\mediamtx.exe
```

### 2) Publish Webcam to RTSP

```
ffmpeg -f dshow -rtbufsize 100M -i video="Chicony USB2.0 Camera" ^
	-c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p ^
	-s 640x480 -r 15 -b:v 1M -f rtsp rtsp://127.0.0.1:8554/webcam
```

### 3) Test the Stream

```
ffplay rtsp://127.0.0.1:8554/webcam
```

### 4) Use in App

Use this RTSP URL in CCTV Management:

```
rtsp://127.0.0.1:8554/webcam
```

## API Endpoints (Highlights)

- `POST /auth/login` - Company admin login
- `POST /company/register` - Register a company
- `POST /cameras/test-connection` - Verify RTSP stream
- `POST /cameras` - Add a camera stream
- `GET /stream/{camera_id}` - MJPEG stream with overlays
- `POST /ai/image-infer` - Image inference
- `POST /ai/video-player` - Video inference (returns annotated MP4)

## Notes

- The backend uses the YOLO model at `backend/model/model.pt`.
- For best RTSP performance, keep ffmpeg running and use a stable local network.

## Troubleshooting

- If login fails, make sure the company is approved in the `companies` collection.
- If RTSP fails, verify MediaMTX is running and the RTSP URL is reachable with `ffplay`.
- If MongoDB errors appear, confirm `MONGODB_URI` is correct and MongoDB is running.
