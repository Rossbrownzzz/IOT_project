import moment from 'moment';
import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label
} from "recharts";

const token = ""
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com'
const org = `benjamin-lange@uiowa.edu`

const client = new InfluxDB({url, token})

let query = `from(bucket: "IoTData")
    |> range(start: -4h)
    |> filter(fn: (r) => r["_measurement"] == "tank")
    |> filter(fn: (r) => r["_field"] == "water_level")
    |> filter(fn: (r) => r["location"] == "tank1")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> yield(name: "results")
`;

const CustomizedAxisTick = ({ x, y, payload }) => {
    const dateTip = moment(payload.value)
      .format("LT");
       return (
      <g transform={`translate(${x},${y})`}>
     <text x={23} y={0} dy={14} fontSize="0.90em" fontFamily="bold" textAnchor="end" fill="#363636">
       {dateTip}</text>
      </g>
     );
    }

export const InfluxChart = () => {
        const [data, setData] = useState([]);
      
        useEffect(() => {
          let res = [];
          const influxQuery = async () => {
            //create InfluxDB client
            const queryApi = client.getQueryApi(org);
            //make query
            await queryApi.queryRows(query, {
              next(row, tableMeta) {
                console.log('tableMeta:', tableMeta);
                console.log('row:', row);
                const o = tableMeta.toObject(row);
                //push rows from query into an array object
                res.push(o);
              },
              complete() {
                console.log(res); // log res to check if query is returning data
                let finalData = []
      
                for (let i = 0; i < res.length; i++) {
                  let point = {};
                  //point["humidity"] = res[i]["humidity"];
                  point["water_level"] = res[i]["water_level"];
      
                  point["name"] = res[i]["_time"];
                  finalData.push(point);
                }
                setData(finalData);
              },
              error(error) {
                console.log("query failed- ", error);
              }
            });
            const interval = setInterval(async () => {
                let latestRes = [];
                await queryApi.queryRows(query, {
                  next(row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    latestRes.push(o);
                  },
                  complete() {
                    let finalData = [];
                    for (let i = 0; i < latestRes.length; i++) {
                      let point = {};
                      point["water_level"] = latestRes[i]["water_level"];
                      point["name"] = latestRes[i]["_time"];
                      finalData.push(point);
                    }
                    setData(finalData);
                  },
                  error(error) {
                    console.log("query failed- ", error);
                  }
                });
              }, 5000);
          };
      
          influxQuery();
        }, []);
        return (
          <div>
            <h1>Influx Chart</h1>
            <ComposedChart width={900} height={400} data={data}>
              <CartesianGrid />
              <Tooltip />
              <Line
                stroke="#0ff770"
                strokeWidth={1}
                dataKey="water_level"
                dot={false}
              />
              <XAxis dataKey="name" tick={CustomizedAxisTick}>
              <Label value="Time" textAnchor="end" angle={0} />
              </XAxis>
              <YAxis>
                <Label value="Flow Rate (m^3/s)" angle={-90} position={"middle"} offset={10} />
              </YAxis>
            </ComposedChart>
          </div>
        );
      };

    
