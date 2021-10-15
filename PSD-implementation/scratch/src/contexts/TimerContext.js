import React, { useState, createContext } from 'react';

// interface TimeContextInterface {
//   start: () => void;
//   stop: () => void;
//   setCurrentTime: (arg: number) => void;
//   getCurrentTime: () => number;
//   getStartStatus: () => boolean;
//   setProgressBar: (arg: number) => void;
//   progressBar: number;
//   startStatus: boolean;
//   currentTime: number;
// }

const TimerContext = createContext({
  start() {
    throw new Error('You need to wrap your component in <TimeContext>');
  },
  stop() {
    throw new Error('You need to wrap your component in <TimeContext>');
  },
  setCurrentTime() {
    throw new Error('You need to wrap your component in <TimeContext>');
  },
  getCurrentTime() {
    throw new Error('You need to wrap your component in <TimeContext>');
  },
  getStartStatus() {
    throw new Error('You need to wrap your component in <TimeContext>');
  },
  startStatus: true,
  currentTime: 0,
  setProgressBar() {
    throw new Error('You need to wrap your component in <TimeContext>');
  },
  progressBar: 0,
});

const TimerProvider = ({ children }) => {
  const [startStatus, setStart] = useState(false);
  const [currentTime, setCurrentTimeContext] = useState(0);
  const [progressBar, setProgressBarContext] = useState(0);


  // === SET AND GET START/STOP ACTIONS: === //
  const start = () => setStart(true);
  const stop = () => setStart(false);
  const getStartStatus = () => startStatus;

  // === SET AND GET TIME ELAPSED ==== //
  // NOTE: You also have direct access to the state `currentTime`.
  const setCurrentTime = (time) => setCurrentTimeContext(time);
  const getCurrentTime = () => currentTime;


  // === SET THE PROGRESS BAR ACTIONS === //
  // NOTE: To GET/LISTEN if the progress bar were clicked
  // or draged use the state variable `progressBar`
  const setProgressBar = (time) => setProgressBarContext(time);


  return (
    <TimerContext.Provider
      value={{
        getStartStatus,
        start,
        stop,
        getCurrentTime,
        setCurrentTime,
        startStatus,
        currentTime,
        progressBar,
        setProgressBar,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
export { TimerContext };