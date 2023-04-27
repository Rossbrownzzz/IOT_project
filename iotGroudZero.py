import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import pyrebase as py
import RPi.GPIO as GPIO
import time
import subprocess
import random
import requests
from w1thermsensor import W1ThermSensor,Sensor

automatic = False
phoneNumber = ''
flowComp = 0
temperatureComp = 0
waterComp = 0
tempOn = True


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
  print(flw1, flw2)

  if flw1 and flw2:
    flow = 3
  elif flw1:
    flow = 2
  elif flw2:
    flow = 1
  else:
    flow = 0
  return flow

timeVal = time.time() - 600
def sendText(currentValue, alertValue, condition):
  global timeVal
  if time.time() - timeVal > 600:
    print('{} is currently {} and notification set to {}'.format(condition, currentValue, alertValue))
    timeVal = time.time()
    #######################################################################################################set this to text again
    '''
    resp = requests.post('https://textbelt.com/text', {
          'phone': phoneNumber,
          'message': '{} is currently {} and notification set to '.format(condition, currentValue, alertValue),
          'key': '889fed0ab7a54bd5df1d3b174431ef89079d0e2f3Sj8Kjtzr8XpFmsGA3DsUrDvp',
        })
    print(resp.json())
    '''
  else:
    print("texted too recently, waiting before next message.")

def getTemp():
  temp_c= sensor.get_temperature()
  temp_f= temp_c*9/5+32
  return temp_f


def auto_handler(message):
    global automatic
    automatic = message["data"]
def flow_handler(message):
    global flowComp
    flowComp = int(message["data"])
def phone_handler(message):
    global phoneNumber
    if message["data"] != '':
      phoneNumber = message["data"]
def temp_handler(message):
    global tempOn
    tempOn = message["data"]
def tempVal_handler(message):
    global temperatureComp
    temperatureComp = int(message["data"])
def water_handler(message):
    global waterComp
    waterComp = int(message["data"])


if __name__ == '__main__':

  # init variables
  token = "__1EXrzqCjtsJZUxn3x6Izx474xL5IdzgwsWCAwNhKxrb7X7e3yh-Ug9jj_-goMrPYFtUcoDaorYIewayFjnoQ=="  ########################################################################CHANGE THIS
  org = "benjamin-lange@uiowa.edu"
  url = "https://us-east-1-1.aws.cloud2.influxdata.com"

  write_client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
  bucket="IoTData"

  firebaseConfig = {
    "apiKey": "AIzaSyCx9v34E5MjY584T-2ZsClF8seAYn50N_A", ########################################################################CHANGE THIS
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
  tempPin = 7

  GPIO.setup(lv1pin, GPIO.IN)
  GPIO.setup(lv2pin, GPIO.IN)
  GPIO.setup(lv3pin, GPIO.IN)
  GPIO.setup(flowpin1, GPIO.IN)
  GPIO.setup(flowpin2, GPIO.IN)
  GPIO.setup(tempPin, GPIO.IN)

  autoHandler = fire.child("automatic").stream(auto_handler)
  flowHandler = fire.child("flowRate").stream(flow_handler)
  phoneHandler = fire.child("phoneNumber").stream(phone_handler)
  tempHandler = fire.child("tempOn").stream(temp_handler)
  tempValHandler = fire.child("temperature").stream(tempVal_handler)
  waterHandler = fire.child("waterLevel").stream(water_handler)
  sensor = W1ThermSensor(Sensor.DS18B20)
  
  fishScore = 0

  while True:
    flow = getFlow()
    temp = getTemp()

    lvl1 = GPIO.input(lv1pin)
    lvl2 = GPIO.input(lv2pin)
    lvl3 = GPIO.input(lv3pin)
    water = 3- (lvl1 + lvl2 + lvl3)

    print(automatic, phoneNumber, flowComp, temperatureComp, waterComp, tempOn)
    
    if not automatic:
      if not tempOn and heaterOn:
        heaterOn = False
        subprocess.run("sudo uhubctl -l 1-1 -a 0", shell=True)
        print("turn off")
        time.sleep(1)
      elif tempOn and not heaterOn:
        heaterOn = True
        subprocess.run("sudo uhubctl -l 1-1 -a 1", shell=True)
        print("turn on")
        time.sleep(1)
    else:
      if temperature < temperatureComp and not heaterOn:
        heaterOn = True
        subprocess.run("sudo uhubctl -l 1-1 -a 1", shell=True)
        print('turn on')
        time.sleep(1)
      elif temperature > temperatureComp and heaterOn:
        heaterOn = False
        subprocess.run("sudo uhubctl -l 1-1 -a 0", shell=True)
        print("turn off")
        time.sleep(1)

    if(temp < temperatureComp):
      sendText(temp, temperatureComp, "Temperature")
    if(flow < flowComp):
      sendText(flow, flowComp, "Flow rate")
    if(water < waterComp):
      sendText(water, waterComp, "Water level")

    sendValue('temp', int(temp))
    time.sleep(1)
    sendValue('flow', flow)
    time.sleep(1)
    sendValue('water_level', water)
    time.sleep(1)

    fishScore = 100 - abs(71 - temp)*3 - (flow * 10) - ((3-water) * 10)
    print(fishScore, abs(71 - temp)*3, (flow * 10), ((3-water) * 10))
