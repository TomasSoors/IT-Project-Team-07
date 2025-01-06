#!/bin/bash

# Exit immediately if any command fails
set -e

echo "Starting script execution..."

echo "Cleaning gnss logfile"
python3 /app/locatie-bepaling/clear_log.py

echo "Estimating coordinates of trees (this could take some time)"

python3 /app/locatie-bepaling/tree_trunk_detection.py
python3 /app/locatie-bepaling/combinationstereo.py

echo "All scripts executed successfully."
echo "GeoJSON file created in container: /app/local-machine/output/coordinates.geojson"
echo "GeoJSON file can be found on your laptop at IT-Project-Team-07/docker/output/coordinates.geojson"
