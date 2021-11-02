import React, { useEffect, useState } from 'react';
import './style.css';

export function InterpolatedPoint({gridSize, color, number}) {
    // const [color, setColor] = useState([]);

    const styling = {
        backgroundColor: `rgb(${color})`,
        width: `${100/gridSize}%`,
        height: `${100/gridSize}%`,
      };
 
    return (
        <div style={styling} className={"topoplot-u"+number}></div>
    );
  };
  