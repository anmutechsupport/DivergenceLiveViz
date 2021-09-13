import { Checkbox } from './checkbox';
import React, { useEffect, useState } from 'react';
import './psd.css';

export function ToggleList({lineKeys, colors}) {
    // console.log(colors)
    let checkBoxList = []
    if (lineKeys) {
        for (let i=0; i<colors.length; i++) {
            checkBoxList.push( <Checkbox color={colors[i]} key={lineKeys[i]} lineKey={lineKeys[i]} />)
        }
    }

    return (
        <div className="toggle-list">
            {checkBoxList}
        </div>
    )
}