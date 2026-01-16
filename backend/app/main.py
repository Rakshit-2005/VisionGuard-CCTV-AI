# API Part

from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URI, DATABASE_NAME
from fastapi import FastAPI, HTTPException
from app.routes.auth import router as auth_router
from app.routes.company import router as company_router
from app.routes.employee import router as employee_router
from fastapi.responses import Response

app = FastAPI()

app.include_router(auth_router)
app.include_router(company_router)
app.include_router(employee_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Detections", "X-Summary", "X-Total-Detections"],
)
client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]

async def check_db_connection():
    try:
        await db.command("ping")
        return True
    except Exception as e:
        print("MongoDB connection error:", e)
        return False


# ML Model Part

import cv2
import uuid
import torch
import threading
import time
import queue
import numpy as np

from ultralytics import YOLO
from fastapi import APIRouter, UploadFile, File
import json

# ===================== APP =====================

# ===================== GLOBAL STATE =====================
cameras = {}  # camera info
camera_runtime = {}  # runtime state per camera
# camera_runtime[camera_id] = {
#     "frame_queue": queue.Queue(maxsize=1),
#     "detections": None,
#     "running": True
# }

# ===================== YOLO SETUP =====================
DEVICE = 0 if torch.cuda.is_available() else "cpu"
MODEL = YOLO("model/model.pt")  # Use a small model for faster inference if needed

router = APIRouter(prefix="/ai", tags=["AI"])

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
from ultralytics import YOLO
import json,av,io

@router.post("/video-player")
async def video_player(video: UploadFile = File(...)):
    video_bytes = await video.read()

    CONF = 0.25
    IOU = 0.45
    FRAME_SKIP = 5

    input_container = av.open(io.BytesIO(video_bytes))
    output_buffer = io.BytesIO()

    output_container = av.open(
        output_buffer,
        mode="w",
        format="mp4"
    )

    video_stream = output_container.add_stream("h264", rate=3)
    video_stream.pix_fmt = "yuv420p"

    frame_id = 0

    for frame in input_container.decode(video=0):
        frame_id += 1
        if frame_id % FRAME_SKIP != 0:
            continue

        img = frame.to_ndarray(format="bgr24")

        results = MODEL.predict(
            img,
            imgsz=256,
            conf=CONF,
            iou=IOU,
            verbose=False
        )

        annotated = results[0].plot()

        av_frame = av.VideoFrame.from_ndarray(
            cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB),
            format="rgb24"
        )

        for packet in video_stream.encode(av_frame):
            output_container.mux(packet)

    # Flush encoder
    for packet in video_stream.encode():
        output_container.mux(packet)

    output_container.close()

    return Response(
        content=output_buffer.getvalue(),
        media_type="video/mp4"
    )

@router.post("/image-infer")
async def image_infer(image: UploadFile = File(...)):
    img_bytes = await image.read()
    np_img = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    results = MODEL.predict(img, conf=0.25, iou=0.45, device="cpu", verbose=False)
    r = results[0]

    # 🔹 Extract detections
    detections = []
    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        label = MODEL.names[cls_id]

        detections.append({
            "label": label,
            "confidence": round(conf, 3)
        })

    annotated = r.plot()
    _, encoded = cv2.imencode(".jpg", annotated)
    
    detections_by_class = {}

    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        cls_name = MODEL.names[cls_id]

        detections_by_class.setdefault(cls_name, []).append(conf)

    summary = []
    for cls, confs in detections_by_class.items():
        summary.append({
            "class": cls,
            "count": len(confs),
            "avg_confidence": round(float(np.mean(confs)), 3)
        })
    # print(summary)
    return Response(
        content=encoded.tobytes(),
        media_type="image/jpeg",
        headers={
            "X-Detections": json.dumps(detections),
            "X-Summary": json.dumps(summary),
            "X-Total-Detections": str(len(r.boxes))
        }
    )

app.include_router(router)


CONF = 0.5
IOU = 0.6
IMGSZ = 320
INFERENCE_INTERVAL = 0.05  # 20 FPS max per camera

print(f"YOLO loaded on device: {DEVICE}")

# ===================== CAMERA CAPTURE =====================
def capture_loop(camera_id: str, rtsp: str):
    """Continuously capture frames and push latest frame to queue."""
    cap = cv2.VideoCapture(rtsp)
    if not cap.isOpened():
        camera_runtime[camera_id]["running"] = False
        print(f"Failed to open camera {camera_id}")
        return

    frame_queue = camera_runtime[camera_id]["frame_queue"]

    while camera_runtime[camera_id]["running"]:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.01)
            continue
        # Keep only latest frame in queue
        if not frame_queue.empty():
            try:
                frame_queue.get_nowait()
            except queue.Empty:
                pass
        frame_queue.put(frame)
    cap.release()
    print(f"Camera {camera_id} stopped capture.")

# ===================== CAMERA INFERENCE =====================
def inference_loop(camera_id: str):
    """Run YOLO on latest frames of a single camera."""
    state = camera_runtime[camera_id]
    while state["running"]:
        frame = None
        try:
            frame = state["frame_queue"].get(timeout=1)
        except queue.Empty:
            time.sleep(0.01)
            continue

        results = MODEL.predict(
            source=frame,
            conf=CONF,
            iou=IOU,
            imgsz=IMGSZ,
            device=DEVICE,
            verbose=False,
            half=True if DEVICE != "cpu" else False
        )

        state["detections"] = results[0]  # latest detection
        time.sleep(INFERENCE_INTERVAL)

# ===================== STREAM GENERATOR =====================
def stream_generator(camera_id: str):
    """Stream live frames with detections overlay."""
    state = camera_runtime[camera_id]
    while state["running"]:
        frame = None
        try:
            frame = state["frame_queue"].get(timeout=1)
        except queue.Empty:
            time.sleep(0.01)
            continue

        output = frame.copy()

        detections = state["detections"]
        if detections is not None:
            output = detections.plot(img=output)

        ok, jpeg = cv2.imencode(".jpg", output, [int(cv2.IMWRITE_JPEG_QUALITY), 60])
        if not ok:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + jpeg.tobytes()
            + b"\r\n"
        )

# ===================== API ENDPOINTS =====================
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

    # Initialize runtime state
    camera_runtime[cam_id] = {
        "frame_queue": queue.Queue(maxsize=1),
        "detections": None,
        "running": True
    }

    # Start capture and inference threads
    rtsp = cam["streamSource"]
    threading.Thread(target=capture_loop, args=(cam_id, rtsp), daemon=True).start()
    threading.Thread(target=inference_loop, args=(cam_id,), daemon=True).start()

    return cam

@app.get("/companies/{company_id}/cameras")
def get_cameras(company_id: str):
    return [c for c in cameras.values() if c.get("companyId") == company_id]

@app.get("/stream/{camera_id}")
def stream(camera_id: str):
    if camera_id not in cameras:
        raise HTTPException(status_code=404, detail="Camera not found")

    return StreamingResponse(
        stream_generator(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/test")
def test():
    return {"ok": True}
