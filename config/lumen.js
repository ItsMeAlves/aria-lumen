var five = require("johnny-five");
var board = null;
var redPin = 8;
var greenPin = 9;
var bluePin = 10;

module.exports = (io) => {
    board = new five.Board({
        repl: true
    });
    
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
    
    io.use((socket, next) => {
        socket.on("pins", (data) => {
            redPin = data.redPin;
            greenPin = data.greenPin;
            bluePin = data.bluePin
        });

        socket.on("sample" (c) => {
            if(board != null && board.isReady) {
                board.analogWrite(redPin, c.red);
                board.analogWrite(greenPin, c.green);
                board.analogWrite(bluePin, c.blue);
            }
        });
    });


    board.on("ready", () => {
        console.log("Aria, arise! Let Lumen handle this friendly arduino...");
        io.emit("arise");
        
    });
    board.on("error", () => {
        process.exit(0);
    });
}


