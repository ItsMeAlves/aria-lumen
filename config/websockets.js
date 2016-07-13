module.exports = function(http) {
    return (request, response, next) => {
        var io = require("socket.io")(http);

        io.on("connection", (socket) => {
            console.log("Lumen, someone is connected!");
            io.emit("arduino", "placeholder");
        });

        next();
    }
}