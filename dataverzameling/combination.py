import cv2
import json
import datetime
import os

def get_frame_number(video_file):
    cap = cv2.VideoCapture(video_file)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    return total_frames

def choose_frame(total_frames):
    """Prompt the user to enter a valid frame number. Later the model will decide which frames contained trees"""
    print(f"Total frames available: {total_frames}")
    frame_number = int(input(f"Enter the frame number (0 to {total_frames - 1}): "))
    if 0 <= frame_number < total_frames:
        return frame_number
    else:
        print("Invalid frame number. Please try again.")
        return choose_frame(total_frames)

def get_timestamp_from_json(json_file, frame_number):
    """Retrieve the timestamp for the specified frame number from the JSON file."""
    with open(json_file, 'r') as file:
        timestamps = json.load(file)
    
    # Ensure timestamps is a list and return the correct timestamp
    if isinstance(timestamps, list) and frame_number < len(timestamps):
        return timestamps[frame_number]
    else:
        raise IndexError("Frame number out of range or invalid timestamps format.")

def find_closest_log_entry(log_file, target_timestamp):
    """Find the closest log entry to the target timestamp."""
    target_time = datetime.datetime.fromisoformat(target_timestamp) - datetime.timedelta(hours=2)
    
    closest_entry = None
    closest_time_diff = None
    
    with open(log_file, 'r') as file:
        for line in file:
            log_timestamp_str = line.split(' - ')[0].split(':: ')[-1]
            log_time = datetime.datetime.strptime(log_timestamp_str, '%Y-%m-%d %H:%M:%S,%f')
            time_diff = abs((log_time - target_time).total_seconds())
            
            if closest_time_diff is None or time_diff < closest_time_diff:
                closest_time_diff = time_diff
                closest_entry = line
                
    return closest_entry


def extract_latitude_longitude(log_entry):
    """Extract latitude and longitude from a log entry."""
    latitude = None
    longitude = None
    
    parts = log_entry.split('-')
    
    for part in parts:
        if 'Latitude:' in part:
            latitude = part.split('Latitude:')[1].strip().split()[0]
        if 'Longitude:' in part:
            longitude = part.split('Longitude:')[1].strip().split()[0]
    
    return latitude, longitude

def main():
    """Main function to coordinate the execution of the script."""
    video_file = 'output.mp4'  
    json_file = 'timestamps.json'  
    log_file = 'debug_output.log' 
    
    total_frames = get_frame_number(video_file)
    frame_number = choose_frame(total_frames)
    
    try:
        target_timestamp = get_timestamp_from_json(json_file, frame_number)
        
        if target_timestamp:
            closest_log_entry = find_closest_log_entry(log_file, target_timestamp)
            if closest_log_entry:
                latitude, longitude = extract_latitude_longitude(closest_log_entry)
                print(f"Latitude: {latitude}, Longitude: {longitude}")
            else:
                print("No log entry found close to the timestamp.")
        else:
            print("No timestamp found for the selected frame.")
    except (IndexError, FileNotFoundError) as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()