import { Electrode } from './electrode';
import { InterpolatedPoint } from './interpolatedPoint';
import './style.css';
import { io }  from 'socket.io-client';

import React, { useEffect, useState } from 'react';

export function Montage({gridSize}) {
    const [rgbVal, setRgb] = useState();
    const [electrodeList, setElectrodeList] = useState([]);
    const [interPlist, setInterpoints] = useState([]);

    const getRGB = () => {
        const socket = io('http://localhost:4000', {
        transports: ['websocket', 'polling']
        });

        socket.on('rgb', rgb => {

            setRgb(rgb)

        });
    
    }

    useEffect(() => {
        getRGB();
    
    }, []);

    useEffect(() => {

        // console.log(rgbVal)
        const electrodes = []
        const electrodeProps = [[1, "top", "left"], [2, "top", "right"], [3, "middle", "left"], [4, "middle", "right"], [5, "third", "left"], [6, "third", "right"], [7, "bottom", "left"], [8, "bottom", "right"]]
        
        let i = 0;
        for (const prop of electrodeProps) {
            electrodes.push( <Electrode number={prop[0]} vertical={prop[1]} horizontal={prop[2]} key={i} /> )
            i++;
        }
    
        const interpoints = []
        for (let i=0; i<gridSize*gridSize; i++) {
            if (rgbVal) {
                interpoints.push( <InterpolatedPoint gridSize={gridSize} number={i} color={rgbVal[i]} key={i} /> )
            }
        }

        setElectrodeList(electrodes);
        setInterpoints(interpoints);

    }, [rgbVal])

    return (
        <section className="topoplot-wrapper">
            {electrodeList}

            <aside className="topoplot-grid">
                {interPlist}
            </aside>

        </section>
    );
  };
  