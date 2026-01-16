from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import cv2, uuid, time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
cameras = {}

@app.post("/cameras/test-connection")
def test_connection(data: dict):
    cap = cv2.VideoCapture(data["streamSource"])
    ok = cap.isOpened()
    cap.release()
    return {"success": ok, "latency": 50}

@app.post("/cameras")
def create_camera(cam: dict):
    cam["id"] = str(uuid.uuid4())
    cameras[cam["id"]] = cam
    return cam

@app.get("/companies/{company_id}/cameras")
def get_cameras(company_id: str):
    return [c for c in cameras.values() if c["companyId"] == company_id]

def stream_frames(rtsp):
    cap = cv2.VideoCapture(rtsp)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        _, jpeg = cv2.imencode(".jpg", frame)
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" +
            jpeg.tobytes() +
            b"\r\n"
        )

@app.get("/stream/{camera_id}")
def stream(camera_id: str):
    print(1)
    rtsp = cameras[camera_id]["streamSource"]
    return StreamingResponse(
        stream_frames(rtsp),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get('/test')
def test():
    print(1)
    return 1