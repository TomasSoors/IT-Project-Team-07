import datetime
import re
import os


def filter_debug_lines(input_file, output_file, timestamps_file):
    # Step 1: Read timestamps
    with open(timestamps_file, 'r') as ts_file:
        timestamps = [line.strip() for line in ts_file.readlines()]
    
    # Convert timestamps to datetime objects
    timestamps = [datetime.datetime.strptime(ts, '%Y-%m-%d %H:%M:%S.%f') for ts in timestamps]
    
    # Get the first and last timestamp
    first_timestamp = timestamps[0]
    last_timestamp = timestamps[-1]

    # Compile regex pattern for timestamp extraction
    timestamp_pattern = re.compile(r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})')

    # Step 2: Open the input and output files
    lines_processed = 0
    lines_written = 0
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            if "DEBUG" in line and "404" not in line:
                # Step 3: Extract the timestamp from the log line
                match = timestamp_pattern.search(line)
                if match:
                    try:
                        log_timestamp_str = match.group(1)
                        log_timestamp = datetime.datetime.strptime(log_timestamp_str, '%Y-%m-%d %H:%M:%S,%f')
                        adjusted_log_timestamp = log_timestamp + datetime.timedelta(hours=1)
                        
                        lines_processed += 1

                        # Step 4: Filter log lines based on timestamp range
                        if first_timestamp <= adjusted_log_timestamp <= last_timestamp:
                            outfile.write(line)
                            lines_written += 1
                    except ValueError:
                        print(f"Skipping line (timestamp parse error): {line}")
                else:
                    print(f"No timestamp found in line: {line}")

# File paths
input_file = r'/app/local-machine/input/gps_publisher.log'
timestamps_file = r'/app/local-machine/input/timestamps.txt'
output_file = r'/app/temp-output/debug_output.log'

# Ensure the directory for the output file exists
os.makedirs(os.path.dirname(output_file), exist_ok=True)

# Run the filter function
filter_debug_lines(input_file, output_file, timestamps_file)






