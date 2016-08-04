var config = require("./config/express");
var routes = require("./routes")(config.app);
var io = require("socket.io")(config.http);
var lumen = require("./config/lumen")(io);

console.log("Alright, Lumen! Wake up!");

config.http.listen(config.app.get("PORT"), function(){
    console.log("listening " + config.app.get("PORT"));
});