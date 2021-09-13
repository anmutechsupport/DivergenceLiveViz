import { io }  from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.css';
import './psd.css';
import { ToggleList } from './toggleList';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  Legend,
  CartesianGrid
} from 'recharts';

export function PSDgraph() {
  const [data, setData] = useState();
  // const [lineList, setLines] = useState();

  const getData = () => {
    const socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    });

    socket.on('psd', psd => {

      const data = []

      for (let i = 0; i < psd.freqs.length; i++) {
        data[i] = {}
        for (const [key, value] of Object.entries(psd)) {
          const point = data[i] 
          point[key] = value[i]
          data[i] = point
        }
      }

      // console.log(data)

      setData(data);
    });
  
  }

  useEffect(() => {
    getData();
  
  }, []);

  let lineList=[]
  let lineKeys = null
  const colors = ["red", "black", "green", "blue", "purple", "orange", "teal", "magenta", "gold"]
  if (data) {
    lineKeys = Object.keys(data[0]).slice(1)
    // console.log(lineKeys)
    for (let i=0; i<colors.length; i++) {
      lineList.push( <Line stroke={colors[i]} key={lineKeys[i]} dataKey={lineKeys[i]} /> )
    }
  }

  // console.log(lineList.length)
  

  return (
    <div>
      <h1>Real Time PSD</h1>
      <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="freqs">
          <Label 
              value="Frequency (Hz)" 
              offset={-15} 
              position="insideBottom" 
              />
        </XAxis>
        <YAxis type="number" domain={[0, 10]}>
          <Label
              value="Power/frequency (uV^20)"
              position="insideLeft"
              angle={-90}
              offset={15} 
              style={{ textAnchor: 'middle' }}
              />
        </YAxis>
        <Legend verticalAlign={"top"} />
        {lineList}
      </LineChart>
      <ToggleList lineKeys={lineKeys} colors={colors}/>
    </div>
  );
};
