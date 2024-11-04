import cv2
import numpy as np
from datetime import datetime
import time
import json

# Load the calibration results
calibration_data = np.load('camera_calibration.npz')
mtx = calibration_data['mtx']  # Camera matrix
dist = calibration_data['dist']  # Distortion coefficients

# Open two webcams (adjust the indices if needed)
cap1 = cv2.VideoCapture(1)
cap2 = cv2.VideoCapture(2)

# Set the resolution (width x height)
desired_width = 1920  # Example: 1920 for Full HD
desired_height = 1080  # Example: 1080 for Full HD
cap1.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)
cap2.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)

# Measure actual FPS of the cameras
fps1 = cap1.get(cv2.CAP_PROP_FPS)
fps2 = cap2.get(cv2.CAP_PROP_FPS)
print(f"Camera 1 FPS: {fps1}")
print(f"Camera 2 FPS: {fps2}")

# Define the codec and create VideoWriter objects (initially None)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out1 = None
out2 = None
recording = False  # Flag to check if recording is on
timestamps1 = []  # List to store timestamps for each frame from camera 1
timestamps2 = []  # List to store timestamps for each frame from camera 2

# Check if both webcams are opened successfully
if not cap1.isOpened() or not cap2.isOpened():
    print("Error: Could not open both webcams.")
    exit()

print("Press 'r' to start/stop recording and 'q' to quit.")

while True:
    # Capture frame-by-frame from both webcams
    ret1, frame1 = cap1.read()
    ret2, frame2 = cap2.read()

    if not ret1 or not ret2:
        print("Error: Failed to capture frames.")
        break

    # Undistort the frames using the camera matrix and distortion coefficients
    undistorted_frame1 = cv2.undistort(frame1, mtx, dist)
    undistorted_frame2 = cv2.undistort(frame2, mtx, dist)

    # Display the original and undistorted frames for both cameras
    # cv2.imshow('Camera 1 Original', frame1)
    cv2.imshow('Camera 1 Undistorted', undistorted_frame1)
    # cv2.imshow('Camera 2 Original', frame2)
    cv2.imshow('Camera 2 Undistorted', undistorted_frame2)

    # Check for key press
    key = cv2.waitKey(1) & 0xFF

    if key == ord('r'):  # 'r' to start/stop recording
        if recording:
            print("Stopped recording.")
            recording = False
            if out1:
                out1.release()  # Stop writing to file for camera 1
                out1 = None
            if out2:
                out2.release()  # Stop writing to file for camera 2
                out2 = None
            # Save timestamps to JSON files after recording
            with open('timestamps_cam1.json', 'w') as f1, open('timestamps_cam2.json', 'w') as f2:
                json.dump(timestamps1, f1)
                json.dump(timestamps2, f2)
            # Reset timestamps for the next session
            timestamps1 = []
            timestamps2 = []
        else:
            print("Started recording.")
            recording = True
            # Initialize VideoWriter to start recording for both cameras
            out1 = cv2.VideoWriter('output_cam1.mp4', fourcc, fps1, (frame1.shape[1], frame1.shape[0]))
            out2 = cv2.VideoWriter('output_cam2.mp4', fourcc, fps2, (frame2.shape[1], frame2.shape[0]))
            # Reset timestamps when recording starts
            timestamps1 = []
            timestamps2 = []

    if recording:
        # Write the undistorted frames to the output files
        if out1:
            out1.write(undistorted_frame1)
            # Append the current timestamp for each frame from camera 1
            timestamps1.append(datetime.now().isoformat())
        if out2:
            out2.write(undistorted_frame2)
            # Append the current timestamp for each frame from camera 2
            timestamps2.append(datetime.now().isoformat())

    if key == ord('q'):  # 'q' to quit the program
        break

# Release everything after recording is finished
cap1.release()
cap2.release()
if out1:
    out1.release()
if out2:
    out2.release()
cv2.destroyAllWindows()

# If still recording, save any remaining timestamps
if timestamps1:
    with open('timestamps_cam1.json', 'w') as f1:
        json.dump(timestamps1, f1)
if timestamps2:
    with open('timestamps_cam2.json', 'w') as f2:
        json.dump(timestamps2, f2)
