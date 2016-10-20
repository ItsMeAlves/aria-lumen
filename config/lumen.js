/*
 * Lumen - It takes Aria data and use it to control an Arduino board
 */

// Uses Johnny Five package to handle an Arduino board
var five = require("johnny-five");
var board = null;
var portId = null;

var redPin = 8;
var greenPin = 9;
var bluePin = 10;

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
        portId = board.io.SERIAL_PORT_IDs.HW_SERIAL1;

        board.io.serialConfig({
            portId: portId,
            baud: 57600
        });

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
                board.pinMode(redPin, five.Pin.PWM);
                board.pinMode(greenPin, five.Pin.PWM);
                board.pinMode(bluePin, five.Pin.PWM);
                board.analogWrite(redPin, c.red);
                board.analogWrite(greenPin, c.green);
                board.analogWrite(bluePin, c.blue);

                var data = c.red + "," + c.green + "," + c.blue + ",";
                var buffer = Buffer.from(data);
                var byteArray = Array.from(buffer);

                board.io.serialWrite(portId, byteArray);
            }
        });
    });
}
