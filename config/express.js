var express = require("express");
var app = express();
var http = require("http").Server(app);
var lumen = require("./lumen");

app.set("view engine", "pug");
app.set("views", "resources/views");
app.set("PORT", process.env.PORT || 3000);

app.use(express.static('resources/assets'));

module.exports = {
    app: app,
    http: http
};