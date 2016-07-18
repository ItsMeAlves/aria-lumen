var config = require("./config/express");
var routes = require("./routes")(config.app);
var io = require("socket.io")(config.http);
var optionParser = require("./config/optionParser");

optionParser({
    'just-aria': {
        truthy: value => {
            console.log("Sleep, little lumen! Just Aria is needed this time...");
            io.on("connection", socket => {
                io.emit("arise");
            });
        },
        falsy: () => {
            console.log("Alright, Lumen! Wake up!");
            var lumen = require("./config/lumen")(io);
        }
    }
});


config.http.listen(config.app.get("PORT"), function(){
    console.log("listening " + config.app.get("PORT"));
});