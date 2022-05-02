import React from 'react';
import {TerminalLine} from './TerminalLine';
import {useState, useEffect} from 'react';
import {EventEmitter} from '../EventEmitter.js';
import {Controller} from '../Controller';

export function Terminal() {

  const [lines, setLines] = useState([{ text: "Welcome human, the test has begun, let the machine gods decide your destiny, good luck..." }]);

  useEffect(() => {
    EventEmitter.subscribe('enterKey', (event) => { // TODO Only the current questions listens the ENTER EVENT and triggers another event that the question is completed with the answer (choice, text...) Then the lines are updated and the Controller updates the model with the answer
      if(!Controller.isReady) { return; }

      const nextQuestion = Controller.getNextQuestion();
      var nextLine = { text: nextQuestion.text };
      var choiceLine = {text: ""};
      if(nextQuestion.choices) {
          const choices = nextQuestion.choices.map((choice) => { return {text: choice, active: false}});
          choices[0].active = true;
          choiceLine = {text: "", choices: choices};
      }
      setLines((prevLines) => {
        console.log(prevLines);
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
            <TerminalLine key={index} line={line} isCurrentLine={ index === lines.length - 1}/>
        ))}        
    </ul>
  );
}
