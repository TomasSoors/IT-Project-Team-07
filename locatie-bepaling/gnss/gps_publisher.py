#!/usr/bin/python3

import rospy
from std_msgs.msg import String
from navigation.msg import CoordinateMsg

from time import sleep
import os
import bluetooth

from application_logger import ApplicationLogger
import config
import util

# Logger
logger = ApplicationLogger.create_rotating_file_logger_with_stdout(str(os.path.basename(__file__)).split(".")[0])

CONFIG_SECTION = "GPS"
GPS_NAME = config.config_reader.get(CONFIG_SECTION, "name", "altus nr3")
GPS_ADDR = config.config_reader.get(CONFIG_SECTION, "addr", "6C:C3:74:EF:6C:7B")
GPS_PORT = config.config_reader.get_int(CONFIG_SECTION, "port", 1)
GPS_PASSKEY = config.config_reader.get_int(CONFIG_SECTION, "passkey", "1234")


class Coordinate:
    def __init__(self, latitude, longitude, heading=None):
        self.latitude = self.NMEA_lat_to_decimal(latitude)
        self.longitude = self.NMEA_long_to_decimal(longitude)
        self.heading = self.parse_heading(heading)

    def NMEA_lat_to_decimal(self, nmea_format):
        dd = nmea_format[:2]
        mm = nmea_format[2:]
        return int(dd) + float(mm)/60

    def NMEA_long_to_decimal(self, nmea_format):
        dd = nmea_format[:3]
        mm = nmea_format[3:]
        return int(dd) + float(mm)/60

    def parse_heading(self, heading):
        try:
            return float(heading) if heading else 404.0
        except ValueError:
            return 404.0

    def get_decimal_tuple(self):
        return (self.latitude, self.longitude)

    def __str__(self):
        return f"Latitude: {self.latitude} \t Longitude: {self.longitude}"


class GPSPublisher(object):
    def __init__(self):
        rospy.init_node('gps_publisher_node')
        self.publisher = rospy.Publisher('current_location', CoordinateMsg, queue_size=10)
        self.socket = None


    def setup(self):
        connected = False

        while not connected:
            try:
                out, err = util.bluetooth_pair(GPS_ADDR, GPS_PASSKEY)
                logger.info(out)  # This will print the output of the commands in bluetoothctl
                logger.error(err)  # This will print any errors

                self.socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
                self.socket.connect((GPS_ADDR, GPS_PORT))

                connected = True
            except bluetooth.btcommon.BluetoothError as err:
                logger.error("Bluetooth Error: %s", str(err))
                logger.error("sleeping for 5 seconds, then trying again")

                connected = False
                sleep(5)

        logger.info("Bluetooth socket connected")


    def run(self):
        rate = rospy.Rate(10) # 10 Hz
        while not rospy.is_shutdown():
            msg = self.socket.recv(128)
            gga = msg.decode('UTF8').replace('\r', '')
            gga = gga.split(",")

            try:
                if len(gga) > 5:
                    coordinate = Coordinate(gga[2], gga[4], gga[17])
                    coordinate_msg = CoordinateMsg()
                    coordinate_msg.latitude = coordinate.latitude
                    coordinate_msg.longitude = coordinate.longitude
                    coordinate_msg.heading = coordinate.heading

                    heading = gga[17]
                    if heading != '':
                        heading = float(heading)
                    else:
                        heading = 404.0
                    coordinate_msg.heading = heading
                    gps_publisher.publisher.publish(coordinate_msg)

                    logger.debug(coordinate)
            except Exception as e:
                logger.warning("No signal: %s", str(e))

            rate.sleep()


if __name__ == '__main__':
    gps_publisher = GPSPublisher()
    gps_publisher.setup()
    gps_publisher.run()
