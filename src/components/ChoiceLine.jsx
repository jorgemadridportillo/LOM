import React from 'react'

export function ChoiceLine({choices}) {
    return (
        <li>{'>'} 
        {choices.map((choice, index) => {
          return <span key={index} className={`choice ${choice.active ? "active": ""}`} >{choice.text}</span>
        })} 
          <span className="blink">_</span>
        </li>
      )
}
