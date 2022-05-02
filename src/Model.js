var Model = {
    lines: [{ text: "Welcome human, the test has begun, let the machine gods decide your destiny, good luck..." }],
    questions: [
        { text: "Hello" },
        { text: "World" }
    ],
    answers: [],
    addLine: function(line){
        this.lines.push(line)
    },
    addAnswer: function(answer) {
        this.answers.push(answer);
    }   
}

export {Model};