import React from 'react';
import {useState, useEffect} from 'react';
import {EventEmitter} from '../EventEmitter.js';

export function TerminalLine({ line, isCurrentLine }) {
  const { text, choices } =  line;
  const [_choices, setChoices] = useState(choices);
  const [width, setWidth] = useState("10px");
  const [input, setInput] = useState('');

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

    if(isCurrentLine) {
      EventEmitter.subscribe('rightKey', (event) => {
        scrollChoice(1);
      });
  
      EventEmitter.subscribe('leftKey', (event) => {
        scrollChoice(-1);
      });
    }

    EventEmitter.subscribe('enterKey', (event) => {
      EventEmitter.unsubscribe('rightKey');
      EventEmitter.unsubscribe('leftKey');

      
    });
  }, []);

  const handleKeyPress = (e) => {
    const l = e.target.value.length + 2;
    setWidth(l*7 + "px");
  }
  
  if(!_choices && text !== '') {
    return (
      <li>{'>'} {text} <span className="blink">_</span></li>
    )
  } else if(!_choices && text === '') {
    return (
      <li>{'>'} <input value={input} onInput={e => setInput(e.target.value)} disabled={isCurrentLine === false} onKeyDown={(e) => handleKeyPress(e)} style={{width: width}}type="text"></input> <span className="blink">_</span></li>
    )
  } else {
    return (
      <li>{'>'} 
      {_choices.map((choice, index) => {
        return <span key={index} className={`choice ${choice.active ? "active": ""}`} >{choice.text}</span>
      })} 
        <span className="blink">_</span>
      </li>
    )
  }

}
