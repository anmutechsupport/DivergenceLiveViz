import { io }  from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.css';
import './psd.css';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export function PSDgraph() {
  const [data, setData] = useState([]);

  const getData = () => {
    const socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    });

    socket.on('psd', psd => {
      // console.log(psd)
      const data = []
      for (let i = 0; i < psd.value.length; i++) {
        data.push({freqs: psd.freqs[i], value: psd.value[i]})
      }

      setData(data);
    });
  
  }

  // 1. listen for a cpu event and update the state
  useEffect(() => {
    getData();
  
  }, []);

  // 2. render the line chart using the state
  return (
    <div>
      <h1>Real Time PSD</h1>
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="freqs" />
        <YAxis />
        <Line dataKey="value" />
      </LineChart>
    </div>
  );
};
