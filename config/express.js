/*
 * Express configuration file - Run some custom settings over Express
 */

var express = require("express");   //Requires express package
var app = express();                //Creates app object
var http = require("http").Server(app);  // http is needed when using websockets

app.set("view engine", "pug");       // Sets default template engine to Pug
app.set("views", "resources/views"); // Tell where views are located 
app.set("PORT", process.env.PORT || 3000); //Setup its port

// Apply static files middleware
app.use(express.static('resources/assets'));

//Exports app and http objects
module.exports = {
    app: app,
    http: http
};