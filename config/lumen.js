var ArduinoScanner = require("arduino-scanner");
var SerialPort = require("serialport");
var scanner = new ArduinoScanner();
var port = null;

function writeColors(c) {
    var rgbString = c.red + "," + c.green + "," + c.blue;
    port.write(rgbString, (err) => {
    if(err) 
        console.log("Lumen, we have a problem...");
    });
}

module.exports = (io) => {
    io.on("connection", socket => {
        console.log("Aria, we have visitors!");
        if(port != null) {
            io.emit("arise");
            if(port.isOpen()) {
                socket.on("sample", (c) => {
                    writeColors(c);
                });                
            }
            else {
                port.on("open", () => {
                    socket.on("sample", (c) => {
                        writeColors(c);
                    });   
                });
            }
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
                   writeColors(c);
                });

                next();
            });
        });
    });
}


