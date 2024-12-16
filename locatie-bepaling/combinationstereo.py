import json
import math
import datetime
import cv2

# Define stereo vision parameters
B = 0.155  # Baseline distance between the cameras, in meters
x0 = int(1920 / 2)  # Image plane coordinate for the point of interest, in pixels
theta_0 = 104  # Angle of view, in degrees
f_x = 583.6522610865065  # Focal length in x (pixels)
image_width = 1920  # Image width in pixels

# Convert theta_0 from degrees to radians
theta_0_rad = math.radians(theta_0)


def get_frame_number(video_file):
    cap = cv2.VideoCapture(video_file)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    return total_frames


def calculate_distance(x1, x2):
    """Calculate the distance based on stereo vision."""
    disparity = abs(x1 - x2)
    if disparity == 0:
        return None  # Return None to indicate an error

    D = (B * x0) / (2 * math.tan(theta_0_rad / 2) * disparity)
    return D


def extract_latitude_longitude_heading(log_entry):
    """Extract latitude and longitude from a log entry."""
    latitude, longitude, heading = None, None, None
    parts = log_entry.split("-")

    for part in parts:
        if "Latitude:" in part:
            latitude = float(part.split("Latitude:")[1].strip().split()[0])
        if "Longitude:" in part:
            longitude = float(part.split("Longitude:")[1].strip().split()[0])
        if "Heading:" in part:
            heading = float(part.split("Heading:")[1].strip().split()[0])

    return latitude, longitude, heading


def get_timestamp_from_txt(txt_file, frame_number):
    with open(txt_file, "r") as file:
        # Read all lines into a list, strip any trailing newlines or spaces
        timestamps = [line.strip() for line in file.readlines()]

    # Ensure the frame_number is within bounds
    if frame_number < len(timestamps):
        return timestamps[frame_number]
    else:
        raise IndexError(f"Frame number {frame_number} is out of bounds.")


import re


def find_closest_log_entry(log_file, target_timestamp):
    """Find the closest log entry to the target timestamp."""
    target_time = datetime.datetime.fromisoformat(target_timestamp)
    adjusted_target_time = target_time - datetime.timedelta(hours=1)
    closest_entry = None
    closest_time_diff = None

    # Compile regex pattern for timestamp extraction
    timestamp_pattern = re.compile(r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})")

    with open(log_file, "r") as file:
        for line in file:
            match = timestamp_pattern.search(line)
            if match:
                log_timestamp_str = match.group(1)
                log_time = datetime.datetime.strptime(
                    log_timestamp_str, "%Y-%m-%d %H:%M:%S,%f"
                )
                time_diff = abs((log_time - adjusted_target_time).total_seconds())

                if closest_time_diff is None or time_diff < closest_time_diff:
                    closest_time_diff = time_diff
                    closest_entry = line

    return closest_entry


def calculate_object_position(
    latitude, longitude, heading, distance, x1, y1, x2, y2, image_width, fov
):
    """Calculate object's latitude and longitude based on heading, distance, and camera FOV."""
    R = 6371000  # Earth's radius in meters
    heading_rad = math.radians(float(heading))
    x_center = image_width / 2
    offset_x = (x1 + x2) / 2 - x_center
    offset_angle = offset_x * (fov / image_width)
    object_bearing = (heading + offset_angle) % 360
    object_bearing_rad = math.radians(object_bearing)
    lat1 = math.radians(float(latitude))
    lon1 = math.radians(float(longitude))
    lat2 = math.asin(
        math.sin(lat1) * math.cos(distance / R)
        + math.cos(lat1) * math.sin(distance / R) * math.cos(object_bearing_rad)
    )
    lon2 = lon1 + math.atan2(
        math.sin(object_bearing_rad) * math.sin(distance / R) * math.cos(lat1),
        math.cos(distance / R) - math.sin(lat1) * math.sin(lat2),
    )
    return math.degrees(lat2), math.degrees(lon2)


def main():
    txt_file = r"/app/local-machine/input/timestamps.txt"
    log_file = r"/app/temp-output/debug_output.log"
    tree_trunk = r"/app/temp-output/tree_trunk_positions.txt"
    geojson_output = r"/app/local-machine/output/coordinates.geojson"

    # GeoJSON structure
    geojson = {"type": "FeatureCollection", "features": []}

    with open(tree_trunk, "r") as file:
        lines = file.readlines()

        for i in range(0, len(lines), 3):
            tree_id_line = lines[i].strip()
            primary_position_line = lines[i + 1].strip()
            stereo_position_line = lines[i + 2].strip()

            primary_coords = (
                primary_position_line.split(":")[1].split("(")[1].split(")")[0]
            )
            stereo_coords = (
                stereo_position_line.split(":")[1].split("(")[1].split(")")[0]
            )
            frame_number = primary_position_line.split("Frame")[-1].strip(" )")
            x1, y1 = map(int, primary_coords.split(","))
            x2, y2 = map(int, stereo_coords.split(","))

            # Use the frame number from the tree position file
            try:
                target_timestamp = get_timestamp_from_txt(txt_file, int(frame_number))

                if target_timestamp:
                    closest_log_entry = find_closest_log_entry(
                        log_file, target_timestamp
                    )
                    if closest_log_entry:
                        latitude, longitude, heading = (
                            extract_latitude_longitude_heading(closest_log_entry)
                        )
                        # Validate GNSS coordinates
                        if (
                            latitude is None
                            or longitude is None
                            or not (-90 <= latitude <= 90)
                            or not (-180 <= longitude <= 180)
                        ):
                            print(
                                f"Skipping invalid GNSS coordinates: Latitude {latitude}, Longitude {longitude}"
                            )
                            continue
                    else:
                        print("No log entry found close to the timestamp.")
                else:
                    print("No timestamp found for the selected frame.")
            except (IndexError, FileNotFoundError) as e:
                print(f"Error: {e}")

            # Simulate closest log entry retrieval (for testing)
            # latitude, longitude, heading = 50.95330138166667, 5.352717561666666, 346.85
            """
            Get the coordinate of the GNSS-system at the same timestamp as the tree is found.
            """

            distance = calculate_distance(x1, x2)
            print(distance)
            if distance is None or distance < 2 or distance > 11:
                continue  # Skip this iteration if distance is out of bounds

            obj_lat, obj_lon = calculate_object_position(
                latitude, longitude, heading, distance, x1, y1, x2, y2, 1920, 117.40
            )

            # Add to GeoJSON
            feature = {
                "type": "Feature",
                "properties": {
                    "tree_id": tree_id_line.split(":")[0].split()[-1],
                },
                "geometry": {"type": "Point", "coordinates": [obj_lat, obj_lon]},
            }
            geojson["features"].append(feature)

    # Write GeoJSON to file
    with open(geojson_output, "w") as geojson_file:
        json.dump(geojson, geojson_file, indent=4)

    print("GeoJSON file 'output.geojson' created successfully.")


if __name__ == "__main__":
    main()
