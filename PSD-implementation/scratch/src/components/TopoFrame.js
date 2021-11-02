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
import {
  Line,
} from 'recharts';

import { Montage } from './montage';
import { InputContainer } from './inputContainer';
import { Observable } from 'rxjs';
import * as pipes from '@neurosity/pipes'
const topogrid = require('topogrid')

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

const TopoFrame = ({
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

  const calcInterp = (data, size) => {
    // x coordinates of the data
    const pos_x = [1,2,3,4,5,6,7,8];

    // y coordinates of the data
    const pos_y = [1,2,3,4,5,6,7,8];

    // the data values
    // const data1 = [0.75, 0.2, 0.99, 0.1, 0.6, 0.8, 0.9, 0.8];
    // console.log(data)

    const grid_params = [0,size-1,size];

    const zi = topogrid.create(pos_x,pos_y,data,grid_params);
    // console.log(data, zi)

    const calcColor = (min, max, val) => {
        let ratio = 2 * (val-min) / (max - min)
        const b = Math.round(Math.max(0, 255*(1-ratio)))
        const r = Math.round(Math.max(0, 255*(ratio-1)))
        const g = 255-b-r
        return [r, g, b]
    }

    const merged =  [].concat.apply([], zi)
    const min = Math.min( ...merged )
    const max = Math.max( ...merged )

    const rgbZi = []

    for (const point of zi) {
        const pointRgb = []
        for (const val of point) {
            let rgb = calcColor(min, max, val)
            // console.log(rgb)
            pointRgb.push(rgb)
        }
        rgbZi.push(pointRgb)
    }

    return rgbZi
}

  const [rgbVal, setRgbVal] = useState();
  const [gridDim, setGridDim] = useState(20)

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
      pipes.fft({ bins: 128 }),
      pipes.alphaPower()
    ).subscribe(alpha => {
      
        // console.log(alpha)
        const newRgbVal = [].concat(...calcInterp(alpha, gridDim));
        // console.log(newRgbVal)
        setRgbVal(newRgbVal)
    });
  }

  const handleChange = (e) => {
    setGridDim(e.target.value)
  }

 return  (
   <div>     
      <Montage gridSize={gridDim} rgbVal={rgbVal}/>
      <InputContainer handleChange={handleChange} />
   </div>
  )
}

export default TopoFrame;
