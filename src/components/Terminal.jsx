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

    var answerLine={}
    if(lastQuestionIndex >= 0) {
      const lastQuestionLine = lines.find((line) => {  return line.questionIndex === lastQuestionIndex;});
      answerLine.type = "text";
      var correctAnswer = Controller.getCorrectAnswerByIndex(lastQuestionLine.questionIndex);
      var answerToSave = {text: answerText, correct: false};

      if(lastQuestionLine && lastQuestionLine.type === "text") {
        var answerText = lastQuestionLine.text;
        if(answerText === correctAnswer) {
          answerLine.text = Controller.getBonus(lastQuestionLine.questionIndex);
          answerToSave.correct = true;
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
            answerToSave.correct = true;
          } else {
            answerLine.text = "Incorrect!, the correct answer was: " + choices[correctAnswer].text;
          }
        }
      }
      Controller.addAnswer(answerToSave);
    }

    if(nextQuestion === undefined) { 
      // Last question done, show results
      const numberOfCorrectAnswer = Controller.getNumberOfCorrectAnswers();
      var lastLine = {type: "text", text: ""};
      if(numberOfCorrectAnswer > 5) {
        lastLine.text = `You got ${numberOfCorrectAnswer} questions correct, humanity might be saved for this time...but the machines will end up winning some day, you can go back in time now...`;
      } else {
        lastLine.text = `You got ${numberOfCorrectAnswer} questions correct, your weak human intelligence was obviously not enough for this test!, machines will prevail forever, brace yourself for complete human destruction!`;
      }
      setLines((prevLines) => {
        return [...prevLines, answerLine, lastLine];
      });
      return; 
    }

    var nextLine = { text: nextQuestion.text, type: "text"};
    var inputLine = {text: "", questionIndex: currentQuestionIndex, type: nextQuestion.type, answer: nextQuestion.answer};
    if(nextQuestion.type === 'choices') {
        const choices = nextQuestion.choices.map((choice) => { return {text: choice, active: false}});
        choices[0].active = true;
        inputLine.choices = choices;
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
