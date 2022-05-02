import {Model} from './Model';

const Controller = {
    currentQuestion: 0,
    model: Model,
    isReady: false,
    setReady: () => Controller.isReady = true,
    getProgress: function() {
        return Controller.currentQuestion / Model.questions.length * 100;
    },
    getNextQuestion: () => {
        const question = Model.questions[Controller.currentQuestion];
        Controller.currentQuestion++;
        return question;
    }
}

export {Controller};