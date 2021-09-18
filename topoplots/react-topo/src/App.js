import logo from './logo.svg';
import './App.css';
import { Montage } from './components/montage';
import { InputContainer } from './components/inputContainer';

import React, { useEffect, useState } from 'react';

function App() {

  const [gridDim, setGridDim] = useState(20)

  const handleChange = (e) => {
    setGridDim(e.target.value)
  }

  return (
    <div className="App">
      <Montage gridSize={gridDim}/>
      <InputContainer handleChange={handleChange} />
    </div>
  );
}

export default App;
