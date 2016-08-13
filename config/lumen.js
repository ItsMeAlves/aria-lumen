var five = require("johnny-five");
var board = null;

function boardStatus() {
    return {
        ready: (board != null && board.isReady)
    };
}

module.exports = (io) => {
    board = new five.Board({
        repl: true
    });
    board.on("ready", () => {
        console.log("Good news, Lumen! There is an arduino!");
        io.emit("boardStatus", boardStatus());

    });
    board.on("error", () => {
        process.exit(0);
        io.emit("boardStatus", boardStatus());
    });

    io.on("connection", socket => {
        console.log("Aria, we have visitors!");

        socket.emit("boardStatus", boardStatus());

        socket.on("sample", (c) => {

            if(boardStatus().ready) {
                board.pinMode(c.redPin, five.Pin.PWM);
                board.pinMode(c.greenPin, five.Pin.PWM);
                board.pinMode(c.bluePin, five.Pin.PWM);
                board.analogWrite(c.redPin, c.red);
                board.analogWrite(c.greenPin, c.green);
                board.analogWrite(c.bluePin, c.blue);
            }
            else {
                console.log("sample");
            }
        });
    });
}
