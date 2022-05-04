import {Model} from './Model';

const Controller = {
    currentQuestion: -1,
    getCurrentQuestionIndex: () => { return Controller.currentQuestion; },
    model: Model,
    isReady: false,
    setReady: () => Controller.isReady = true,
    getNumberOfQuestionsAnswered: () => {
        return Model.userAnswers.length;
    },
    getNumberOfQuestions: () => {
        return Model.questions.length;
    },
    getNextQuestion: () => {
        Controller.currentQuestion++;
        const question = Model.questions[Controller.currentQuestion];
        return question;
    },
    getCorrectAnswerByIndex: (questionIndex) => {
        return Model.getCorrectAnswerByIndex(questionIndex);
    },
    addAnswer: (value) => {
        Model.addAnswer(value);
    },
    getBonus:(questionIndex) => {
        return Model.questions[questionIndex].bonus;
    },
    getNumberOfCorrectAnswers: () => {
        const answers = Model.getAnswers();
        const correctAnswers = answers.filter((answer) => {return answer.correct === true});
        return correctAnswers.length;
    },
    promptTimeout: 2000,
    getPromptTimeout: () => {
        return Controller.promptTimeout;
    },
    reset: () => {
        Controller.currentQuestion = -1;
        Controller.isReady = false;
        Model.userAnswers = [];
    }
}

export {Controller};