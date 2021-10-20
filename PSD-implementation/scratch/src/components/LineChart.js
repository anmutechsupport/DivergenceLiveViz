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
// import { Theme } from '../theme';
import { TimerContext } from '../contexts/TimerContext';
// import { Target } from 'react-feather';

// interface LineChartProps {
//   className?: string;
//   data;
//   session;
//   duration: number;
//   // update:  any;
//   // startGraph: boolean;
// }

const useStyles = makeStyles({
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
//   fontWeightMedium: {
//     fontWeight: Theme.typography.fontWeightMedium
//   },
});

const margin = {top: 80, right: 80, bottom: 80, left: 80},
      width = 1500 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

const LineChart = ({
  className,
  data,
//   session,
  duration,
  // update,
  // startGraph,
  ...rest
}) => {
  const [filterType, setFilterType] = useState("");
  const filterTypeOptions = ['Highpass Filter', 'Lowpass Filter'];

  const [filterFrequency1, setFilterFrequency1] = useState("");

  const [sampleHz, setSampleHz] = useState("256 (Default)");
  const [uVscale, setuVscale] = useState("Auto Scale (Default)");

  const sampleHzOptions = ['256 (Default)', '128', '64'];


  const uVscaleOptions = ["Auto Scale (Default)",'+/- 50uV', '+/- 40uV', '+/- 30uV', '+/- 20uV'];


  const classes = useStyles();

  const { getCurrentTime, startStatus, currentTime, progressBar} = useContext(TimerContext); //note Timer component sets progressBar 


  // useEffect(()=> {
  //   console.log(currentTime);

  // },[currentTime]);



  const graphRef = React.createRef();
  const eventGraphsRef = React.createRef();
  const event2GraphsRef = React.createRef();
  const event3GraphsRef = React.createRef();
  const [graphSettings, setGraphSettings] = useState();
  const channels = [
  "CP3",
  "C3",
  "F5",
  "PO3",
  "PO4",
  "F6",
  "C4",
  "CP4",];
  const fullData = data;
  let updatedData;

  let firCalculator = new Fili.FirCoeffs();
  let  firFilterCoeffs = firCalculator.bandstop({
    order: 100, // filter order
    Fs: 128, // sampling frequency
    F1: 59,
    F2: 61
    // Fc: 80 // cutoff frequency
    // forbandpass and bandstop F1 and F2 must be provided instead of Fc
  });
  let firFilter = new Fili.FirFilter(firFilterCoeffs);


  useEffect(() => {
    async function init() {
      await setData(data).then((res) => { // passed data Anush
        if (graphRef.current != null){
          // console.log("Updated");
          // console.log(res);
          // console.log("eventsData");
          // console.log(eventsData)
          updatedData =res;
          renderGraph(graphRef.current, updatedData);
        }
      })
    }

    init();
  }, [])

  useEffect(()=> {
    async function changeTime(){
      await updateGraphTime(fullData, currentTime).then((response) => {
        updatedData = response;
        // console.log(response);
        if(updatedData.timeStamp.length != 0){
          renderGraph(graphRef.current, response); //rerendering graph given current time updates
          startGraph(graphRef.current);
        }
      })
    }
    if(currentTime%10 === 0){
      changeTime();
    }
  },[currentTime]);

  useEffect(() => {
    if(startStatus){
      startGraph(graphRef.current);
    }else{
      pauseGraph(graphRef.current);
    }
    // console.log("Start / Pause");

  },[startStatus])

  useEffect(() => {
    // console.log(startStatus);
    // console.log(progressBar);
    async function changeTime(){
      await updateGraphTime(fullData, progressBar).then((response) => {
        updatedData = response;
        if(updatedData.timeStamp.length != 0){
          renderGraph(graphRef.current, response); //rerendering graph given progress bar updatess
        }
      })
    }
    changeTime();
  },[progressBar])

  let secondScale = 256;
  let timeScale = 10;
  let timer = 0;
  let currentGraphTime = 0;

  const setData = async (res) => {
    return new Promise((resolve, reject) => {
      // console.log(firFilter.simulate(res.eegData[0].slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale)))

      let newData = {
        channels: data.channels,
        timeStamp: res.timeStamp.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale),
        eegData: res.eegData.map(data => data.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale)),
      }
      resolve(newData)
    })
  }
  let t;

  const startGraph = (svgDOM) => {
    const svg = d3.select(svgDOM);
    t = null;

    t = svg.transition()
    .delay(0)
    .duration(14000)
    .ease(d3.easeLinear)
    .attr("T",0)
    .attr("class", "moving")
    .on('end', function() {
      // console.log("ended");
      // updateData();
    });

   t.select('rect.curtain')
    .attr('width', 0);
    t.select(".guide")
    .attr('transform', 'translate(' + width + 20 + ', 0)')

  }

  const pauseGraph = (svgDOM) => {
    const svg = d3.select(svgDOM);
    d3.selectAll("*").interrupt();


    // d3.select(".moving").attr("T", 0);

  //   t = svg.transition()
  //   .delay(0)
  //   .duration()
  //   .ease(d3.easeLinear)
  //   .attr("T",1)
  //   .on('end', function() {
  //     // console.log("ended");
  //     // updateData();
  //   });

  //  t.select('rect.curtain')
  //   .attr('width', 0);
  //   t.select(".guide")
  //   .attr('transform', 'translate(' + width + 20 + ', 0)')

  }

  // const getFilteredData = async (res) => {
  //   return new Promise((resolve, reject) => {
  //     let filteredData =
  //     res.eegDataforEach(element => console.log(element));

  //     let newData = {
  //       channels: data.channels,
  //       timeStamp: res.timeStamp.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale),
  //       eegData: res.eegData.map(data => data.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale)),
  //       eventData: res.eventData.splice(0,512),
  //       eventTime: res.eventTime.splice(0,512),
  //       eventData2: res.eventData2.splice(0,512),
  //       eventTime2: res.eventTime2.splice(0,512),
  //     }
  //     resolve(newData)
  //   })
  // }

  const updateGraphTime = async (res, time) => {
    // console.log("hellloo update time")
    // console.log(currentGraphTime);
    if(time > duration - 10){ //currentGraphTime is used to index the data corresponidng to the chosen time index
      currentGraphTime = duration-10;
    }else{
      currentGraphTime = time;
    }
    return new Promise((resolve, reject) => {

      if(currentFilter){
        // console.log(currentFilter)
        let newData = {
          channels: data.channels,
          timeStamp: res.timeStamp.slice(currentGraphTime*secondScale, (currentGraphTime + 10)*secondScale),
          eegData: res.eegData.map(data => currentFilter.multiStep(data.slice(currentGraphTime*secondScale, (currentGraphTime + 10)*secondScale))),
        }
        
        resolve(newData)

      }else{
        let newData = {
          channels: data.channels,
          timeStamp: res.timeStamp.slice(currentGraphTime*secondScale, (currentGraphTime + 10)*secondScale),
          eegData: res.eegData.map(data => data.slice(currentGraphTime*secondScale, (currentGraphTime + 10)*secondScale)),
        }
        resolve(newData)

      }
      
    })

  }

  const updateGraphData = async (res) => { //not used anymore
    timer++; 
    return new Promise((resolve, reject) => {
      let newData = {
        channels: data.channels,
        timeStamp: res.timeStamp.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale),
        eegData: res.eegData.map(data => data.slice(timer*timeScale*secondScale, (timer+1)*timeScale*secondScale)),
      }
      resolve(newData)
    })
  }

  let line;
  let yScales = []
  let yA;

  const renderGraph = (svgDOM, data) => {
    // console.log(uVscale);

    const svg = d3.select(svgDOM);

    svg.selectAll("*").remove()

    let xScale = d3.scaleUtc()
        .domain(d3.extent(data.timeStamp))
        .range([0, 1000])


    // let overlap = 10


    let  xAxis = d3.axisBottom(xScale).ticks(d3.timeSecond.every(1), "%M:%S")
    // .ticks(d3.time.minute, 10)

    // .tickFormat((x) => {
    //   let time =Math.round(Math.abs((data.timeStamp[data.timeStamp.length-1] - data.timeStamp[0]) / 1000) -   Math.abs((data.timeStamp[data.timeStamp.length-1]  -  x) / 1000))+1
    //   return ((time%60 == 0 && time/60 < 10 ? '0' : '') + Math.floor(time/60)) + ":"+ (time%60 < 10 ? '0' : '') + time;
    // })

    line = (rawData, i) => {
      // console.log();

      let linee = d3.line()
      .x(function(d, index, dataArray){
        return xScale(data.timeStamp[index])
      })
      .y(function(d, index, dataArray){

        return yScales[i](d)
      })
      .curve(d3.curveLinear) //curve line

      return linee(rawData)
    }
    //entire graph object
    svg.attr("width", width)
      .attr("height", height + margin.top)
      .append("g")
      .attr("transform", "translate( 0 " + height + margin.top + ")")

    svg.append("g")
      .attr("class", classes.x_axis_line)
      .attr("class", classes.axis)
      .attr("transform", "translate(20, "+height+")")
      .call(xAxis);


    svg.append("g").attr("class", "y_axes").attr("transform", "translate(" + 20 + " , 0)")
            .selectAll(".y_axes")
        .data(data)

    yA = svg.selectAll(".y_axes")
          .each(function(d, i, n) {
            for(let l = 0; l < channels.length; l++){
              // console.log(d3.extent(data.eegData[l]))
              yScales.push(d3.scaleLinear()
              .domain(d3.extent(data.eegData[l]))
              // .domain([-60,60])
              .range([l*(height/8), (l+1)*(height/8)]))

              d3.select(n[i]).append("g").attr("id", "channel"+l)
              .call(d3.axisLeft(
                yScales[l]
                  // .nice()
                )
                .ticks(0)
                // .tickFormat(x => (channels[l])).tickSize(0).tickPadding(0)
              ).append("text")
              .attr("fill", 'currentColor')
              .attr("x", 0 )
              .attr("dy", l*height/8 +40)
              // .attr("y", 40*(l+1) + l*height/8)
              .text(function(d) { return channels[l]; })
            }
          })


  // Add the clip path.

  svg.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width + margin.left)
      .attr("height", height);


  var colors = d3.scaleOrdinal(d3.schemeCategory10);

  const group = svg.append("g").attr("class", "gClass")
                  .selectAll(".gClass")
                  .data(data.eegData)
                  .join("g")


  group.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      // .attr("transform", (d,i) => `translate(0,${yScale(updatedData.channels[i]) + 1})`);
      .attr('transform', 'translate( 20  , 0)')
      // .attr("fill", "none")
      // .attr("stroke", "black")
      .attr("d", (d, i) =>  {
        return line(d, i);
  })

  /* Add 'curtain' rectangle to hide entire graph */
  svg.append('rect')
    .attr('x', -1 * width - margin.left - 20)
    .attr('y', -1 * height)
    .attr('height', height)
    .attr('width', width + margin.left)
    .attr('class', 'curtain')
    .attr("opacity", 0.85)
    .attr('transform', 'rotate(180)')
    .style('fill', '#ffffff');

  /* Optionally add a guideline */
  // svg.append('line')
  //   .attr('stroke', '#333')
  //   .attr('stroke-width', 1)
  //   .attr('class', "guide")
  //   .attr('x1', 1)
  //   .attr('y1', 1)
  //   .attr('x2', 1)
  //   .attr('y2', height)

  /* Create a shared transition for anything we're animating */
  // var t = svg.transition()
  //   .delay(0)
  //   .duration(10000)
  //   .ease(d3.easeLinear)
  //   .attr("T",0)
  //   .on('end', function() {
  //     // console.log("ended");
  //     updateData();
  //   });

    async function updateData(){

     await updateGraphData(fullData).then((response) => {
        updatedData = response;
        // console.log(response);
        if(updatedData.timeStamp.length != 0){
          renderGraph(graphRef.current, response);
        }
      })
    }

    // t.select('rect.curtain')
    // .attr('width', 0);
    // t.select(".guide")
    // .attr('transform', 'translate(' + width + 20 + ', 0)')

    return {
      xScale: xScale,
      xAxis: xAxis,
      svg: svg
    }
  }

  let currentFilter;
  const applyClick = async() => {
    
    // if(filterType && filterFrequency1){
    //   console.log('ft', filterType, 'fhz', filterFrequency1);
    //   if(filterType === "Highpass Filter"){
    //     console.log("hi")

    //     let firCalculator = new Fili.FirCoeffs();
    //     let  firFilterCoeffs = firCalculator.highpass({
    //       order: 100, // filter order
    //       Fs: 256, // sampling frequency
    //       Fc: filterFrequency1
    //       // Fc: 80 // cutoff frequency
    //       // forbandpass and bandstop F1 and F2 must be provided instead of Fc
    //     });
    //     currentFilter = new Fili.FirFilter(firFilterCoeffs);

    //     await updateGraphTime(fullData, progressBar).then((response) => {
    //       updatedData = response;
    //       console.log(updatedData)
    //       if(updatedData.timeStamp.length != 0){
    //         renderGraph(graphRef.current, response);
    //       }
    //     })
    //   }else{
    //     console.log("lo")
    //     let firCalculator = new Fili.FirCoeffs();
    //     let  firFilterCoeffs = firCalculator.lowpass({
    //       order: 100, // filter order
    //       Fs: 128, // sampling frequency
    //       Fc: filterFrequency1
    //     });
    //     currentFilter = new Fili.FirFilter(firFilterCoeffs);      
    //   }
    // }
  };


const handleFilterFrequency = (target) => {
  if(target.value < 0) return; //TODO: send the user a message about it.
  setFilterFrequency1(target.value);
};

const handleFilterType = (target) => {
  if(!target.value) return; //TODO send the user a message about it.
  setFilterType(target.value);

}

const handleDownsampling = (target) => {
  if(!target.value) return; //TODO send the user a message about it.
  setSampleHz(target.value);
}

const handleuVscale = (target) => {
  if(!target.value) return;
  setuVscale(target.value);
  // const svg = d3.select(graphRef.current);
  // console.log(svg.selectAll(".y_axes"));

  // svg.selectAll(".y_axes")
  // .each(function(d, i, n) {
  //   yScales =[];
  //   for(let l = 0; l < channels.length; l++){
  //     // console.log(d3.extent(data.eegData[l]))
  //     yScales.push(d3.scaleLinear()
  //     // .domain(-50,50)
  //     .domain([-60,60])
  //     .range([l*(height/8), (l+1)*(height/8)]))

  //     d3.select(n[i]).append("g").attr("id", "channel"+l)
  //     .call(d3.axisLeft(
  //       yScales[l]
  //         // .nice()
  //       )
  //       .ticks(0)
  //       // .tickFormat(x => (channels[l])).tickSize(0).tickPadding(0)
  //     ).append("text")
  //     .attr("fill", 'currentColor')
  //     .attr("x", 0 )
  //     .attr("dy", l*height/8 +40)
  //     // .attr("y", 40*(l+1) + l*height/8)
  //     .text(function(d) { return channels[l]; })
  //   }
  // })


};

const resetClick = () => {
setFilterType("");
setFilterFrequency1("");
};

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
          Raw EEG Graph
        </Typography>
        </Box>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
        justifyContent: 'left',
        alignItems: 'end',
        justifyItems: 'left',
        margin: '10px',
        width: '83%',
      }}
    >
      {/* <div style={{ width: '100%' }}>
        <Typography style={{ margin: '10px', width: 'auto'}}>
          <p style={{ fontSize: '12px' }}>Frequency Filters</p>
        </Typography>

        <TextField
        label="Filter Type"
        name="filterType"
        onChange={({target}) => handleFilterType(target)}
        select
        SelectProps={{ native: true }}
        value={filterType}
        variant="outlined"
        autoComplete="off"
      >
      <option value=""></option>
      {filterTypeOptions.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </TextField>
      </div> */}
      {/* <div style={{
        display: "grid",
        gridTemplateColumns: '1fr 1fr',
        gridGap: '5px',

      }}> */}
        {/* <TextField
          id="filterFrequency"
          label="Filter Frequency"
          variant="outlined"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="start" style={{marginLeft: '5px'}}>Hz</InputAdornment>,
          }}
          onChange={({target}) => handleFilterFrequency(target)}
          value={filterFrequency1}
        />

        <Button
        variant="contained"
        style={{margin: '0 10px 0 20px', background: 'blue', color: 'white', padding: "15px 40px"}}
        onClick={applyClick}
        >Apply</Button>

      <Button
        variant="contained"
        style={{margin: '0', background: 'blue', color: 'white', padding: "15px 40px"}}
        onClick={resetClick}
        >Reset</Button>
      {/* </div> */}
      {/* <div>
        <Typography style={{ margin: '10px' }}>
          <p style={{ fontSize: '12px' }}>Downsampling</p>
        </Typography>
        <TextField
        fullWidth
        label="Sample Hz"
        name="sampleHz"
        onChange={({target}) => handleDownsampling(target)}
        select
        SelectProps={{ native: true }}
        value={sampleHz}
        variant="outlined"
        autoComplete="off"
      >
      <option value=""></option>
      {sampleHzOptions.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </TextField> */}

      {/* </div> */}

      {/* <div style={{width: '200px'}}>
        <Typography style={{ margin: '10px' }}>
          <p style={{ fontSize: '12px' }}>uV Scale</p>
        </Typography>
        <TextField
        fullWidth
        label="Y-Axis Scale"
        name="yaxis-scale"
        onChange={({target}) => handleuVscale(target)}
        select
        SelectProps={{ native: true }}
        value={uVscale}
        variant="outlined"
        autoComplete="off"
      >
      <option value=""></option>
      {uVscaleOptions.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </TextField>

      </div> */}
    </div>
     { data && <svg className={classes.svgContainer} ref={graphRef} id={"eegGraph"}></svg>}
     {/* <div>
     <h1 style={{fontSize: '30px'}}>{currentTime} - {startStatus ? "running" : "paused"} - ProgressBar: {progressBar}</h1>
     </div> */}
   </div>
  )
}

export default LineChart;
