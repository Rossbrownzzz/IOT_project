import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import pyrebase as py


def sendValue(field: str, fieldVal: int):
    point = (
        Point("tank")
        .tag("location", "tank1")
        .field(field, fieldVal)
    )
    count = count + 1
    write_api.write(bucket=bucket, org=org, record=point)
    
    print("setValue To", count)



if __name__ == '__main__':
  # init variables
  token = os.environ.get("INFLUXDB_TOKEN")
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

  while True:

    # get temp from _
    # get flow from IO pin
    # get waterlevel from 3 IO pins

    sendValue('temp', tmp)
    time.sleep(1)
    sendValue('flow', flw)
    time.sleep(1)
    sendValue('water_level', lvl)
    time.sleep(1)
  



