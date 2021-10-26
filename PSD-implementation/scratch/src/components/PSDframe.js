import React, { Component, useState, useRef, useEffect, useContext } from 'react';
import { FC } from 'react';
// @ts-ignore
import * as d3 from 'd3';
import {scaleLinear, tsvParse} from 'd3';
import AverageResultBar from './GrahphTimer/AverageResultBar';
import Fili from 'fili';
// import DropDownComponent from 'src/components/GrahphTimer/DropDownComponent';

import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Dialog,
  Grid,
  Typography,
  TextField,
  makeStyles,
  InputAdornment
} from '@material-ui/core';

import { TimerContext } from '../contexts/TimerContext';
import { PSDgraph } from './PSDgraph';
import { ToggleList } from './toggleList';
import {
  Line,
} from 'recharts';

import { Observable } from 'rxjs';
import * as pipes from '@neurosity/pipes'

const useStyles = makeStyles((theme) => ({ // don't have to import theme in js since it's now global from the provider
  root: {},
  path_line: {
    fill: "none",
    stroke: "#666",
    strokeWidth: "1.5px"
  },
  path_area: {
    fill: "#e7e7e7"
  },
  axis: {
    shapeRendering: "crispEdges"
  },
  x_axis_line: {
    stroke: "#fff",
    strokeOpacity: .5,
    // display: "none"
  },
  y_axis_line: {
    width: "8px",
    fill: "none",
    stroke: "#000"
  },
  y_axis_path: {
    fill: "none",
    stroke: "#000"
  },
  guideline: {
    marginRight: "100px",
    float: "right"
  },
  svgContainer: {
    display: "block",
    margins: "atuo",
    // padding: "50px"
  },
  svgDiv: {
    // width: '100%',
    textAlign: "center",
    padding: "50px"
  },
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
}));

const PSDframe = ({
  className,
  data,
//   session,
  duration,
  // update,
  // startGraph,
  ...rest
}) => {

  const classes = useStyles();

  const { getCurrentTime, startStatus, currentTime, progressBar} = useContext(TimerContext); //note Timer component sets progressBar 


  // const graphRef = React.createRef();
  const fullData = data;
  let updatedData;

  useEffect(()=> {
    async function changeTime(){
      await updateGraphTime(fullData, currentTime).then((response) => { //currentTime is being updated by the timer, updates every second
        updatedData = response;
        // console.log(response);
        if(updatedData.timeStamp.length != 0){
          renderGraph(response); //rerendering graph every 5 seconds
          // startGraph(graphRef.current);
        }
      })
    }
    if(currentTime%timeScale === 0){
      // console.log("++currentTime++", currentTime) //a new frame of the graph is shown every 5 seconds
      changeTime();
    }
  },[currentTime]);

  useEffect(() => {
    // console.log(startStatus);
    // console.log(progressBar);
    async function changeTime(){
      await updateGraphTime(fullData, progressBar).then((response) => { //progressBar timestamp is updated whenever user interacts with the bar
        updatedData = response;
        if(updatedData.timeStamp.length != 0){
          renderGraph(response); //rerendering graph given progress bar updatess
        }
      })
    }
    changeTime();
    console.log("++progressBar+", progressBar)
  },[progressBar])

  let secondScale = 256;
  let timeScale = 5;
  let timer = 0;
  let currentGraphTime = 0;

  const updateGraphTime = async (res, time) => {
    // console.log("hellloo update time")
    // console.log(currentGraphTime);
    if(time > duration - timeScale){ //currentGraphTime is used to index the data corresponidng to the chosen time index
      currentGraphTime = duration-timeScale;
    }else{
      currentGraphTime = time;
    }
    return new Promise((resolve, reject) => {

      let newData = {
        channels: data.channels,
        timeStamp: res.timeStamp.slice(currentGraphTime*secondScale, (currentGraphTime + timeScale)*secondScale),
        eegData: res.eegData.map(data => data.slice(currentGraphTime*secondScale, (currentGraphTime + timeScale)*secondScale)),
      }
      resolve(newData)
      
    })

  }

  function vectorAddition (first, last) { return last.map((v, i) => v+first[i]) }

  function vectorAverage (psd, elec=1) {

      let lastVector = psd[psd.length-1]
      let firstVector = psd[0]

      // console.log(psd.length)
    
      let nextSum = vectorAddition(firstVector, lastVector)

      // console.log(nextSum.length)
      
      // console.log(nextSum)
      if (psd.length-1 > 0) {
          let newPsd = psd.slice(1, psd.length-1).concat([nextSum])
          // console.log(newPsd.length)
          return vectorAverage(newPsd, elec+1)
      } else {
          // console.log(psd)
          return psd[0].map(v => v/elec+1)

      }


  }

  const history = []

  const rollingMean = (emitObj) => {
      // console.log(history)
      history.push(emitObj)
      const newEmit = {}
      const keys = Object.keys(emitObj)
      if (history.length > 3) {
          history.shift();
      }

      newEmit[keys[0]] = emitObj[keys[0]]

      if (history.length === 3){
          // console.log(history)
          for (const key of keys.slice(1)) {
              const keyArr = []
              for (const epoch of history) {
                  // console.log(epoch)
                  keyArr.push(epoch[key])
              }
              newEmit[key] = vectorAverage(keyArr)
          }

          return newEmit
      } else {
          return emitObj
      }
      
  }

  const [PSDdata, setPSDdata] = useState();
  const [formattedData, setFdata] = useState();
  const [toggleLines, setToggleLines] = useState(new Array(9).fill(true));
  const colors = ["red", "black", "green", "blue", "purple", "orange", "teal", "magenta", "gold"]
  const [lineList, setLineList] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);

  const renderGraph = (data) => { //PSD processing here
    const obserableData = new Observable(subscriber => { 
      // format data to look like epoch
      const epoch = {
        data: data.eegData,
        info: {
          samplingRate: 256, 
          // startTime: data.timeStamp[0]
          startTime: Date.now() // startime is just used to derive timestamps after transform
        }
      }
      subscriber.next(epoch)
    })

    obserableData.pipe(
      pipes.fft({ bins: 128 })
    ).subscribe(fft => {
      
      const psd = fft.psd
      const meanPsd = vectorAverage(psd)
      const emitObj = {
          freqs: fft.freqs,
          meanPsd: meanPsd,
      }

      for (let i=0; i<psd.length; i++) {
          emitObj[`e${i+1}`] = psd[i]
      }

      let newEmitObj = rollingMean(emitObj)
      // console.log(newEmitObj)
      setPSDdata(newEmitObj)
    });
  }

  const formatData = () => {

    if (PSDdata) {
      let currData = []
      // console.log(PSDdata)

      for (let i = 0; i < PSDdata.freqs.length; i++) { // this loop takes psd and creates an array where each row has a value from an electrode corresponding to a freq bin
        if (PSDdata.freqs[i] < 60) { // filtering
          currData[i] = {}
          for (const [key, value] of Object.entries(PSDdata)) {
            const point = currData[i] 
            point[key] = value[i]
            // currData[i] = point
          }
        }
      }
      
      setFdata(currData);
    
    } 
  }

  useEffect(() => {
    // console.log("psd change")
    formatData();
  
  }, [PSDdata]);

  useEffect(() => {

    // console.log("updating graph", formattedData)
    
    let lineList=[]
    let lineKeys = null

    if (formattedData) {
      lineKeys = Object.keys(formattedData[0]).slice(1)
      // console.log(data)
      for (let i=0; i<colors.length; i++) {
        if (toggleLines[i] === true) {
          lineList.push( <Line stroke={colors[i]} key={lineKeys[i]} dataKey={lineKeys[i]} /> ) // creating lines for each electrode
        }
      }
    }

    setLineList(lineList);
    setLineKeys(lineKeys); // also use linekeys for toggle list

  }, [toggleLines, formattedData])

  const handleChange = (e, i) => {
    // console.log(e, i)
    let newLines = toggleLines.slice()
    newLines[i] = !toggleLines[i]
    // console.log(newLines)
    setToggleLines(newLines)
  }

 return  (
   <div>     
      <PSDgraph data={formattedData} lineList={lineList}/>
      <ToggleList lineKeys={lineKeys} colors={colors} toggleLines={toggleLines} handleChange={handleChange}/>
   </div>
  )
}

export default PSDframe;
