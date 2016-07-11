module.exports = function(http) {
    return function(request, response, next) {
        var io = require("socket.io")(http);

        io.on("connection", function(socket) {
            console.log("hue");
            io.emit("arduino", "placeholder");
        });

        next();
    }
}