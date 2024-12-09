import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt

#left_image = cv.imread('tsukuba_l.png', cv.IMREAD_GRAYSCALE)
#right_image = cv.imread('tsukuba_r.png', cv.IMREAD_GRAYSCALE)

left_image = cv.imread('left.png', cv.IMREAD_GRAYSCALE)
right_image = cv.imread('right.png', cv.IMREAD_GRAYSCALE)

stereo = cv.StereoBM.create(numDisparities=16, blockSize=15)
depth = stereo.compute(left_image, right_image)

depth_normalized = cv.normalize(depth, None, 0, 255, cv.NORM_MINMAX).astype(np.uint8)

plt.imshow(depth_normalized, cmap='gray')
plt.axis('off')
plt.show()