import { Electrode } from "./electrode";
import { InterpolatedPoint } from "./interpolatedPoint";
import Device from "./Device";
import "./style.css";
import React, { useEffect, useState } from "react";

export function Montage({ gridSize, rgbVal }) {
  const [electrodeList, setElectrodeList] = useState([]);
  const [interPlist, setInterpoints] = useState([]);

  useEffect(() => {
    console.log(rgbVal);
    const electrodes = [];
    const electrodeProps = [
      [1, "top", "left"],
      [2, "top", "right"],
      [3, "middle", "left"],
      [4, "middle", "right"],
      [5, "third", "left"],
      [6, "third", "right"],
      [7, "bottom", "left"],
      [8, "bottom", "right"],
    ];

    let i = 0;
    for (const prop of electrodeProps) {
      electrodes.push(
        <Electrode
          number={prop[0]}
          vertical={prop[1]}
          horizontal={prop[2]}
          key={i}
        />
      );
      i++;
    }

    const interpoints = [];
    if (rgbVal) {
      // console.log(rgbVal)
      const rgb = rgbVal.slice();
      if (gridSize * gridSize === rgb.length) {
        for (let i = 0; i < gridSize * gridSize; i++) {
          interpoints.push(
            <InterpolatedPoint
              gridSize={gridSize}
              number={i}
              color={rgb[i]}
              key={i}
            />
          );
        }
      }

      setInterpoints(interpoints);
    }

    setElectrodeList(electrodes);
  }, [rgbVal, gridSize]);

  return (
    //   <section className="topoplot-wrapper">
    //       <Device
    //         channels={[
    //         { name: 'F5', selected: true, disabled: false },
    //         { name: 'F6', selected: true, disabled: false },
    //         { name: 'T7', selected: false, disabled: true },
    //         { name: 'T8', selected: false, disabled: true },
    //         { name: 'C3', selected: true, disabled: false },
    //         { name: 'C4', selected: true, disabled: false },
    //         { name: 'CP3', selected: true, disabled: false },
    //         { name: 'CP4', selected: true, disabled: false },
    //         { name: 'PO3', selected: true, disabled: false },
    //         { name: 'PO4', selected: true, disabled: false },
    //         ]}
    //         setChannels={() => []}
    //     />
    //     <aside className="topoplot-grid">{interPlist}</aside>
    //   </section>
    <section>
        <Device
          channels={[
          { name: 'F5', selected: true, disabled: false },
          { name: 'F6', selected: true, disabled: false },
          { name: 'T7', selected: false, disabled: true },
          { name: 'T8', selected: false, disabled: true },
          { name: 'C3', selected: true, disabled: false },
          { name: 'C4', selected: true, disabled: false },
          { name: 'CP3', selected: true, disabled: false },
          { name: 'CP4', selected: true, disabled: false },
          { name: 'PO3', selected: true, disabled: false },
          { name: 'PO4', selected: true, disabled: false },
          ]}
          setChannels={() => []}
          interPlist={interPlist}
        />
    
    </section>
    //   <section className="topoplot-wrapper">
    //      {electrodeList}
   
    //      <aside className="topoplot-grid">{interPlist}</aside>
    //    </section>
    

  );
}
