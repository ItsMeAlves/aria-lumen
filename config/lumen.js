var five = require("johnny-five");
var board = null;
var redPin = 8;
var greenPin = 9;
var bluePin = 10;

function writeColorsTo(socket, interface) {
    socket.on("sample", (c) => {
        interface.analogWrite(redPin, c.red);
        interface.analogWrite(greenPin, c.green);
        interface.analogWrite(bluePin, c.blue);
    });
}

module.exports = (io) => {
    io.on("connection", socket => {
        console.log("Aria, we have visitors!");
        if(board != null && board.isReady) {
            io.emit("arise");
            writeColorsTo(socket, board);
        }
        else {
            if(board == null) {
                board = new five.Board();
            }
            board.on("ready", () => {
                io.emit("arise");
                writeColorsTo(socket, board);                
            });

            board.on("error", () => {
                process.exit(0);
            });
        }
    });

    // setTimeout(() => {l
    //     io.emit("arise");
    // }, 10000);

    board = new five.Board({
        repl: true
    });
    board.on("ready", () => {
        console.log("Aria, arise! Let Lumen handle this friendly arduino...");
        io.emit("arise");
        
    });
    board.on("error", () => {
        process.exit(0);
    });
}


