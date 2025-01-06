# Use a base image
FROM python:3.10-slim

# Install required dependencies
RUN apt-get update && apt-get install -y \
    git \
    libglib2.0-0 libglib2.0-dev \
    libgl1-mesa-glx libgl1 && \
    apt-get clean

# Set working directory in the container
WORKDIR /app

# Copy requirements file to the container
COPY docker/requirements.txt /app/

# Copy python files into container
COPY locatie-bepaling/ /app/locatie-bepaling/

# Copy run script into container
COPY docker/run.sh /app/

# Set the TMPDIR environment variable to a writable directory
ENV TMPDIR=/app/temp

# Create the writable directory for temporary files
RUN mkdir -p /app/temp

# Install Python dependencies without cache
RUN pip install --no-cache-dir -r requirements.txt

# Set up and run the script
RUN chmod +x /app/run.sh

# Run the script on container start
CMD ["/app/run.sh"]
