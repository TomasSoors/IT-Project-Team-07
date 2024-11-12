import cv2
import numpy as np
import glob
import os

# Checkerboard dimensions
checkerboard_size = (6, 4)  # Number of inner corners (width, height)
square_size = 3.6  # Size of a checkerboard square in cm

# Prepare object points based on the checkerboard dimensions
objp = np.zeros((checkerboard_size[0] * checkerboard_size[1], 3), np.float32)
objp[:, :2] = np.mgrid[0:checkerboard_size[0], 0:checkerboard_size[1]].T.reshape(-1, 2) * square_size

# Arrays to store object points and image points from both cameras
objpoints = []      # 3D points in real-world space
imgpoints_left = [] # 2D points in the left camera image plane
imgpoints_right = []# 2D points in the right camera image plane

# Load images
left_images = sorted(glob.glob(r'pictures\chessboard-L*.png'))
right_images = sorted(glob.glob(r'pictures\chessboard-R*.png'))

# Ensure we have the same number of left and right images
if len(left_images) != len(right_images):
    print("The number of left and right images do not match.")
    exit()

# Process each pair of images
for left_image, right_image in zip(left_images, right_images):
    img_left = cv2.imread(left_image)
    img_right = cv2.imread(right_image)
    
    # Convert to grayscale
    gray_left = cv2.cvtColor(img_left, cv2.COLOR_BGR2GRAY)
    gray_right = cv2.cvtColor(img_right, cv2.COLOR_BGR2GRAY)
    
    # Find the checkerboard corners
    ret_left, corners_left = cv2.findChessboardCorners(gray_left, checkerboard_size, None)
    ret_right, corners_right = cv2.findChessboardCorners(gray_right, checkerboard_size, None)
    
    # If corners are found in both images, add object points and image points
    if ret_left and ret_right:
        objpoints.append(objp)
        imgpoints_left.append(corners_left)
        imgpoints_right.append(corners_right)
        
        # Draw and display the corners for verification
        cv2.drawChessboardCorners(img_left, checkerboard_size, corners_left, ret_left)
        cv2.drawChessboardCorners(img_right, checkerboard_size, corners_right, ret_right)
        cv2.imshow('Left Image', img_left)
        cv2.imshow('Right Image', img_right)
        cv2.waitKey(100)  # Display each image for 100 ms
    else:
        print(f"Checkerboard not found in: {os.path.basename(left_image)} or {os.path.basename(right_image)}")

cv2.destroyAllWindows()

# Perform stereo camera calibration if we have points
if objpoints and imgpoints_left and imgpoints_right:
    # Calibrate each camera separately
    ret_left, mtx_left, dist_left, rvecs_left, tvecs_left = cv2.calibrateCamera(objpoints, imgpoints_left, gray_left.shape[::-1], None, None)
    ret_right, mtx_right, dist_right, rvecs_right, tvecs_right = cv2.calibrateCamera(objpoints, imgpoints_right, gray_right.shape[::-1], None, None)

    # Stereo calibration to find the relative position between the two cameras
    retval, cameraMatrix1, distCoeffs1, cameraMatrix2, distCoeffs2, R, T, E, F = cv2.stereoCalibrate(
        objpoints, imgpoints_left, imgpoints_right, mtx_left, dist_left, mtx_right, dist_right,
        gray_left.shape[::-1], criteria=(cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 1e-6),
        flags=cv2.CALIB_FIX_INTRINSIC
    )

    # Save calibration data
    np.savez('stereo_camera_calibration.npz', 
             cameraMatrix1=cameraMatrix1, distCoeffs1=distCoeffs1, 
             cameraMatrix2=cameraMatrix2, distCoeffs2=distCoeffs2, 
             R=R, T=T, E=E, F=F)

    print("Stereo calibration completed.")
    print("\nLeft Camera Matrix:")
    print(cameraMatrix1)
    print("\nLeft Distortion Coefficients:")
    print(distCoeffs1)
    print("\nRight Camera Matrix:")
    print(cameraMatrix2)
    print("\nRight Distortion Coefficients:")
    print(distCoeffs2)
    print("\nRotation Matrix between cameras:")
    print(R)
    print("\nTranslation Vector between cameras:")
    print(T)

else:
    print("No checkerboard corners were found in any image pairs.")

# Cropping adjustment - apply this later when undistorting or rectifying images
crop_percent = 0.20  # Crop 20% from each side
def crop_image(img, crop_percent):
    h, w = img.shape[:2]
    crop_h, crop_w = int(h * crop_percent), int(w * crop_percent)
    return img[crop_h:h - crop_h, crop_w:w - crop_w]

# Example of using the cropping function
sample_img = cv2.imread(left_images[0])
cropped_img = crop_image(sample_img, crop_percent)
cv2.imshow("Cropped Image", cropped_img)
cv2.waitKey(0)
cv2.destroyAllWindows()
