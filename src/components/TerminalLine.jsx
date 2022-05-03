import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {EventEmitter} from '../EventEmitter.js';
import { ChoiceLine } from './ChoiceLine.jsx';

export function TerminalLine({ line, isCurrentLine, type }) {
  const { text, choices } =  line;
  const [_choices, setChoices] = useState(choices);
  const [_text, setText] = useState(text);
  const [width, setWidth] = useState("10px");
  const [input, setInput] = useState('');
  const answerInput = useRef(null);

  useEffect(() => {
      const scrollChoice = (num) => {
        const mod = (n, m) => {
            return ((n % m) + m) % m;
        }
        if(_choices) {
            setChoices((previousChoices) => {
              let newChoices = [...previousChoices];
              var activeChoiceIndex = 0;
              var found = previousChoices.some((choice, index) => { activeChoiceIndex = index; return choice.active === true });
  
              if (!found) {
                  return false;
              } else {
                  const numberOfChoices = _choices.length;
                  newChoices[activeChoiceIndex].active = false;
                  newChoices[mod(activeChoiceIndex + num, numberOfChoices)].active = true;
              }
              return newChoices;
            }); 
        }
    }

    if(isCurrentLine) {
      EventEmitter.subscribe('rightKey', (event) => {
        scrollChoice(1);
      });
  
      EventEmitter.subscribe('leftKey', (event) => {
        scrollChoice(-1);
      });

      if(type === 'input') {
        answerInput.current.focus();
      }
      EventEmitter.subscribe('enterKey', (event) => {
        EventEmitter.unsubscribe('rightKey');
        EventEmitter.unsubscribe('leftKey');
        EventEmitter.unsubscribe('enterKey');

        if(type === 'input') {
          setText(answerInput.current.value);
          line.text = answerInput.current.value;
          line.type = "text";
        }
        
        EventEmitter.dispatch('questionAnswered');
      });
    } else if (type === 'prompt') {
      EventEmitter.subscribe('enterKey', (event) => {
        EventEmitter.unsubscribe('enterKey');
        EventEmitter.dispatch('questionAnswered');
      });
    }

  }, []);

  const handleKeyDown = (e) => {
    if(!isNaN(line.answer)) {
      if(e.key !== "Backspace") {
        if (!/[0-9.]|[\b]/.test(e.key)) {
          e.preventDefault();
          return;
        }
      }
    }
    const l = e.target.value.length + 2;
    setWidth(l*7 + "px");
  }
  
  if(type === 'text' || type === 'prompt') {
    return (
      <li>{'>'} {_text} <span className="blink">_</span></li>
    )
  } else if(type === 'input') {
    return (
      <li>{'>'} <input ref={answerInput} value={input} onInput={e => setInput(e.target.value)} disabled={isCurrentLine === false} onKeyDown={(e) => handleKeyDown(e)} style={{width: width}}type="text"></input> <span className="blink">_</span></li>
    )
  } else if(type === 'choices') {
    return (
      <ChoiceLine choices={_choices}></ChoiceLine>
    )
  }
}
