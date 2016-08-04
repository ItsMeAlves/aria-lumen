var five = require("johnny-five");
var board = null;
var redPin = 8;
var greenPin = 9;
var bluePin = 10;

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
        socket.emit("pins", {
            redPin: redPin,
            greenPin: greenPin,
            bluePin: bluePin
        });

        socket.emit("boardStatus", boardStatus());

        socket.on("pins", (data) => {
            redPin = data.redPin;
            greenPin = data.greenPin;
            bluePin = data.bluePin
        });

        socket.on("sample", (c) => {
            if(boardStatus().ready) {
                board.analogWrite(redPin, c.red);
                board.analogWrite(greenPin, c.green);
                board.analogWrite(bluePin, c.blue);
            }
        });
    });    
}


