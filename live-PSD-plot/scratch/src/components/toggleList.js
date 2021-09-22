import { Checkbox } from './checkbox';
import React, { useEffect, useState } from 'react';
import './psd.css';

export function ToggleList({lineKeys, colors, toggleLines, handleChange}) {
    // console.log(toggleLines)
    let checkBoxList = []
    if (lineKeys) {
        // console.log(toggleLines.length)
        for (let i=0; i<toggleLines.length; i++) {
            // console.log(lineKeys[i])
            checkBoxList.push( <Checkbox checked={toggleLines[i]} color={colors[i]} key={i} lineKey={lineKeys[i]} handleChange={handleChange} id={i} />)
        }
    }

    return (
        <div style={{backgroundColor: "#ABBAEA"}}className="toggle-list">
            {checkBoxList}
        </div>
    )
}