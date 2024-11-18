# You should replace these 3 lines with the output in calibration step

import cv2
import numpy as np

DIM = (1920, 1080)
K = np.array(
    [[574.3395157033265, 0.0, 966.9320821441719], [0.0, 574.4128680029796, 558.2355283367962], [0.0, 0.0, 1.0]])
D = np.array([[0.4267972164854894], [-0.1881898264777667], [-0.048336016826106], [0.05573475381114217]])


def undistort(img_path):
    img = cv2.imread(img_path)
    h, w = img.shape[:2]
    map1, map2 = cv2.fisheye.initUndistortRectifyMap(K, D, np.eye(3), K, DIM, cv2.CV_16SC2)
    undistorted_img = cv2.remap(img, map1, map2, interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    cv2.imshow("undistorted", undistorted_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == '__main__':
    undistort(r'C:\SCHOOL\3AIN\IT-Project-Team-07\checkerboard_images\checkerboard_20241104_153245.jpg')
