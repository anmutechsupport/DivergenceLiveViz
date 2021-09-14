import React, { useEffect, useState } from 'react';
import './style.css';

export function InterpolatedPoint({color, number}) {
    // const [color, setColor] = useState([]);
 
    return (
        <div style={{ background: `rgb(${color})` }} className={"topoplot-u"+number}></div>
    );
  };
  