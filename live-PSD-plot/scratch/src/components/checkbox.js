import React, { useEffect, useState } from 'react';

export function Checkbox ({color, lineKey}) {
    return (
      <div>
        <input type="checkbox" id="horns" name="horns"/>
        <label style={{color: color}} htmlFor="horns">{lineKey}</label>
      </div>
    )
  }
  