import logo from './logo.svg';
import './App.css';
import { Montage } from './components/montage';
import { InputContainer } from './components/inputContainer';
import { io }  from 'socket.io-client';

import React, { useEffect, useState } from 'react';

function App() {

  const [gridDim, setGridDim] = useState(20)

  const handleChange = (e) => {
    setGridDim(e.target.value)
    const socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
      });

      console.log("yup")

      socket.emit('change-dim', e.target.value)

  }

  return (
    <div className="App">
      <Montage gridSize={gridDim}/>
      <InputContainer handleChange={handleChange} />
    </div>
  );
}

export default App;
