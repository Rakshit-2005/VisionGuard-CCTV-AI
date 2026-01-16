import warnings
warnings.filterwarnings("ignore")
import cv2
import torch
from ultralytics import YOLO

MODEL_PATH = "model.pt"
STREAM_SOURCE = 0

CONF = 0.25
IOU = 0.45
IMGSZ = 640
FRAME_SKIP = 2

device = 0 if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

model = YOLO(MODEL_PATH)

cap = cv2.VideoCapture(STREAM_SOURCE)
if not cap.isOpened():
    raise RuntimeError("Failed to open video stream")

frame_id = 0

print("🎥 Stream started. Press Q to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_id += 1
    if frame_id % FRAME_SKIP != 0:
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

    cv2.imshow("Live Detection", annotated)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("❌ Stream stopped")
