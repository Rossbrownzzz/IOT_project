import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import pyrebase as py
#import RPi.GPIO as GPIO
import time
import subprocess
import random
import requests



def sendValue(field: str, fieldVal: int):
    point = (
        Point("tank")
        .tag("location", "tank1")
        .field(field, fieldVal)
    )
    write_api.write(bucket=bucket, org=org, record=point)

def getFlow():
  flw1 = GPIO.input(flowpin1)
  flw2 = GPIO.input(flowpin2)
  #################################################################### shouldn't be random
  flw1 = random.randint(0,1)
  flw2 = random.randint(0,1)

  if flw1 and flw2:
    flow = 3
  elif flw1:
    flow = 2
  elif flw2:
    flow = 1
  else:
    flow = 0
  return flow



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

  heaterOn = True

  GPIO.setmode(GPIO.BOARD)

  lv1pin = 36
  lv2pin = 38
  lv3pin = 40
  flowpin1 = 16
  flowpin2 = 18

  GPIO.setup(lv1pin, GPIO.IN)
  GPIO.setup(lv2pin, GPIO.IN)
  GPIO.setup(lv3pin, GPIO.IN)
  GPIO.setup(flowpin1, GPIO.IN)
  GPIO.setup(flowpin2, GPIO.IN)




  while True:
    heaterOnFlag = fire.child('tempOn').get().val()
    phoneNumber = fire.child('phoneNumber').get().val()
    flow =getFlow()
    alert = True

    #lvl1 = GPIO.input(lv1pin)
    #lvl2 = GPIO.input(lv2pin)
    #lvl3 = GPIO.input(lv3pin)
    lvl1 = random.randint(0,1)
    lvl2 = random.randint(0,1)
    lvl3 = random.randint(0,1)


    # #TODO change this to check firebase
    if not heaterOnFlag and heaterOn:
      heaterOn = False
      subprocess.run("sudo uhubctl -l 1-1 -a 0", shell=True)
      print("turn off")
    elif heaterOnFlag and not heaterOn:
      heaterOn = True
      subprocess.run("sudo uhubctl -l 1-1 -a 1", shell=True)
      print("turn on")

    if(phoneNumber != "" and alert):
      resp = requests.post('https://textbelt.com/text', {
        'phone': phoneNumber,
        'message': 'Hello world',
        'key': 'textbelt',
      })
      print(resp.json())
      alert = False

    # #sendValue('temp', tmp)
    time.sleep(1)
    sendValue('flow', flow)
    time.sleep(1)
    sendValue('water_level', 2)# lvl1 + lvl2 + lvl3)
    time.sleep(1)

