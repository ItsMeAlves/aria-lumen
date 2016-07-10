var config = require("./config/express");
var routes = require("./routes")(config.app);

config.http.listen(config.app.get("PORT"), function(){
    console.log("listening " + config.app.get("PORT"));
});