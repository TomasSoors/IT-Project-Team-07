import cv2
import math

# Define variables
B = 0.155       # Baseline distance between the cameras, in meters
x0 = 1920    # Image plane coordinate for the point of interest, in pixels
theta_0 = 104  # Angle of view, in degrees

# Convert theta_0 from degrees to radians
theta_0_rad = math.radians(theta_0)

# Placeholder for pixel values
x1, x2 = None, None

def calculate_distance(x1, x2):
    # Calculate D using the formula
    D = (B * x0) / (2 * math.tan(theta_0_rad / 2) * (x1 - x2))
    print("D =", D, "meters")  # D will be in meters
    return D

# Mouse callback function to capture clicks
def select_point(event, x, y, flags, param):
    global x1, x2, left_img, right_img
    if event == cv2.EVENT_LBUTTONDOWN:
        if param == 'left':
            x1 = x
            print(f"Selected point on left image: X1 = {x}")
            # Draw a red circle on the left image at the clicked point
            left_img = left_img_original.copy()
            cv2.circle(left_img, (x, y), 1, (0, 0, 255), -1)  # Red circle with radius 10
        elif param == 'right':
            x2 = x
            print(f"Selected point on right image: X2 = {x}")
            # Draw a red circle on the right image at the clicked point
            right_img = right_img_original.copy()
            cv2.circle(right_img, (x, y), 1, (0, 0, 255), -1)  # Red circle with radius 10

def main(left_image_path, right_image_path):
    global x1, x2, left_img, right_img
    # Load images
    left_img = cv2.imread(left_image_path)
    right_img = cv2.imread(right_image_path)

    # Set up windows and mouse callbacks
    cv2.namedWindow("Left Image")
    cv2.setMouseCallback("Left Image", select_point, 'left')
    cv2.namedWindow("Right Image")
    cv2.setMouseCallback("Right Image", select_point, 'right')

    while True:
        # Display the images
        cv2.imshow("Left Image", left_img)
        cv2.imshow("Right Image", right_img)

        # Check if both points have been selected and space is pressed
        key = cv2.waitKey(1)
        if key == 32 and x1 is not None and x2 is not None:  # Space key
            # Close the images
            cv2.destroyAllWindows()
            
            # Calculate and print distance
            calculate_distance(x1, x2)
            break
        elif key == 27:  # Esc key to exit
            cv2.destroyAllWindows()
            break

# Provide paths to your images
left_img_original = cv2.imread('left2.png')
right_img_original = cv2.imread('right2.png')
left_image_path = 'left2.png'
right_image_path = 'right2.png'
main(left_image_path, right_image_path)

