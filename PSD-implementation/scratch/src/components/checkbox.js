import React, { useEffect, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';

// export function Checkbox ({color, lineKey, checked, handleChange, id}) {
//     return (
//       <div>
//         <input type="checkbox" defaultChecked={checked} onChange={(e) => handleChange(e, id)} id="check" name="check"/>
//         <label style={{color: color}} htmlFor="check">{lineKey}</label>
//       </div>
//     )
//   }
  
export function Checkbox ({color, lineKey, checked, handleChange, id}) {
    return (
      <ToggleButton onChange={(e) => handleChange(e, id)} selected={checked} name="check">
        <label style={{color: color}} htmlFor="check">{lineKey}</label>
      </ToggleButton>
    )
  }