var express = require("express");
var app = express();
var http = require("http").Server(app);
var websockets = require("./websockets")(http);

app.set("view engine", "jade");
app.set("views", "resources/views");
app.set("PORT", process.env.PORT || 3000);

app.use(express.static('resources/assets'));
app.use(websockets);

module.exports = {
    app: app,
    http: http
};