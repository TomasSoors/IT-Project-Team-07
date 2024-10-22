import cv2
import numpy as np

# Load the calibration results
calibration_data = np.load('camera_calibration.npz')
mtx = calibration_data['mtx']  # Camera matrix
dist = calibration_data['dist']  # Distortion coefficients

# Start capturing video from the camera
cap = cv2.VideoCapture(0)  # Change the index if you have multiple cameras

# Set the resolution (width x height)
desired_width = 1920  # Example: 1920 for Full HD
desired_height = 1080  # Example: 1080 for Full HD
cap.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)

while True:
    # Read a frame from the video capture
    ret, frame = cap.read()
    
    if not ret:
        print("Failed to grab frame")
        break
    
    # Undistort the frame using the camera matrix and distortion coefficients
    undistorted_frame = cv2.undistort(frame, mtx, dist)

    # Get the original (distorted) frame's dimensions
    height, width = frame.shape[:2]
    
    # Overlay the distorted resolution on the undistorted frame (for visualization)
    resolution_text = f"Distorted: {width} x {height}"
    cv2.putText(undistorted_frame, resolution_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

    # Display the original and undistorted frames
    cv2.imshow('Original Frame', frame)
    cv2.imshow('Undistorted Frame', undistorted_frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close windows
cap.release()
cv2.destroyAllWindows()
