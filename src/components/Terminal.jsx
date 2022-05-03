import React from 'react';
import {TerminalLine} from './TerminalLine';
import {useState, useEffect} from 'react';
import {EventEmitter} from '../EventEmitter.js';
import {Controller} from '../Controller';

export function Terminal() {

  const [lines, setLines] = useState([{ text: "Welcome human, the test has begun, let the machine gods decide your destiny, good luck..." , type:"text"}]);


  
  EventEmitter.subscribe('questionAnswered', (event) => {
    EventEmitter.unsubscribe('questionAnswered');
    if(!Controller.isReady) { return; }

    const lastQuestionIndex = Controller.getCurrentQuestionIndex();
    const nextQuestion = Controller.getNextQuestion();
    const currentQuestionIndex = Controller.getCurrentQuestionIndex();
    if(nextQuestion === undefined) { return; }

    var nextLine = { text: nextQuestion.text, type: "text"};
    var inputLine = {text: "", questionIndex: currentQuestionIndex, type: nextQuestion.type, answer: nextQuestion.answer};
    if(nextQuestion.type === 'choices') {
        const choices = nextQuestion.choices.map((choice) => { return {text: choice, active: false}});
        choices[0].active = true;
        inputLine.choices = choices;
    }

    var answerLine={}
    if(lastQuestionIndex >= 0) {
      const lastQuestionLine = lines.find((line) => {  return line.questionIndex === lastQuestionIndex;});
      answerLine.type = "text";
      var correctAnswer = Controller.getCorrectAnswerByIndex(lastQuestionLine.questionIndex);

      if(lastQuestionLine && lastQuestionLine.type === "text") {
        var answerText = lastQuestionLine.text;
        Controller.addAnswer(answerText);
        if(answerText === correctAnswer) {
          answerLine.text = Controller.getBonus(lastQuestionLine.questionIndex);
        } else {
          answerLine.text = "Incorrect!, the correct answer was: " + correctAnswer;
        }
      } else if (lastQuestionLine && lastQuestionLine.type === "choices") {
        var choices = lastQuestionLine.choices;
        var activeChoiceIndex = 0;
        var found = choices.some((choice, index) => { activeChoiceIndex = index; return choice.active === true });
        if(found) {
          if(activeChoiceIndex === correctAnswer) {
            answerLine.text = Controller.getBonus(lastQuestionLine.questionIndex);
          } else {
            answerLine.text = "Incorrect!, the correct answer was: " + choices[correctAnswer].text;
          }
        }
      }
    }

    setLines((prevLines) => {
      return [...prevLines, answerLine, nextLine, inputLine];
    });

  });

  useEffect(() => {
    setTimeout(() => {
      var userLine = { text: "Press ENTER to continue", type: "prompt" };
      EventEmitter.unsubscribe('questionAnswered');
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
