import {Model} from './Model';

const Controller = {
    currentQuestion: -1,
    getCurrentQuestionIndex: () => { return Controller.currentQuestion; },
    model: Model,
    isReady: false,
    setReady: () => Controller.isReady = true,
    getProgress: function() {
        return Controller.currentQuestion / Model.questions.length * 100;
    },
    getNextQuestion: () => {
        Controller.currentQuestion++;
        const question = Model.questions[Controller.currentQuestion];
        return question;
    }
}

export {Controller};