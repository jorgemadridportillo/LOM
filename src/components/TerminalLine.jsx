import React from 'react';
import {useState, useEffect} from 'react';
import {EventEmitter} from '../EventEmitter.js';

export function TerminalLine({ line }) {
  const { text, choices } =  line;
  const [_choices, setChoices] = useState(choices);

  useEffect(() => {
      const scrollChoice = (num) => {
        const mod = (n, m) => {
            return ((n % m) + m) % m;
        }
        if(_choices) {
            let newChoices = [..._choices];
            var activeChoiceIndex = 0;
            var found = newChoices.some((choice, index) => { activeChoiceIndex = index; return choice.active === true });

            if (!found) {
                return false;
            } else {
                const numberOfChoices = _choices.length;
                newChoices[activeChoiceIndex].active = false;
                newChoices[mod(activeChoiceIndex + num, numberOfChoices)].active = true;
            }
            setChoices(newChoices);
        }
    }

    EventEmitter.subscribe('rightKey', (event) => {
      scrollChoice(1);
    });

    EventEmitter.subscribe('leftKey', (event) => {
      scrollChoice(-1);
    });

    EventEmitter.subscribe('enterKey', (event) => {
      EventEmitter.unsubscribe('rightKey');
      EventEmitter.unsubscribe('leftKey');
    });
  }, []);
  
  if(!choices) {
    return (
      <li>{'>'} {text} <span className="blink">_</span></li>
    )
  } else {
    return (
      <li>{'>'} 
      {choices.map((choice, index) => {
        return <span key={index} className={`choice ${choice.active ? "active": ""}`} >{choice.text}</span>
      })} 
        <span className="blink">_</span>
      </li>
    )
  }

}
