import influxdb_client, os, time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import pyrebase as py

token = os.environ.get("INFLUXDB_TOKEN")
org = "benjamin-lange@uiowa.edu"
url = "https://us-east-1-1.aws.cloud2.influxdata.com"

write_client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
bucket="IoTData"

firebaseConfig = {
  "apiKey": "AIzaSyCx9v34E5MjY584T-2ZsClF8seAYn50N_A",
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

global count
count = 10

while True:

    # point = (
    #     Point("tank")
    #     .tag("location", "tank1")
    #     .field("temp", count)
    # )
    # count = count + 1
    # write_api.write(bucket=bucket, org=org, record=point)
    # print("setValue To", count)
    # time.sleep(1) # separate points by 1 second
    # point = (
    #     Point("tank")
    #     .tag("location", "tank1")
    #     .field("flow", count)
    # )
    # count = count + 1
    # write_api.write(bucket=bucket, org=org, record=point)
    # time.sleep(1)
    point = (
        Point("tank")
        .tag("location", "tank1")
        .field("water_level", count)
    )
    count = count + 1
    write_api.write(bucket=bucket, org=org, record=point)
    time.sleep(2)
    print("sent ", count )



