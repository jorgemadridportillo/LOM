import React from 'react';
import {TerminalLine} from './TerminalLine';
import {useState, useEffect} from 'react';
import {EventEmitter} from '../EventEmitter.js';
import {Controller} from '../Controller';

export function Terminal() {

  const [lines, setLines] = useState([{ text: "Welcome human, the test has begun, let the machine gods decide your destiny, good luck..." }]);

  useEffect(() => {
    EventEmitter.subscribe('enterKey', (event) => {
      if(!Controller.isReady) { return; }

      const nextQuestion = Controller.getNextQuestion();
      var nextLine = { text: nextQuestion.text };
      var choiceLine = {}
      if(nextQuestion.choices) {
          const choices = nextQuestion.choices.map((choice) => { return {text: choice, active: false}});
          choices[0].active = true;
          choiceLine = {text: "", choices: choices};
      }
      setLines((prevLines) => {
        return [...prevLines, nextLine, choiceLine];
      });

    });

    setTimeout(() => {
      var userLine = { text: "Press ENTER to continue" };
      setLines((prevLines) => {
        return [...prevLines, userLine];
      });
      Controller.setReady();
    }, 2000);
  }, []);

  return (
    <ul className="lines">
        {lines.map((line, index) => (
            <TerminalLine key={index} line={line}/>
        ))}        
    </ul>
  );
}
