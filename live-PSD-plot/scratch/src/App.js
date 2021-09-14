import logo from './logo.svg';
import './App.css';
import { PSDgraph } from './components/PSDgraph';
import { ToggleList } from './components/toggleList';
import { io }  from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import {
  Line,
} from 'recharts';

function App() {
  const [data, setData] = useState();
  const [toggleLines, setToggleLines] = useState(new Array(9).fill(true));
  const colors = ["red", "black", "green", "blue", "purple", "orange", "teal", "magenta", "gold"]
  const [lineList, setLineList] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);

  const getData = () => {
    const socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    });

    socket.on('psd', psd => {

      let currData = []

      for (let i = 0; i < psd.freqs.length; i++) {
        currData[i] = {}
        for (const [key, value] of Object.entries(psd)) {
          const point = currData [i] 
          point[key] = value[i]
          currData[i] = point
        }
      }

      // console.log(data)

      setData(currData);
    });
  
  }

  useEffect(() => {
    getData();
  
  }, []);

  useEffect(() => {

    // console.log(toggleLines)
    
    let lineList=[]
    let lineKeys = null

    if (data) {
      lineKeys = Object.keys(data[0]).slice(1)
      // console.log(lineKeys)
      for (let i=0; i<colors.length; i++) {
        if (toggleLines[i] == true) {
          lineList.push( <Line stroke={colors[i]} key={lineKeys[i]} dataKey={lineKeys[i]} /> )
        }
      }
    }
  
    // const filterLines = (lineList, toggleLines) => {
    //   let newList = []
    //   for (const [index, element] of toggleLines.entries()) {
    //     if (element === true) {
    //       // console.log(index)
    //       // lineList.splice(index, 1) // lineList size changes, hence some element indexes are out of range
    //       // console.log(lineList)
    //       newList.push(lineList[index])
    //     }
    //   }
    //   return newList
    // }
  
    // const filteredLines = filterLines(lineList.slice(), toggleLines)

    setLineList(lineList);
    setLineKeys(lineKeys);

  }, [toggleLines, data])

  // let lineList=[]
  // let lineKeys = null
  // const colors = ["red", "black", "green", "blue", "purple", "orange", "teal", "magenta", "gold"]
  // if (data) {
  //   lineKeys = Object.keys(data[0]).slice(1)
  //   // console.log(lineKeys)
  //   for (let i=0; i<colors.length; i++) {
  //     lineList.push( <Line stroke={colors[i]} key={lineKeys[i]} dataKey={lineKeys[i]} /> )
  //   }
  // }

  // const filterLines = (lineList, toggleLines) => {
  //   for (const [index, element] of toggleLines.entries()) {
  //     if (element === false) {
  //       lineList.splice(index, 1)
  //       console.log(lineList)
  //     }
  //   }
  //   return lineList
  // }

  // const filteredLines = filterLines(lineList.slice(), toggleLines)

  const handleChange = (e, i) => {
    let newLines = toggleLines.slice()
    newLines[i] = e.target.checked
    // console.log(newLines)
    setToggleLines(newLines)
  }

  // console.log(filteredLines)
  
  return (
    <div className="App">
      <PSDgraph data={data} lineList={lineList}/>
      <ToggleList lineKeys={lineKeys} colors={colors} toggleLines={toggleLines} handleChange={handleChange}/>
    </div>
  );
}

export default App;
