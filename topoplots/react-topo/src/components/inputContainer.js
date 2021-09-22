import React, { useEffect, useState } from 'react';
import './style.css';

export function InputContainer({handleChange}) {
 
    return (
        <div style={{textAlign: 'left'}}>
            <label htmlFor="tentacles">Grid Dimension:</label>

            <input type="number" id="tentacles" name="tentacles" min="11" max="30" defaultValue={20} onChange={(e) => handleChange(e)}/>

        </div>
    );
  };
  