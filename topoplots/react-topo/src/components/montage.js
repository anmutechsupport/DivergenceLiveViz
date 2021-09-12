import { Electrode } from './components/electrode';
import { InterpolatedPoint } from './components/interpolatePoint';

import React, { useEffect, useState } from 'react';

export function Montage(color, number) {
    // const [color, setColor] = useState([]);
 
    return (
        <div style={"color:" + color} class={"topoplot-u"+number}></div>
    );
  };
  