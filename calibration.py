import cv2
import numpy as np
import glob

# Checkerboard dimensions
checkerboard_size = (6, 4)  # Number of inner corners (width, height)
square_size = 3.6  # Size of a checkerboard square in cm

# Prepare object points based on the checkerboard dimensions
objp = np.zeros((checkerboard_size[0] * checkerboard_size[1], 3), np.float32)
objp[:, :2] = np.mgrid[0:checkerboard_size[0], 0:checkerboard_size[1]].T.reshape(-1, 2) * square_size

# Arrays to store object points and image points
objpoints = []  # 3D points in real world space
imgpoints = []  # 2D points in image plane

# Load images
images = glob.glob(r'C:\Users\jesse\OneDrive\Documents\Bomendata\checkerboard_images\*.jpg')

for image in images:
    img = cv2.imread(image)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Find the checkerboard corners
    ret, corners = cv2.findChessboardCorners(gray, checkerboard_size, None)
    
    if ret:
        objpoints.append(objp)
        imgpoints.append(corners)
        
        cv2.drawChessboardCorners(img, checkerboard_size, corners, ret)
        cv2.imshow('img', img)
        cv2.waitKey(100)  # Display each image for 100 ms
    else:
        print(f"Checkerboard not found in: {image}")

cv2.destroyAllWindows()

# Perform camera calibration only if we have points
if len(objpoints) > 0 and len(imgpoints) > 0:
    ret, mtx, dist, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, gray.shape[::-1], None, None)

    np.savez('camera_calibration.npz', mtx=mtx, dist=dist)

    print("Camera matrix:")
    print(mtx)
    print("\nDistortion coefficients:")
    print(dist)
else:
    print("No checkerboard corners were found in any images.")
