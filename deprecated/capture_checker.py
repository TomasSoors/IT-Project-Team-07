import cv2
import os
import datetime

def capture_checkerboard_images(camera_index=0, save_dir="checkerboard_images", resolution=(1920, 1080)):
    # Create directory to save images if it doesn't exist
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    # Open the camera
    cap = cv2.VideoCapture(camera_index)

    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    # Set camera resolution
    width, height = resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

    print(f"Camera resolution set to: {width} x {height}")
    print("Press 'c' to capture an image and 'q' to quit.")

    while True:
        ret, frame = cap.read()
        
        if not ret:
            print("Error: Could not read frame.")
            break
        
        # Display the frame
        cv2.imshow('Camera Feed', frame)

        key = cv2.waitKey(1) & 0xFF

        # Capture image on pressing 'c'
        if key == ord('c'):
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            image_path = os.path.join(save_dir, f"checkerboard_{timestamp}.jpg")
            cv2.imwrite(image_path, frame)
            print(f"Image saved: {image_path}")

        # Quit the loop on pressing 'q'
        elif key == ord('q'):
            print("Exiting...")
            break

    # Release the camera and close windows
    cap.release()
    cv2.destroyAllWindows()

# Run the function to capture images at 1920x1080 resolution
capture_checkerboard_images(camera_index=0, resolution=(1920, 1080))  # Adjust resolution as needed
