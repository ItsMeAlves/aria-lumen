/*
 * Aria/Lumen Server
 */

var config = require("./config/express");     // Configure express router
var routes = require("./routes")(config.app); // Configure routes
var io = require("socket.io")(config.http);   // Open Socket io
var lumen = require("./config/lumen")(io);    // Open Lumen

console.log("Alright, Lumen! Wake up!");      // Log something to the console

//Starts to listen to any request made
config.http.listen(config.app.get("PORT"), function(){
    console.log("listening " + config.app.get("PORT"));
});