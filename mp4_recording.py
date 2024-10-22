import cv2
import numpy as np
from datetime import datetime
import time
import json

# Load the calibration results
calibration_data = np.load('camera_calibration.npz')
mtx = calibration_data['mtx']  # Camera matrix
dist = calibration_data['dist']  # Distortion coefficients

# Open the webcam
cap = cv2.VideoCapture(0)

# Set the resolution (width x height)
desired_width = 1920  # Example: 1920 for Full HD
desired_height = 1080  # Example: 1080 for Full HD
cap.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)

# Measure actual FPS of the camera
fps = cap.get(cv2.CAP_PROP_FPS)
print(f"Camera FPS: {fps}")

# Define the codec and create a VideoWriter object (initially None)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = None
recording = False  # Flag to check if recording is on
timestamps = []  # List to store timestamps for each frame

# Check if the webcam is opened successfully
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

print("Press 'r' to start/stop recording and 'q' to quit.")

while True:
    # Capture frame-by-frame from the webcam
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture frame.")
        break

    # Undistort the frame using the camera matrix and distortion coefficients
    undistorted_frame = cv2.undistort(frame, mtx, dist)

    # Display the original and undistorted frames
    cv2.imshow('Original Frame', frame)
    cv2.imshow('Undistorted Frame', undistorted_frame)

    # Check for key press
    key = cv2.waitKey(1) & 0xFF

    if key == ord('r'):  # 'r' to start/stop recording
        if recording:
            print("Stopped recording.")
            recording = False
            out.release()  # Stop writing to the file
            out = None  # Reset the VideoWriter
            # Save timestamps to a JSON file after recording
            with open('timestamps.json', 'w') as f:
                json.dump(timestamps, f)
            timestamps = []  # Reset timestamps for the next session
        else:
            print("Started recording.")
            recording = True
            # Initialize VideoWriter to start recording
            out = cv2.VideoWriter('output.mp4', fourcc, fps, (frame.shape[1], frame.shape[0]))
            timestamps = []  # Reset timestamps when recording starts

    if recording and out is not None:
        # Write the undistorted frame to the output file
        out.write(undistorted_frame)
        # Append the current timestamp for each frame
        timestamps.append(datetime.now().isoformat())

    if key == ord('q'):  # 'q' to quit the program
        break

# Release everything after recording is finished
cap.release()
if out is not None:
    out.release()
cv2.destroyAllWindows()

# If still recording, save any remaining timestamps
if timestamps:
    with open('timestamps.json', 'w') as f:
        json.dump(timestamps, f)
