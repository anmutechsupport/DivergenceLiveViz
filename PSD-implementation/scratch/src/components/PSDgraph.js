import 'bootstrap/dist/css/bootstrap.css';
import './psd.css';
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  Label,
  Legend,
  CartesianGrid
} from 'recharts';

export function PSDgraph({data, lineList}) {
    // console.log(data, lineList)
    // YAxis type="number" domain={[0, 25]}

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
        <YAxis type="number">
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
    </div>
  );
};