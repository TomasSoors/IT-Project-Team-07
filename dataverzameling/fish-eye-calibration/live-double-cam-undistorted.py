# You should replace these 3 lines with the output in calibration step

import cv2
import numpy as np

DIM_LEFT = (1920, 1080)
K_LEFT = np.array(
    [[583.6522610865065, 0.0, 959.8892429068345], [0.0, 582.5733148926981, 565.2191009777198], [0.0, 0.0, 1.0]])
D_LEFT = np.array([[0.42099372700109494], [-0.18126947160646645], [-0.02234830763325424], [0.03199801583650251]])

DIM_RIGHT = (1920, 1080)
K_RIGHT = np.array(
    [[583.6522610865065, 0.0, 959.8892429068345], [0.0, 582.5733148926981, 565.2191009777198], [0.0, 0.0, 1.0]])
D_RIGHT = np.array([[0.42099372700109494], [-0.18126947160646645], [-0.02234830763325424], [0.03199801583650251]])

# Open the webcam
cap_left = cv2.VideoCapture(1)
cap_right = cv2.VideoCapture(0)

# Set the resolution (width x height)
desired_width = 1920  # Example: 1920 for Full HD
desired_height = 1080  # Example: 1080 for Full HD

cap_left.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap_left.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)

cap_right.set(cv2.CAP_PROP_FRAME_WIDTH, desired_width)
cap_right.set(cv2.CAP_PROP_FRAME_HEIGHT, desired_height)

# Set the resolution (width x height)
desired_width = 1920
desired_height = 1080

# Crop the frames (20% from each side)
crop_width = int(desired_width * 0.2)  # 20% of the width
crop_height = int(desired_height * 0.2)  # 20% of the height


def undistort(img_path):
    image_counter = 0
    if not cap_left.isOpened():
        print("Error: Could not open webcam.")
        exit()

    while True:
        # Capture frame-by-frame from the webcam
        ret_left, frame_left = cap_left.read()
        ret_right, frame_right = cap_right.read()

        if not ret_left or not ret_right:
            print("Error: Failed to capture frame.")
            break

        map1_left, map2_left = cv2.fisheye.initUndistortRectifyMap(K_LEFT, D_LEFT, np.eye(3), K_LEFT, DIM_LEFT,
                                                                   cv2.CV_16SC2)
        undistorted_frame_left = cv2.remap(frame_left, map1_left, map2_left, interpolation=cv2.INTER_LINEAR,
                                           borderMode=cv2.BORDER_CONSTANT)

        map1_right, map2_right = cv2.fisheye.initUndistortRectifyMap(K_RIGHT, D_RIGHT, np.eye(3), K_RIGHT, DIM_RIGHT,
                                                                     cv2.CV_16SC2)
        undistorted_frame_right = cv2.remap(frame_right, map1_right, map2_right, interpolation=cv2.INTER_LINEAR,
                                            borderMode=cv2.BORDER_CONSTANT)

        # Ensure frames are cropped correctly
        frame_cropped_left = frame_left[crop_height:desired_height - crop_height, crop_width:desired_width - crop_width]
        frame_cropped_right = frame_right[crop_height:desired_height - crop_height,
                              crop_width:desired_width - crop_width]

        undistorted_cropped_left = undistorted_frame_left[crop_height:desired_height - crop_height,
                                   crop_width:desired_width - crop_width]
        undistorted_cropped_right = undistorted_frame_right[crop_height:desired_height - crop_height,
                                    crop_width:desired_width - crop_width]

        # Display the original and undistorted frames
        cv2.imshow('Original Frame Left', frame_cropped_left)
        cv2.imshow('Original Frame Right', frame_cropped_right)
        cv2.imshow('Undistorted Frame Left', undistorted_cropped_left)
        cv2.imshow('Undistorted Frame Right', undistorted_cropped_right)

        # Check for key press
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):  # 'q' to quit the program
            break

        if key == ord('s'):
            if frame_left is None or frame_right is None:
                print("Error: Frames not captured correctly.")
            else:
                print("saved images")
                cv2.imwrite(f'undistorted/left{image_counter}.png', undistorted_frame_left)
                cv2.imwrite(f'undistorted/right{image_counter}.png', undistorted_frame_right)
                image_counter += 1

    # Release everything after recording is finished
    cap_left.release()
    cap_right.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    undistort(r'C:\SCHOOL\3AIN\IT-Project-Team-07\checkerboard_images\checkerboard_20241104_153245.jpg')
