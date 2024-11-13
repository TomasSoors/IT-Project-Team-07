import cv2
import numpy as np
import matplotlib.pyplot as plt
from deprecated.defisheye import defish

# Function to load and de-warp fisheye image
def dewarp_fisheye(image_path):
    # Load the fisheye image
    fisheye_image = cv2.imread(image_path)
    
    # Check if the image was loaded successfully
    if fisheye_image is None:
        raise ValueError("Failed to load the fisheye image. Check the file path.")

    # De-warp the fisheye image
    # Adjust the parameters according to your camera's specifications
    # Assuming the camera has a horizontal FOV of 235 degrees
    fov = 235  # horizontal field of view in degrees

    # Use the defisheye function
    undistorted_image = defish(fisheye_image, fov)

    return fisheye_image, undistorted_image

# Display the images
def display_images(original, undistorted):
    plt.figure(figsize=(12, 6))

    plt.subplot(1, 2, 1)
    plt.title("Original Fisheye Image")
    plt.imshow(cv2.cvtColor(original, cv2.COLOR_BGR2RGB))
    plt.axis('off')

    plt.subplot(1, 2, 2)
    plt.title("Undistorted Image")
    plt.imshow(cv2.cvtColor(undistorted, cv2.COLOR_BGR2RGB))
    plt.axis('off')

    plt.show()

if __name__ == "__main__":
    image_path = 'path/to/your/fisheye_image.png'  # Replace with your image path
    original_image, undistorted_image = dewarp_fisheye()
    display_images(original_image, undistorted_image)
