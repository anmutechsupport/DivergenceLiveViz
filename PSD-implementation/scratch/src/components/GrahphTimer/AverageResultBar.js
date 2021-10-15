import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { Box, Typography } from '@material-ui/core';

const STEP = 0.1;
const MIN = 0;
const MAX = 100;
const COLORS = ['#FF6363', '#FF6363', '#39C86A', '#39C86A'];

// type AverageResultBarProps = {
//   userAverage: number;
//   threshold: number;
// };

const AverageResultBar = ({
  userAverage,
  threshold
}) => {
  const [values, setValues] = useState([0, threshold, 100]);

  const numberToString = () => {
    return `${userAverage}%`;
  };

  return (
    <Box style={{ width: '100%', margin: '2em' }}>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'start',
          flexWrap: 'wrap',
          margin: '1em 2em'
        }}
      >
        <Typography>
          <p>Average Sucess</p>
        </Typography>
      </Box>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          margin: '0.5em 3em'
        }}
      >
        <Range
          disabled
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={values => setValues(values)}
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
                    values,
                    colors: COLORS,
                    min: MIN,
                    max: MAX
                  }),
                  alignSelf: 'center'
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div
              {...props}
              style={{
                ...props.style,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography style={{ marginTop: '40px', marginLeft: '3px' }}>
                <span>{`${values[index]}%`}</span>
              </Typography>
            </div>
          )}
        />

        <Range
          disabled
          step={0.1}
          min={0}
          max={100}
          values={[userAverage]}
          onChange={null}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '0px',
                width: '100%',
                backgroundColor: '#ccc'
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '10px',
                width: '10px',
                backgroundColor: '#773DFF',
                borderRadius: '50px',
                top: '-18px'
              }}
            >
              <Typography style={{ marginLeft: '-8px', marginTop: '-20px' }}>
                <span>{`${userAverage}%`}</span>
              </Typography>
            </div>
          )}
        />
      </Box>
    </Box>
  );
};

export default AverageResultBar;
