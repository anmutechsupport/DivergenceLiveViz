import React, { useEffect, memo, useState, useRef, useContext } from 'react';
import useStopwatch from './TimerEngine/useStopwatch';
import { Range, getTrackBackground } from 'react-range';
import { Theme } from '../../../src/theme';
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import Pause from '@material-ui/icons/Pause';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import { TimerContext } from 'src/contexts/TimerContext';

const useStyles = makeStyles((theme) => ({
  root: {},
  clockDigits: {
    textAlign: 'center'
  },
  button: {
    marginLeft: theme.spacing(5),
    backgroundColor: '#259386',
    '&:hover': {
      backgroundColor: '#29A395'
    }
  },
  timerContainer: {
    marginLeft: 15
  },
  timeLegends: {
    color: theme.palette.text.primary
  },
  slider: {
    margin: theme.spacing(3)
  }
}));

// type TimerProps = {
//   duration: number; //in seconds.
// };

const getDisplayTime = (durationInSeconds) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const mins = Math.floor((durationInSeconds - hours * 3600) / 60);
  const secs = durationInSeconds - hours * 3600 - mins * 60;
  const displayMin = mins < 10 ? '0' + mins : mins;
  const displaySec = secs < 10 ? '0' + secs : secs;
  return displayMin + ':' + displaySec;
};

const Timer = memo(({ duration }) => {
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    reset,
    setCustomTime
  } = useStopwatch({
    autoStart: false
  });

  const {setCurrentTime, stop: stopContext, start: startContext, setProgressBar } = useContext(TimerContext); //note Timer component sets progressBar 

  const [progress, setProgress] = useState(0);

  const [timeString, setTimeString] = useState();
  const [end, setEnd] = useState<boolean>(false);

  const classes = useStyles();

  useEffect(() => {
    const maxTime = getDisplayTime(duration);
    setTimeString(maxTime);
    setEnd(false);
    // start(); this was starting the timer with the graph but was just a coincindence.
  }, []);

  useEffect(() => {
    const secondsFromMinutes = minutes * 60;
    const currentRunningTimeInSeconds = secondsFromMinutes + seconds;
    const progressPercentage = (currentRunningTimeInSeconds / duration) * 100;
    setProgress(progressPercentage);
    setCurrentTime(currentRunningTimeInSeconds);

    if (currentRunningTimeInSeconds >= duration) {
      pause();
      setEnd(true);
      return;
    }

    end && setEnd(false);
  }, [minutes, seconds]);

  const handleReset = () => {
    const maxTime = getDisplayTime(duration);
    setEnd(false);
    reset(null, false);
  };

  const progressClick = (percentage) => {
    pause();
    stopContext();
    const timeClick = Math.ceil(duration * (percentage / 100));
    setCustomTime(timeClick);
    setProgressBar(timeClick);
  };

  const handlePause = () => {
    pause();
    stopContext();
  };

  const handleStart = () => {
    start();
    startContext();
  }

  const progressBarRef = useRef();

  return (
    <Box>
      <Grid direction="column">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="flex-end"
          pb={1}
          className={classes.timerContainer}
        >
          {!end ? (
            <Box className={classes.clockDigits}>
              <Typography variant="h6" className={classes.timeLegends}>
                Elapsed
              </Typography>
              <Typography variant="h2">
                <span>{minutes >= 10 ? minutes : `0${minutes}`}</span>
                <span>:</span>
                <span>{seconds >= 10 ? seconds : `0${seconds}`}</span>
              </Typography>
            </Box>
          ) : (
            <Box className={classes.clockDigits}>
              <Typography variant="h6" className={classes.timeLegends}>
                Elapsed
              </Typography>
              <Typography variant="h2">{timeString}</Typography>
            </Box>
          )}
          <Typography variant="h2">/</Typography>

          <Box className={classes.clockDigits}>
            <Typography variant="h6">Duration</Typography>
            <Typography variant="h2">{timeString}</Typography>
          </Box>
          <Box>
            {isRunning ? (
              <Button
                onClick={handlePause}
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Pause />}
              >
                Pause
              </Button>
            ) : (
              <Button
                onClick={handleStart}
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<PlayArrowOutlinedIcon />}
                disabled={end}
              >
                Start
              </Button>
            )}
          </Box>
        </Box>
      </Grid>

      <div className={classes.slider}>
        <Range
          step={0.1}
          min={0}
          max={100}
          values={[progress]}
          onChange={values => progressClick(values[0])}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%'
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: [progress],
                    colors: ['#6A6DCD', '#B8D3F5'], //track color
                    min: 0,
                    max: 100
                  }),
                  alignSelf: 'center'
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '15px',
                width: '15px',
                backgroundColor: '#6A6DCD', //position color
                borderRadius: '50px'
              }}
            />
          )}
        />
      </div>
    </Box>
  );
});

export default Timer;
