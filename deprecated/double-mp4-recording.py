import cv2
import numpy as np
from datetime import datetime
import json

# Load the calibration parameters
with np.load('camera_calibration.npz') as data:
    mtx0 = data['mtx']
    dist0 = data['dist']

# Open two webcams
cap1 = cv2.VideoCapture(0)
cap2 = cv2.VideoCapture(1)

# Set resolution
desired_width = 
desired_height = 1080
cap1.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)
cap2.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)

# Measure actual FPS
fps1 = cap1.get(cv2.CAP_PROP_FPS)
fps2 = cap2.get(cv2.CAP_PROP_FPS)
print(f"Camera 1 FPS: {fps1}")
print(f"Camera 2 FPS: {fps2}")

# VideoWriter setup
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out1 = None
out2 = None
recording = False
timestamps1 = []
timestamps2 = []

# Check if cameras opened successfully
if not cap1.isOpened() or not cap2.isOpened():
    print("Error: Could not open both webcams.")
    exit()

print("Press 'r' to start/stop recording and 'q' to quit.")

while True:
    ret1, frame1 = cap1.read()
    ret2, frame2 = cap2.read()

    if not ret1 or not ret2:
        print("Error: Failed to capture frames.")
        break

    # Crop each frame by 20% on each side
    h, w = frame1.shape[:2]
    crop_x = int(w * 0.2)
    crop_y = int(h * 0.2)
    
    cropped_frame1 = frame1[crop_y:h - crop_y, crop_x:w - crop_x]
    cropped_frame2 = frame2[crop_y:h - crop_y, crop_x:w - crop_x]

    # Undistort the cropped frames
    undistorted_frame1 = cv2.undistort(cropped_frame1, mtx0, dist0)
    undistorted_frame2 = cv2.undistort(cropped_frame2, mtx0, dist0)

    # Display frames
    cv2.imshow('Camera 1 Undistorted', undistorted_frame1)
    cv2.imshow('Camera 2 Undistorted', undistorted_frame2)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('r'):
        if recording:
            print("Stopped recording.")
            recording = False
            if out1:
                out1.release()
                out1 = None
            if out2:
                out2.release()
                out2 = None
            with open('timestamps_cam1.json', 'w') as f1, open('timestamps_cam2.json', 'w') as f2:
                json.dump(timestamps1, f1)
                json.dump(timestamps2, f2)
            timestamps1 = []
            timestamps2 = []
        else:
            print("Started recording.")
            recording = True
            out1 = cv2.VideoWriter('output_cam1.mp4', fourcc, fps1, (undistorted_frame1.shape[1], undistorted_frame1.shape[0]))
            out2 = cv2.VideoWriter('output_cam2.mp4', fourcc, fps2, (undistorted_frame2.shape[1], undistorted_frame2.shape[0]))
            timestamps1 = []
            timestamps2 = []

    if recording:
        if out1:
            out1.write(undistorted_frame1)
            timestamps1.append(datetime.now().isoformat())
        if out2:
            out2.write(undistorted_frame2)
            timestamps2.append(datetime.now().isoformat())

    if key == ord('q'):
        break

# Release resources
cap1.release()
cap2.release()
if out1:
    out1.release()
if out2:
    out2.release()
cv2.destroyAllWindows()

if timestamps1:
    with open('timestamps_cam1.json', 'w') as f1:
        json.dump(timestamps1, f1)
if timestamps2:
    with open('timestamps_cam2.json', 'w') as f2:
        json.dump(timestamps2, f2)


