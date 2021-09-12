import React, { useEffect, useState } from 'react';
import './style.css';

export function InterpolatedPoint(color, number) {
    // const [color, setColor] = useState([]);
 
    return (
        <div style={"color:" + color} class={"topoplot-u"+number}></div>
    );
  };
  