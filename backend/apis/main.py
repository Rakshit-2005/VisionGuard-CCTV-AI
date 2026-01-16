from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import uuid
import torch
import threading
import time
from ultralytics import YOLO

# ===================== APP =====================
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== GLOBAL =====================
cameras = {}

device = 0 if torch.cuda.is_available() else "cpu"
model = YOLO("model/model.pt")

CONF = 0.25
IOU = 0.45
IMGSZ = 640

print(f"YOLO loaded on device: {device}")

# ================= CAMERA RUNTIME =================
camera_runtime = {}
# camera_id -> {
#   "frame": np.ndarray,
#   "annotated": np.ndarray,
#   "lock": threading.Lock(),
#   "running": bool
# }

# ================= ENDPOINTS =====================

@app.post("/cameras/test-connection")
def test_connection(data: dict):
    cap = cv2.VideoCapture(data["streamSource"])
    ok = cap.isOpened()
    cap.release()
    return {"success": ok}


@app.post("/cameras")
def create_camera(cam: dict):
    cam_id = str(uuid.uuid4())
    cam["id"] = cam_id
    cameras[cam_id] = cam
    return cam


@app.get("/companies/{company_id}/cameras")
def get_cameras(company_id: str):
    return [c for c in cameras.values() if c.get("companyId") == company_id]


# ================= THREADS =====================

def capture_loop(camera_id: str, rtsp: str):
    cap = cv2.VideoCapture(rtsp)

    if not cap.isOpened():
        camera_runtime[camera_id]["running"] = False
        return

    while camera_runtime[camera_id]["running"]:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.02)
            continue

        with camera_runtime[camera_id]["lock"]:
            camera_runtime[camera_id]["frame"] = frame

    cap.release()


def inference_loop(camera_id: str):
    """
    Runs YOLO whenever it can.
    Video keeps flowing regardless.
    """
    while camera_runtime[camera_id]["running"]:
        with camera_runtime[camera_id]["lock"]:
            frame = camera_runtime[camera_id]["frame"]

        if frame is None:
            time.sleep(0.05)
            continue

        results = model.predict(
            source=frame,
            conf=CONF,
            iou=IOU,
            imgsz=IMGSZ,
            device=device,
            verbose=False
        )

        annotated = results[0].plot()

        with camera_runtime[camera_id]["lock"]:
            camera_runtime[camera_id]["annotated"] = annotated

        # OPTIONAL: throttle inference (e.g. every 5 seconds)
        time.sleep(5)


def stream_generator(camera_id: str):
    """
    ALWAYS yields frames.
    Never blocks.
    """
    while camera_runtime[camera_id]["running"]:
        with camera_runtime[camera_id]["lock"]:
            frame = (
                camera_runtime[camera_id]["annotated"]
                if camera_runtime[camera_id]["annotated"] is not None
                else camera_runtime[camera_id]["frame"]
            )

        if frame is None:
            time.sleep(0.01)
            continue

        ok, jpeg = cv2.imencode(
            ".jpg",
            frame,
            [int(cv2.IMWRITE_JPEG_QUALITY), 80]
        )
        if not ok:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + jpeg.tobytes()
            + b"\r\n"
        )


# ================= STREAM =====================

@app.get("/stream/{camera_id}")
def stream(camera_id: str):
    if camera_id not in cameras:
        raise HTTPException(status_code=404, detail="Camera not found")

    if camera_id not in camera_runtime:
        camera_runtime[camera_id] = {
            "frame": None,
            "annotated": None,
            "lock": threading.Lock(),
            "running": True
        }

        rtsp = cameras[camera_id]["streamSource"]

        threading.Thread(
            target=capture_loop,
            args=(camera_id, rtsp),
            daemon=True
        ).start()

        threading.Thread(
            target=inference_loop,
            args=(camera_id,),
            daemon=True
        ).start()

    return StreamingResponse(
        stream_generator(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/test")
def test():
    return {"ok": True}
