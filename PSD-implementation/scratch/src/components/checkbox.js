import React, { useEffect, useState } from 'react';

export function Checkbox ({color, lineKey, checked, handleChange, id}) {
    return (
      <div>
        <input type="checkbox" defaultChecked={checked} onChange={(e) => handleChange(e, id)} id="check" name="check"/>
        <label style={{color: color}} htmlFor="check">{lineKey}</label>
      </div>
    )
  }
  