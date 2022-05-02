import {Model} from './Model';

var Controller = {
    currentQuestion: 0,
    getProgress: function() {
        return 0;
    },
    model: Model,
    showNextQuestion: function() {
    },
    getLines: () => Model.lines,
    addLine: function(line) {
        Model.lines = [...Model.lines, line]
    },
    promptUser: function() {
        var line = { text: "Press ENTER to continue" };
        Controller.addLine(line);
    },
    setReady: () => Controller.isReady = true,
    isReady: false,
    nextLine: () => Controller.addLine({ text: "" })
}

export {Controller};