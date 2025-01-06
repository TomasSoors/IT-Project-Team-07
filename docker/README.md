# Generate GeoJSON file to upload on the webapp

Be sure you are in the folder in Powershell: IT-Project-Team-07/

## 1. Upload images

First you need to place both videos, GNSS logfile and video timestamps in the IT-Project-Team-07/docker/input/ folder:
left.mp4, right.mp4, gnss.log, timestamps.txt

## 2. Build image

To build the image use the following command. Be sure that you are using Powershell and are in the root folder of the project.

```bash
docker build -t geo-json-generator -f docker/Dockerfile .
```

## 3. Run container

To run the container use the following command. the --rm flag makes sure the container is removed once it is stopped.

```bash
docker run -it --rm --name geo-json-generator \
    -v ${PWD}/docker/input/:/app/local-machine/input/ \
    -v ${PWD}/docker/output/:/app/local-machine/output/ \
    geo-json-generator
```

## 4. Upload GeoJSON file

After the container ran it should generate a GeoJSON file at IT-Project-Team-07/docker/output/. This file can be used to
upload on the webapp.

## Optional:
### 1. Stop container

Use the following command to stop the container if it has not automatically stopped.

```bash
docker stop geo-json-generator
```

### 2. Remove container, if not done automatically

Use the following command to remove the container if it was not done automatically

``bash 
docker rm geo-json-generator
``
