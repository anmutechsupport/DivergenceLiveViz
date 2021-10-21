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
  LineChart,
  XAxis,
  YAxis,
  Label,
  Legend,
  CartesianGrid
} from 'recharts';

import { Observable } from 'rxjs';
import * as pipes from '@neurosity/pipes'

const useStyles = makeStyles((theme) => ({
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


const margin = {top: 80, right: 80, bottom: 80, left: 80},
      width = 1500 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

const PSDgraph = ({
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


  const graphRef = React.createRef();
  const fullData = data;
  let updatedData;

  useEffect(() => { //runs once
    // console.log("rerender")
    async function init() {
      await setData(data).then((res) => { // passed data Anush
        if (graphRef.current != null){
          // console.log("Updated");
          // console.log(res);
          // console.log("eventsData");
          // console.log(eventsData)
          updatedData =res;
          renderGraph(updatedData);
        }
      })
    }

    init();
  }, [])

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
      console.log("++currentTime++", currentTime) //a new frame of the graph is shown every 5 seconds
      changeTime();
    }
  },[currentTime]);

  // useEffect(() => { // start/pause
  //   if(startStatus){
  //     startGraph(graphRef.current);
  //   }else{
  //     pauseGraph(graphRef.current);
  //   }
  //   // console.log("Start / Pause");

  // },[startStatus])

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

  const setData = async (res) => {
    return new Promise((resolve, reject) => {
      // console.log(firFilter.simulate(res.eegData[0].slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale)))
      console.log((timer+1)*timeScale*secondScale)

      let newData = {
        channels: data.channels,
        timeStamp: res.timeStamp.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale), //slicing by 2560, but timer isn't iterated, why?
        eegData: res.eegData.map(data => data.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale)),
      }
      resolve(newData)
    })
  }

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

  const renderGraph = (data) => { //PSD processing here
    const obserableData = new Observable(subscriber => { 
      // format data to look like epoch
      const epoch = {
        data: data.eegData,
        info: {
          samplingRate: 256, 
          // startTime: data.timeStamp[0]
          startTime: Date.now()
        }
      }
      subscriber.next(epoch)
    })

    obserableData.pipe(
      pipes.fft({ bins: 128 })
    ).subscribe(fft => {
      console.log(fft);
    });
  }

 return  (
   <div className={classes.svgDiv}>
      <Box
        py={2}
        px={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
         <Typography variant="h3" className={classes.fontWeightMedium} color="textPrimary">
          PSD Graph
        </Typography>
        </Box>

     {/* { data && <svg className={classes.svgContainer} ref={graphRef} id={"eegGraph"}></svg>} */}
     {/* <div>
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
        <YAxis type="number" domain={[0, 25]}>
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
    </div> */}
   </div>
  )
}

export default PSDgraph;
