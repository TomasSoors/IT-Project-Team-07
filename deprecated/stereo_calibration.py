import cv2
import numpy as np
import glob

# Checkerboard dimensions
checkerboard_size = (6, 4)  # Number of inner corners (width, height)
square_size = 3.6  # Size of a checkerboard square in cm

# Prepare object points based on the checkerboard dimensions
objp = np.zeros((checkerboard_size[0] * checkerboard_size[1], 3), np.float32)
objp[:, :2] = np.mgrid[0:checkerboard_size[0], 0:checkerboard_size[1]].T.reshape(-1, 2) * square_size

# Arrays to store object points and image points from all the images
objpoints = []  # 3D points in real world space
imgpoints_left = []  # 2D points in left image plane
imgpoints_right = []  # 2D points in right image plane

# Load left and right images
left_images = glob.glob(r'\left\*.jpg')
right_images = glob.glob(r'C:\Users\jesse\OneDrive\Documents\Bomendata\checkerboard_images\right\*.jpg')

# Sort file lists to ensure corresponding left and right images are matched correctly
left_images.sort()
right_images.sort()

# Ensure there are matching pairs of images
if len(left_images) != len(right_images):
    print("Error: The number of left and right images does not match.")
    exit()

# Process each pair of images
for left_image_path, right_image_path in zip(left_images, right_images):
    left_img = cv2.imread(left_image_path)
    right_img = cv2.imread(right_image_path)

    gray_left = cv2.cvtColor(left_img, cv2.COLOR_BGR2GRAY)
    gray_right = cv2.cvtColor(right_img, cv2.COLOR_BGR2GRAY)

    # Find the checkerboard corners
    ret_left, corners_left = cv2.findChessboardCorners(gray_left, checkerboard_size, None)
    ret_right, corners_right = cv2.findChessboardCorners(gray_right, checkerboard_size, None)

    # If both images have checkerboard corners, add them to the lists
    if ret_left and ret_right:
        objpoints.append(objp)
        imgpoints_left.append(corners_left)
        imgpoints_right.append(corners_right)

        # Optional: Draw and display corners for visual confirmation
        cv2.drawChessboardCorners(left_img, checkerboard_size, corners_left, ret_left)
        cv2.drawChessboardCorners(right_img, checkerboard_size, corners_right, ret_right)
        cv2.imshow('Left Image', left_img)
        cv2.imshow('Right Image', right_img)
        cv2.waitKey(100)
    else:
        print(f"Checkerboard not found in: {left_image_path} or {right_image_path}")

cv2.destroyAllWindows()

# Perform stereo calibration if points are available
if objpoints and imgpoints_left and imgpoints_right:
    # Calibrate individual cameras
    ret_left, mtx_left, dist_left, _, _ = cv2.calibrateCamera(objpoints, imgpoints_left, gray_left.shape[::-1], None, None)
    ret_right, mtx_right, dist_right, _, _ = cv2.calibrateCamera(objpoints, imgpoints_right, gray_right.shape[::-1], None, None)

    # Stereo calibration
    ret, mtx_left, dist_left, mtx_right, dist_right, R, T, E, F = cv2.stereoCalibrate(
        objpoints, imgpoints_left, imgpoints_right,
        mtx_left, dist_left, mtx_right, dist_right,
        gray_left.shape[::-1],
        criteria=(cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 1e-5),
        flags=cv2.CALIB_FIX_INTRINSIC
    )

    # Stereo rectification
    R1, R2, P1, P2, Q, valid_roi1, valid_roi2 = cv2.stereoRectify(
        mtx_left, dist_left, mtx_right, dist_right,
        gray_left.shape[::-1], R, T, alpha=0
    )

    # Save calibration and rectification parameters
    np.savez('stereo_calibration_data.npz', 
             mtx_left=mtx_left, dist_left=dist_left, 
             mtx_right=mtx_right, dist_right=dist_right, 
             R=R, T=T, E=E, F=F, 
             R1=R1, R2=R2, P1=P1, P2=P2, Q=Q)

    print("Stereo calibration successful.")
    print("Left Camera Matrix:\n", mtx_left)
    print("Right Camera Matrix:\n", mtx_right)
    print("Distortion Coefficients (Left):\n", dist_left)
    print("Distortion Coefficients (Right):\n", dist_right)
    print("Rotation Matrix:\n", R)
    print("Translation Vector:\n", T)

else:
    print("No valid checkerboard corners found in image pairs.")
