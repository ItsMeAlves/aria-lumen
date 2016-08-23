/*
 * Lumen - It takes Aria data and use it to control an Arduino board
 */

// Uses Johnny Five package to handle an Arduino board
var five = require("johnny-five");
var board = null;

// Function to return some board status
function boardStatus() {
    return {
        ready: (board != null && board.isReady)
    };
}

// Exports a function that gets an socket.io instance
module.exports = (io) => {
    // Creates a board object to find any attached device
    board = new five.Board({
        repl: false
    });

    // When board is okay, it emits boardStatus event to all clients connected
    board.on("ready", () => {
        console.log("Good news, Lumen! There is an arduino!");
        io.emit("boardStatus", boardStatus());

    });

    // To handle an error, it just emits boardStatus event
    // It also closes Lumen and server processes
    board.on("error", () => {
        io.emit("boardStatus", boardStatus());
        process.exit(0);
    });

    // Set up some actions when a client arrives
    io.on("connection", socket => {
        console.log("Aria, we have visitors!");

        // Emit boardStatus to the recently connected client
        socket.emit("boardStatus", boardStatus());

        // Receiving a sample data from Aria, it controls a board if it's ready
        socket.on("sample", (c) => {
            //First, check if board is currently ready
            if(boardStatus().ready) {
                //Sets pinModes and activate them
                board.pinMode(c.redPin, five.Pin.PWM);
                board.pinMode(c.greenPin, five.Pin.PWM);
                board.pinMode(c.bluePin, five.Pin.PWM);
                board.analogWrite(c.redPin, c.red);
                board.analogWrite(c.greenPin, c.green);
                board.analogWrite(c.bluePin, c.blue);
            }
        });
    });
}
