import React from 'react'

export function ChoiceLine({choices}) {
    return (
        <div>
            <li className="choices">
            {'>'} 
            <div>
                {choices.map((choice, index) => {
                    return <span key={index} className={`choice ${choice.active ? "active": ""}`} >{choice.text}</span>
                    })} 
            </div>
            <span className="blink">_</span>
            </li>
        </div>
      )
}
