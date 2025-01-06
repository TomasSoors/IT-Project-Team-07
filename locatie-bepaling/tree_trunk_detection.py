import cv2
from ultralytics import YOLO
from collections import defaultdict

# Paths to your YOLOv11 models
tree_model_path = r"/app/locatie-bepaling/ai-models/tree-model.pt"
trunk_model_path = r"/app/locatie-bepaling/ai-models/tree-trunk-model.pt"

# Load YOLO models
tree_model = YOLO(tree_model_path)
trunk_model = YOLO(trunk_model_path)

# Video input and output paths
primary_video_path = r'/app/local-machine/input/left.mp4'
stereo_video_path = r'/app/local-machine/input/right.mp4'
output_txt_file = r'/app/temp-output/tree_trunk_positions.txt'

# Open primary and stereo videos
cap_primary = cv2.VideoCapture(primary_video_path)
cap_stereo = cv2.VideoCapture(stereo_video_path)

# Verify synchronization
frame_count_primary = int(cap_primary.get(cv2.CAP_PROP_FRAME_COUNT))
frame_count_stereo = int(cap_stereo.get(cv2.CAP_PROP_FRAME_COUNT))
if frame_count_primary != frame_count_stereo:
    raise ValueError("Primary and stereo videos must have the same frame count for synchronization!")

# Video dimensions and FPS
frame_width = int(cap_primary.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap_primary.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap_primary.get(cv2.CAP_PROP_FPS))

# Object tracking and trunk positions
tracked_trees = defaultdict(list)  # Tracks trees by ID (tree_id: [list of bounding boxes])
tree_trunk_positions = {}  # Stores trunk positions for each tree ID
next_tree_id = 0  # Counter for assigning unique IDs to trees

# Function to calculate IoU for tracking
def calculate_iou(box1, box2):
    x1, y1, x2, y2 = box1
    x1_, y1_, x2_, y2_ = box2

    xi1, yi1 = max(x1, x1_), max(y1, y1_)
    xi2, yi2 = min(x2, x2_), min(y2, y2_)

    inter_area = max(0, xi2 - xi1 + 1) * max(0, yi2 - yi1 + 1)
    box1_area = (x2 - x1 + 1) * (y2 - y1 + 1)
    box2_area = (x2_ - x1_ + 1) * (y2_ - y1_ + 1)

    union_area = box1_area + box2_area - inter_area
    return inter_area / union_area if union_area > 0 else 0

# Frame counter
frame_number = 0

# Process videos frame by frame
while cap_primary.isOpened() and cap_stereo.isOpened():
    ret_primary, frame_primary = cap_primary.read()
    ret_stereo, frame_stereo = cap_stereo.read()
    if not ret_primary or not ret_stereo:
        break

    frame_number += 1

    # Step 1: Tree Detection on Primary Video
    tree_results = tree_model.predict(frame_primary, conf=0.60)
    tree_boxes = tree_results[0].boxes.xyxy.cpu().numpy()

    # Step 2: Track Trees
    current_frame_trees = []  # Temporary storage for trees detected in this frame
    for box in tree_boxes:
        x1, y1, x2, y2 = map(int, box)
        matched_id = None

        # Compare with tracked trees using IoU
        for tree_id, tracked_boxes in tracked_trees.items():
            if calculate_iou(tracked_boxes[-1], (x1, y1, x2, y2)) > 0.5:
                matched_id = tree_id
                break

        # If matched, update the tracked box for this ID
        if matched_id is not None:
            tracked_trees[matched_id].append((x1, y1, x2, y2))
            current_frame_trees.append(matched_id)
        else:
            # If no match, assign a new ID
            tracked_trees[next_tree_id] = [(x1, y1, x2, y2)]
            current_frame_trees.append(next_tree_id)
            next_tree_id += 1

    # Remove trees not detected in this frame (for tracking cleanup)
    tracked_trees = {tree_id: boxes for tree_id, boxes in tracked_trees.items() if tree_id in current_frame_trees}

    # Step 3: Tree Validation and Trunk Detection
    for tree_id, boxes in tracked_trees.items():
        if len(boxes) == 6 and tree_id not in tree_trunk_positions:  # Detected for 5 consecutive frames
            x1, y1, x2, y2 = boxes[-1]
            cropped_region_primary = frame_primary[y1:y2, x1:x2]

            # Run trunk detection on primary video
            trunk_results_primary = trunk_model.predict(cropped_region_primary, conf=0.25)
            trunk_boxes_primary = trunk_results_primary[0].boxes.xyxy.cpu().numpy()

            if len(trunk_boxes_primary) > 0:
                tx1, ty1, tx2, ty2 = map(int, trunk_boxes_primary[0])
                trunk_center_x_primary = x1 + (tx1 + tx2) // 2
                trunk_center_y_primary = y1 + (ty1 + ty2) // 2
                tree_trunk_positions[tree_id] = {
                    "primary": (trunk_center_x_primary, trunk_center_y_primary),
                    "primary_frame": frame_number
                }

            # Detect trunk position in stereo video
            if "primary" in tree_trunk_positions[tree_id]:
                cropped_region_stereo = frame_stereo[y1:y2, x1:x2]
                trunk_results_stereo = trunk_model.predict(cropped_region_stereo, conf=0.25)
                trunk_boxes_stereo = trunk_results_stereo[0].boxes.xyxy.cpu().numpy()

                if len(trunk_boxes_stereo) > 0:
                    tx1, ty1, tx2, ty2 = map(int, trunk_boxes_stereo[0])
                    trunk_center_x_stereo = x1 + (tx1 + tx2) // 2
                    trunk_center_y_stereo = y1 + (ty1 + ty2) // 2
                    tree_trunk_positions[tree_id]["stereo"] = (trunk_center_x_stereo, trunk_center_y_stereo)
                    tree_trunk_positions[tree_id]["stereo_frame"] = frame_number

# Write the results to the text file
with open(output_txt_file, 'w') as file:
    for tree_id, positions in tree_trunk_positions.items():
        file.write(f"Tree ID {tree_id}:\n")
        if "primary" in positions:
            file.write(f"  Primary Trunk Position: {positions['primary']} (Frame {positions['primary_frame']})\n")
        if "stereo" in positions:
            file.write(f"  Stereo Trunk Position: {positions['stereo']} (Frame {positions['stereo_frame']})\n")

# Release resources
cap_primary.release()
cap_stereo.release()
