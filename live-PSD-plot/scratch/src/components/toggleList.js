import { Checkbox } from './checkbox';
import React, { useEffect, useState } from 'react';
import './psd.css';

export function ToggleList({lineKeys, colors, toggleLines, handleChange}) {
    // console.log(toggleLines)
    let checkBoxList = []
    if (lineKeys) {
        for (let i=0; i<toggleLines.length; i++) {
            checkBoxList.push( <Checkbox checked={toggleLines[i]} color={colors[i]} key={lineKeys[i]} lineKey={lineKeys[i]} handleChange={handleChange} id={i} />)
        }
    }

    return (
        <div className="toggle-list">
            {checkBoxList}
        </div>
    )
}