import React, {useState, useEffect} from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import{
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    Area
} from "recharts";

const token = process.env.INFLUXDB_TOKEN;
const org = "benjamin-lange@uiowa.edu";
const url = "https://us-east-1-1.aws.cloud2.influxdata.com";

let query = `from(bucket: "IoTData")
    |> range(start: -24h)
    |> filter(fn: (r) => r._field == "water_level")`;


    export const InfuxChart = () => {
        const [data, setData] = useState([]);
      
        useEffect(() => {
          let res = [];
          const influxQuery = async () => {
            //create InfluxDB client
            const queryApi = await new InfluxDB({ url, token }).getQueryApi(org);
            //make query
            await queryApi.queryRows(query, {
              next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                //push rows from query into an array object
                res.push(o);
              },
              complete() {
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
              <XAxis hide dataKey="name" />
              <YAxis />
            </ComposedChart>
          </div>
        );
      };
