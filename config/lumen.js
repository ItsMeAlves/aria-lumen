var five = require("johnny-five");
var board = null;
var buffers = {
    red: [],
    green: [],
    blue: []
};
var bufferLength = 1;
var discreteLevels = 16;

function discreteValue(arr) {
    var maxPwm = 256;
    var sum = arr.reduce((x,y) => {
        return x + y;
    });

    var volume = sum / arr.length;
    var step = maxPwm / discreteLevels;
    var current = 0;

    while(current <= maxPwm) {
        if(volume >= current && volume < (current + step)) {
            volume = current;
            break;
        }
        current += step;
    }

    return volume;
}

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
            for(var buffer in buffers) {
                buffers[buffer].push(c[buffer]);
                if(buffers[buffer].length > bufferLength) {
                    buffers[buffer].splice(0,1);
                }
            }
            if(boardStatus().ready) {
                var red = discreteValue(buffers.red);
                var green = discreteValue(buffers.green) - 70;
                var blue = discreteValue(buffers.blue) - 100;
                board.pinMode(c.redPin, five.Pin.PWM);
                board.pinMode(c.greenPin, five.Pin.PWM);
                board.pinMode(c.bluePin, five.Pin.PWM);
                board.analogWrite(c.redPin, (red > 0) ? red : 0);
                board.analogWrite(c.greenPin, (green > 0) ? green : 0);
                board.analogWrite(c.bluePin, (blue > 0) ? blue : 0);
            }
            else {
                console.log("sample");
            }
        });
    });
}
