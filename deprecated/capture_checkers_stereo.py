import cv2
import os
import datetime

def capture_checkerboard_images(camera_index_left=0, camera_index_right=1, 
                                save_dir="checkerboard_images", resolution=(1920, 1080)):
    # Create directories to save images for each camera if they don't exist
    left_dir = os.path.join(save_dir, "left")
    right_dir = os.path.join(save_dir, "right")
    os.makedirs(left_dir, exist_ok=True)
    os.makedirs(right_dir, exist_ok=True)
    # Open both cameras
    cap_left = cv2.VideoCapture(camera_index_left)
    cap_right = cv2.VideoCapture(camera_index_right)

    if not cap_left.isOpened() or not cap_right.isOpened():
        print("Error: Could not open one or both webcams.")
        return

    # Set camera resolution
    width, height = resolution
    cap_left.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    cap_left.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    cap_right.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    cap_right.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

    print(f"Camera resolution set to: {width} x {height}")
    print("Press 'c' to capture an image and 'q' to quit.")

    while True:
        # Capture frames from both cameras
        ret_left, frame_left = cap_left.read()
        ret_right, frame_right = cap_right.read()

        # Check if frames are valid and have the same dimensions
        if not ret_left or frame_left is None:
            print("Error: Could not read frame from left camera.")
            continue
        if not ret_right or frame_right is None:
            print("Error: Could not read frame from right camera.")
            continue
        if frame_left.shape != frame_right.shape or frame_left.dtype != frame_right.dtype:
            print("Error: Frames from both cameras have different shapes or data types.")
            continue

        # Display the frames side by side
        combined_frame = cv2.hconcat([frame_left, frame_right])
        cv2.imshow('Stereo Camera Feed', combined_frame)

        key = cv2.waitKey(1) & 0xFF

        # Capture images on pressing 'c'
        if key == ord('c'):
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            left_image_path = os.path.join(left_dir, f"left_{timestamp}.jpg")
            right_image_path = os.path.join(right_dir, f"right_{timestamp}.jpg")

            # Save images
            cv2.imwrite(left_image_path, frame_left)
            cv2.imwrite(right_image_path, frame_right)

            print(f"Images saved: {left_image_path} and {right_image_path}")

        # Quit the loop on pressing 'q'
        elif key == ord('q'):
            print("Exiting...")
            break

    # Release the cameras and close windows
    cap_left.release()
    cap_right.release()
    cv2.destroyAllWindows()

# Run the function to capture stereo images at 1920x1080 resolution
capture_checkerboard_images(camera_index_left=0, camera_index_right=1, resolution=(1920, 1080))
