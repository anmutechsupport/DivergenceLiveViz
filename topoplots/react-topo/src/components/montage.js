import { Electrode } from './electrode';
import { InterpolatedPoint } from './interpolatedPoint';
import './style.css';

import React, { useEffect, useState } from 'react';

export function Montage({gridSize}) {
    const electrodes = []
    const electrodeProps = [[1, "top", "left"], [2, "top", "right"], [3, "middle", "left"], [4, "middle", "right"], [5, "third", "left"], [6, "third", "right"], [7, "bottom", "left"], [8, "bottom", "right"]]
    
    let i = 0;
    for (const prop of electrodeProps) {
        electrodes.push( <Electrode number={prop[0]} vertical={prop[1]} horizontal={prop[2]} key={i} /> )
        i++;
    }


    const interpoints = []
    for (let i=0; i<gridSize; i++) {
        interpoints.push( <InterpolatedPoint number={i} color={"gray"} key={i} /> )
    }

    return (
        <section className="topoplot-wrapper">
            {electrodes}

            <aside className="topoplot-grid">
                {interpoints}
            </aside>

        </section>
    );
  };
  