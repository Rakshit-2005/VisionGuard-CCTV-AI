import warnings
warnings.filterwarnings("ignore")
import os
import glob
import random
import time
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
import cv2
from ultralytics import YOLO

image_path = 'img1.png'
model_path = 'model.pt'

if os.path.exists(image_path) and os.path.exists(model_path):
    model = YOLO(model_path)
   
    CLASSES = list(model.names.values())
   
    results = model.predict(
        source=image_path,
        conf=0.25,
        iou=0.45,
        imgsz=640,
        device='cpu',
        save=True,
        project='.',
        name='.',
        exist_ok=True,
        verbose=False
    )
   
    for r in results:
        num_detections = len(r.boxes)
        print(f'Total detections: {num_detections}\n')
       
        if num_detections > 0:
            print('Detected objects:')
            detections_by_class = {}
            for box in r.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                cls_name = CLASSES[cls_id]
               
                if cls_name not in detections_by_class:
                    detections_by_class[cls_name] = []
                detections_by_class[cls_name].append(conf)
           
            for cls_name, confs in detections_by_class.items():
                avg_conf = np.mean(confs)
                print(f'  • {cls_name}: {len(confs)} (avg confidence: {avg_conf:.2%})')
        else:
            print('No objects detected')
   
    print('\n' + '='*70)
    print('Detection Result:')
    print('='*70)
   
    result_img_path = 'construction-safety.jpg'
    if os.path.exists(result_img_path):
        result_img = Image.open(result_img_path)
       
        plt.figure(figsize=(15, 10))
        plt.imshow(result_img)
        plt.axis('off')
        plt.title(f'PPE Detection Results - {num_detections} Objects Detected',
                 fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.show()
    else:
        annotated_frame = results[0].plot()
        annotated_frame_rgb = cv2.cvtColor(annotated_frame, cv2.COLOR_BGR2RGB)
       
        plt.figure(figsize=(15, 10))
        plt.imshow(annotated_frame_rgb)
        plt.axis('off')
        plt.title(f'PPE Detection Results - {num_detections} Objects Detected',
                 fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.show()
       
else:
    if not os.path.exists(image_path):
        print(f'❌ Image not found: {image_path}')
    if not os.path.exists(model_path):
        print(f'❌ Model not found: {model_path}')