# from fastapi import FastAPI, HTTPException
# from fastapi.responses import StreamingResponse
# from fastapi.middleware.cors import CORSMiddleware

# import cv2
# import uuid
# import torch
# import threading
# import time
# import queue
# import numpy as np

# from ultralytics import YOLO

# # ===================== APP =====================
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ===================== GLOBAL STATE =====================
# cameras = {}  # camera info
# camera_runtime = {}  # runtime state per camera
# # camera_runtime[camera_id] = {
# #     "frame_queue": queue.Queue(maxsize=1),
# #     "detections": None,
# #     "running": True
# # }

# # ===================== YOLO SETUP =====================
# DEVICE = 0 if torch.cuda.is_available() else "cpu"
# MODEL = YOLO("model/model.pt")  # Use a small model for faster inference if needed

# CONF = 0.5
# IOU = 0.6
# IMGSZ = 320
# INFERENCE_INTERVAL = 0.05  # 20 FPS max per camera

# print(f"YOLO loaded on device: {DEVICE}")

# # ===================== CAMERA CAPTURE =====================
# def capture_loop(camera_id: str, rtsp: str):
#     """Continuously capture frames and push latest frame to queue."""
#     cap = cv2.VideoCapture(rtsp)
#     if not cap.isOpened():
#         camera_runtime[camera_id]["running"] = False
#         print(f"Failed to open camera {camera_id}")
#         return

#     frame_queue = camera_runtime[camera_id]["frame_queue"]

#     while camera_runtime[camera_id]["running"]:
#         ret, frame = cap.read()
#         if not ret:
#             time.sleep(0.01)
#             continue
#         # Keep only latest frame in queue
#         if not frame_queue.empty():
#             try:
#                 frame_queue.get_nowait()
#             except queue.Empty:
#                 pass
#         frame_queue.put(frame)
#     cap.release()
#     print(f"Camera {camera_id} stopped capture.")

# # ===================== CAMERA INFERENCE =====================
# def inference_loop(camera_id: str):
#     """Run YOLO on latest frames of a single camera."""
#     state = camera_runtime[camera_id]
#     while state["running"]:
#         frame = None
#         try:
#             frame = state["frame_queue"].get(timeout=1)
#         except queue.Empty:
#             time.sleep(0.01)
#             continue

#         results = MODEL.predict(
#             source=frame,
#             conf=CONF,
#             iou=IOU,
#             imgsz=IMGSZ,
#             device=DEVICE,
#             verbose=False,
#             half=True if DEVICE != "cpu" else False
#         )

#         state["detections"] = results[0]  # latest detection
#         time.sleep(INFERENCE_INTERVAL)

# # ===================== STREAM GENERATOR =====================
# def stream_generator(camera_id: str):
#     """Stream live frames with detections overlay."""
#     state = camera_runtime[camera_id]
#     while state["running"]:
#         frame = None
#         try:
#             frame = state["frame_queue"].get(timeout=1)
#         except queue.Empty:
#             time.sleep(0.01)
#             continue

#         output = frame.copy()

#         detections = state["detections"]
#         if detections is not None:
#             output = detections.plot(img=output)

#         ok, jpeg = cv2.imencode(".jpg", output, [int(cv2.IMWRITE_JPEG_QUALITY), 60])
#         if not ok:
#             continue

#         yield (
#             b"--frame\r\n"
#             b"Content-Type: image/jpeg\r\n\r\n"
#             + jpeg.tobytes()
#             + b"\r\n"
#         )

# # ===================== API ENDPOINTS =====================
# @app.post("/cameras/test-connection")
# def test_connection(data: dict):
#     cap = cv2.VideoCapture(data["streamSource"])
#     ok = cap.isOpened()
#     cap.release()
#     return {"success": ok}

# @app.post("/cameras")
# def create_camera(cam: dict):
#     cam_id = str(uuid.uuid4())
#     cam["id"] = cam_id
#     cameras[cam_id] = cam

#     # Initialize runtime state
#     camera_runtime[cam_id] = {
#         "frame_queue": queue.Queue(maxsize=1),
#         "detections": None,
#         "running": True
#     }

#     # Start capture and inference threads
#     rtsp = cam["streamSource"]
#     threading.Thread(target=capture_loop, args=(cam_id, rtsp), daemon=True).start()
#     threading.Thread(target=inference_loop, args=(cam_id,), daemon=True).start()

#     return cam

# @app.get("/companies/{company_id}/cameras")
# def get_cameras(company_id: str):
#     return [c for c in cameras.values() if c.get("companyId") == company_id]

# @app.get("/stream/{camera_id}")
# def stream(camera_id: str):
#     if camera_id not in cameras:
#         raise HTTPException(status_code=404, detail="Camera not found")

#     return StreamingResponse(
#         stream_generator(camera_id),
#         media_type="multipart/x-mixed-replace; boundary=frame"
#     )

# @app.get("/test")
# def test():
#     return {"ok": True}
