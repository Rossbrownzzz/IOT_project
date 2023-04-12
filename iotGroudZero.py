import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import pyrebase as py
import RPi.GPIO as GPIO
import time
import subprocess

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.IN)
input = GPIO.input(7)

def sendValue(field: str, fieldVal: int):
    point = (
        Point("tank")
        .tag("location", "tank1")
        .field(field, fieldVal)
    )
    write_api.write(bucket=bucket, org=org, record=point)
    



if __name__ == '__main__':
  # init variables
  token = ""  ########################################################################CHANGE THIS
  org = "benjamin-lange@uiowa.edu"
  url = "https://us-east-1-1.aws.cloud2.influxdata.com"

  write_client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
  bucket="IoTData"

  firebaseConfig = {
    "apiKey": "", ########################################################################CHANGE THIS
    "authDomain": "iotfinalproject-5a9e4.firebaseapp.com",
    "databaseURL": "https://iotfinalproject-5a9e4-default-rtdb.firebaseio.com",
    "projectId": "iotfinalproject-5a9e4",
    "storageBucket": "iotfinalproject-5a9e4.appspot.com",
    "messagingSenderId": "340940497636",
    "appId": "1:340940497636:web:f361857a0309a1710ac2f1",
    "measurementId": "G-0FQ0WXNWBM"
  }

  firebase = py.initialize_app(firebaseConfig)
  fire = firebase.database()

  # Define the write api
  write_api = write_client.write_api(write_options=SYNCHRONOUS)

  # dummy values for now
  tmp = 1
  flw = 2
  lvl = 3

  heaterOn = True
  while True:

    # get temp from _
    # get flow from IO pin
    lvl = GPIO.input(7)

    #TODO change this to check firebase
    if not heaterOnFlag and heaterOn:
      heaterOn = False
      subprocess.run("sudo uhubctl -l 1-1 -a 0", shell=True)
      print("turn off")
    elif heaterOnFlag and not heaterOn:
      heaterOn = True
      subprocess.run("sudo uhubctl -l 1-1 -a 1", shell=True)
      print("turn on")


    #sendValue('temp', tmp)
    time.sleep(1)
    #sendValue('flow', flw)
    time.sleep(1)
    sendValue('water_level', lvl)
    time.sleep(1)
  



