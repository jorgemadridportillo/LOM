import React from 'react'
import {TerminalLine} from './TerminalLine'

export function Terminal({ lines }) {
  return (
    <ul className="lines">
        {lines.map((line, index) => (
            <TerminalLine key={index} line={line}/>
        ))}        
    </ul>
  );
}
