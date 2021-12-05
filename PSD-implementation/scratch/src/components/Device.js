import React from 'react';
import {
  Box,
  makeStyles
} from '@material-ui/core';
import "./style.css";

const useStyles = makeStyles(() => ({
  channel: {
    height: 30,
    width: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 33,
    fontSize: 10,
    color: 'black',
    zIndex: 10,
    cursor: 'pointer'
  }
}))

const Device = ({
  channels,
  setChannels,
  interPlist,
}) => {

  const classes = useStyles();

  const handleClick = (num) => {
    let temp = [...channels];
    if (!temp[num].disabled) {
      temp[num].selected = !temp[num].selected;
    }
    setChannels([...temp])
  }

  return (
    <Box>
      <div style={{position: 'relative', height: 260, width: 260, borderRadius: 260, border: '1px solid black', display: 'flex',justifyContent: 'center', alignItems: 'center'}}>
        {/* big circle */}
        <div style={{position: 'absolute', height: 260, width: 0, border: '1px dashed black'}} />
        {/* vert line */}
        <div style={{position: 'absolute', height: 0, width: 260, border: '1px dashed black'}} />
        {/* horiz line */}
        <div style={{position: 'absolute', height: 220, width: 220, borderRadius: 220, border: '1px dashed black'}} />
        {/* smol circle */}
        <Box width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center" pt={4} px={6}> 
          {/* pt = padding top, px = padding left and right */}
            <div
              className={classes.channel}
              style={{
                background: !channels[0].disabled
                ? channels[0].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(0)}
            >
              F5
            </div>
            <div
              className={classes.channel}
              style={{
                background: !channels[1].disabled
                ? channels[1].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(1)}
            >
              F6
            </div>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} px={1}>
            <div
              className={classes.channel}
              style={{
                background: !channels[2].disabled
                ? channels[2].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(2)}
            >
              T7
            </div>
            <div
              className={classes.channel}
              style={{
                background: !channels[4].disabled
                ? channels[4].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(4)}
            >
              C3
            </div>
            <div
              className={classes.channel}
              style={{
                background: !channels[5].disabled
                ? channels[5].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(5)}
            >
              C4
            </div>
            <div
              className={classes.channel}
              style={{
                background: !channels[3].disabled
                ? channels[3].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(3)}
            >
              T8
            </div>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" pt={1} px={7}>
            <div
              className={classes.channel}
              style={{
                background: !channels[6].disabled
                ? channels[6].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(6)}
            >
              CP3
            </div>
            <div
              className={classes.channel}
              style={{
                background: !channels[7].disabled
                ? channels[7].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(7)}
            >
              CP4
            </div>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} px={7}>
            <div
              className={classes.channel}
              style={{
                background: !channels[8].disabled
                ? channels[8].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(8)}
            >
              PO3
            </div>
            <div
              className={classes.channel}
              style={{
                background: !channels[9].disabled
                ? channels[9].selected
                ? '#98FFA2'
                : '#C4C4C4'
                : '#B5E3FF',
              }}
              onClick={() => handleClick(9)}
            >
              PO4
            </div>
          </Box>
        </Box>
        <aside className="topoplot-grid">{interPlist}</aside>
      </div>
    </Box>
  )
}

export default Device;