var ArduinoScanner = require("arduino-scanner");
var SerialPort = require("serialport");
var scanner = new ArduinoScanner();
var port = null;

module.exports = (io) => {
    io.on("connection", socket => {
        console.log("Aria, we have visitors!");
        if(port != null) {
            io.emit("arise");
        }
    });

    scanner.start();
    scanner.on("arduinoFound", result => {
        scanner.stop();

        console.log("Aria, arise! Let Lumen handle this friendly arduino...");
        io.emit("arise");

        port = new SerialPort(result.port);
        port.on("open", () => {
            io.use((socket, next) => {
                socket.on("sample", (c) => {
                    var rgbString = c.red + "," + c.green + "," + c.blue;
                    port.write(rgbString, (err) => {
                        if(err) 
                            console.log("Lumen, we have a problem...");
                    });
                });

                next();
            });
        });
    });
}


