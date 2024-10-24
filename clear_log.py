def filter_debug_lines(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            if "DEBUG" in line:
                outfile.write(line)
input_file = 'gps_publisher.log'  
output_file = 'debug_output.log' 

filter_debug_lines(input_file, output_file)
