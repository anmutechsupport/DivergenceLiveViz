import { io }  from 'socket.io-client';
import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import { ReactDOM } from 'react-dom';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const App = ({}) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const socket = await io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    });

    return socket    
  }

  // 1. listen for a cpu event and update the state
  useEffect(() => {
    const socket = getData();

    socket.on('psd', psd => {
      setData(psd);
    });
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

ReactDOM.render(<App />, document.getElementById('root'));