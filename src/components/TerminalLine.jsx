import React from 'react'

export function TerminalLine({ line }) {
  const { text } =  line;
  return (
    <li>{'>'} {text} <span className="blink">_</span></li>
  )
}
