import React, { useEffect, useState } from 'react';
import './style.css';

export function Electrode({number, vertical, horizontal}) {
    // const [color, setColor] = useState([]);

    const classVal = `topoplot-c${number} ${vertical} ${horizontal}`
    // console.log(classVal)
 
    return (
        <article className={classVal}></article>
    );
  };
  