import React from 'react';
import {TerminalLine} from './TerminalLine';
import {useState, useEffect} from 'react';
import {EventEmitter} from '../EventEmitter.js';
import {Controller} from '../Controller';

export function Terminal() {

  const [lines, setLines] = useState([{ text: "Welcome human, the test has begun, let the machine gods decide your destiny, good luck..." , type:"text"}]);

  useEffect(() => {
    EventEmitter.subscribe('questionAnswered', (event) => {
      if(!Controller.isReady) { return; }

      const nextQuestion = Controller.getNextQuestion();
      const currentQuestionIndex = Controller.getCurrentQuestionIndex();

      var nextLine = { text: nextQuestion.text, type: "text"};
      var inputLine = {text: "", questionIndex: currentQuestionIndex, type: "input"};
      if(nextQuestion.choices) {
          const choices = nextQuestion.choices.map((choice) => { return {text: choice, active: false}});
          choices[0].active = true;
          inputLine.choices = choices;
          inputLine.type = "choices";
      }
      //var userAnswer = 
      setLines((prevLines) => {
        return [...prevLines, nextLine, inputLine];
      });

    });

    setTimeout(() => {
      var userLine = { text: "Press ENTER to continue", type: "prompt" };
      setLines((prevLines) => {
        return [...prevLines, userLine];
      });
      Controller.setReady();
    }, 2000);
  }, []);

  return (
    <ul className="lines">
        {lines.map((line, index) => (
            <TerminalLine key={index} line={line} type={line.type} isCurrentLine={ line.questionIndex === Controller.getCurrentQuestionIndex()}/>
        ))}        
    </ul>
  );
}
