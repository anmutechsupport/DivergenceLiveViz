import logo from './logo.svg';
import './App.css';
import PSDgraph from './components/PSDgraph';
// import LineChart from './components/LineChart';
import { ToggleList } from './components/toggleList';
import { io }  from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import Timer from './components/GrahphTimer/Timer';
import TimerProvider, {TimerContext} from "./contexts/TimerContext.js";
import useSettings from './hooks/useSettings';
import { createTheme } from './theme';
import {
  Line,
} from 'recharts';
import { ThemeProvider } from '@material-ui/styles';

function App() {
  const [data, setData] = useState();
  const [toggleLines, setToggleLines] = useState(new Array(9).fill(true));
  const colors = ["red", "black", "green", "blue", "purple", "orange", "teal", "magenta", "gold"]
  const channels = ['CP3', 'F6', 'C4', 'PO4', 'PO3', 'F5', 'C3', 'CP4'];
  const [lineList, setLineList] = useState([]);
  const [lineKeys, setLineKeys] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const formRef = useRef(null);

  const getData = async () => {
    return new Promise((resolve, reject) => {
      Papa.parse( // CSV parser
        selectedFile,
        {
          header: false,
          download: true,
          complete(results) {
            let rows = 9;
            let cols = results.data.length;
            let CSV_COL_COUNT = 9;
            let matrix = new Array(rows)
              .fill(0)
              .map(() => new Array(cols).fill(0));
            let i, j;

            for (i = 0; i < cols; i++) {
              for (j = 0; j < CSV_COL_COUNT; j++) {
                matrix[j][i] = parseFloat(results.data[i][j]);
              }
            }

            resolve({ matrix });
          },
          error(err, file) {
            reject(err);
          }
        }
      );
    });
  }

  const createNewTimeStamps = async data => {
    const oldTimeStamps = data.matrix.pop(); // last column of matrix is timestamps
  
    const xAxisValues = oldTimeStamps.map(moment => {
      const dateBase = new Date('January 1, 2021 08:00:00.000');
      // const dateBase = new Date(Date.UTC(0, 0, 0, 0, 0, 0));
      const diff = moment - oldTimeStamps[0];
      dateBase.setMilliseconds(diff);
      const tStamp = Math.floor(dateBase.getTime());
      return tStamp;
    });
  
    return xAxisValues;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      `Selected file - ${formRef.current.files[0].name}`
    );
    setSelectedFile(formRef.current.files[0])
  }

  useEffect(() => {
    // console.log("hit")
    (async () => {
      if (selectedFile) {
        const EEGdata = await getData();
        const newTimeStamps = await createNewTimeStamps(EEGdata);

        console.log("++timestamps length++", newTimeStamps.length)
        // console.log(newTimeStamps)

        setData({ // format of data Anush
          channels: channels,
          timeStamp: newTimeStamps, //timestamps from csv?
          eegData: EEGdata.matrix //this is data by electrode from csv
        });
      }
    })()

  }, [selectedFile]);

  // useEffect(() => {

  //   // console.log(toggleLines)
    
  //   let lineList=[]
  //   let lineKeys = null

  //   if (data) {
  //     lineKeys = Object.keys(data[0]).slice(1)
  //     // console.log(lineKeys)
  //     for (let i=0; i<colors.length; i++) {
  //       if (toggleLines[i] === true) {
  //         lineList.push( <Line stroke={colors[i]} key={lineKeys[i]} dataKey={lineKeys[i]} /> )
  //       }
  //     }
  //   }

  //   setLineList(lineList);
  //   setLineKeys(lineKeys);

  // }, [toggleLines, data])

  const handleChange = (e, i) => {
    let newLines = toggleLines.slice()
    newLines[i] = e.target.checked
    // console.log(newLines)
    setToggleLines(newLines)
  }

  const { settings } = useSettings();
  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });

  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <TimerProvider>
          {/* <PSDgraph data={data} lineList={lineList}/> */}
          {data &&
            <div>
              <PSDgraph
              data={data}
              // session={session}
              duration={300} // TODO: need to figure out what selected is
              /> 
              <ToggleList lineKeys={lineKeys} colors={colors} toggleLines={toggleLines} handleChange={handleChange}/>
            </div>
          }
          
          <form onSubmit={handleSubmit}> 
            <input
              type="file"
              ref={formRef}
              defaultValue={selectedFile}
              // onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <br />
            <button type="submit">Submit</button>
            
          </form>
          <Timer duration={300}/>
        </TimerProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
