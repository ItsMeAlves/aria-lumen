module.exports = function(http) {
    return function(request, response, next) {
        var io = require("socket.io")(http);

        //Configure websockets
        next();
    }
}