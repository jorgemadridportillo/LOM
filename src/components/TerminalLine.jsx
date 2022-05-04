import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {EventEmitter} from '../EventEmitter.js';
import { ChoiceLine } from './ChoiceLine.jsx';
import { ProgressBar } from './ProgressBar.jsx';

export function TerminalLine({ line, isCurrentLine, type, onQuestionAnswered }) {
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
    // Is the last question line on the terminal
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
        if(type === 'input') {
          const answerText = answerInput.current.value;
          if(answerText !== "") {
            line.text = answerText;
            line.type = "text";
            setText(answerText);

            EventEmitter.unsubscribe('rightKey');
            EventEmitter.unsubscribe('leftKey');
            EventEmitter.unsubscribe('enterKey');
            onQuestionAnswered();
          }
        }else {
          EventEmitter.unsubscribe('rightKey');
          EventEmitter.unsubscribe('leftKey');
          EventEmitter.unsubscribe('enterKey');
          onQuestionAnswered();
        }
        
      });
    } else if (type === 'prompt') {
      EventEmitter.subscribe('enterKey', (event) => {
        EventEmitter.unsubscribe('enterKey');
        onQuestionAnswered();
      });
    }
  // eslint-disable-next-line
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
    const l = e.target.value.length + 3;
    setWidth(l*8 + "px");
  }
  
  if(type === 'text' || type === 'prompt') {
    return (
      <div>
        <li>{'>'} {_text} <span className="blink">_</span></li>
        <ProgressBar></ProgressBar>
      </div>
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
