var config = require("./config/express");
var routes = require("./routes")(config.app);
var io = require("socket.io")(config.http);
var options = require("minimist")(process.argv.slice(2));

if(options["just-aria"] === undefined) {
    console.log("Alright, Lumen! Wake up!");
    var lumen = require("./config/lumen")(io);
}
else {
    console.log("Sleep, little lumen! Just Aria is needed this time...");
    io.on("connection", socket => {
        io.emit("arise");
    });
}


config.http.listen(config.app.get("PORT"), function(){
    console.log("listening " + config.app.get("PORT"));
});