import React from 'react'
import {Controller} from '../Controller';
import {useState, useEffect} from 'react';

export function ProgressBar() {
  const [_answerString, setAnswerString] = useState();
  const [_questionString, setQuestionString] = useState();

  useEffect(() => {
    const answerProgress = () => {
        var answerString = ""
        for (let index = 0; index < Controller.getNumberOfQuestionsAnswered(); index++) {
            answerString = answerString + "##"
        }
        return answerString;
      }
    
      const questionProgress = () => {
        var questionString = ""
        for (let index = 0; index < Controller.getNumberOfQuestions() - Controller.getNumberOfQuestionsAnswered(); index++) {
            questionString = questionString + ".."
        }
        return questionString;
      }

      setAnswerString(answerProgress());
      setQuestionString(questionProgress());
  }, []);

  return (
    <div><span>[{_answerString + _questionString}]</span></div>
  )
}
