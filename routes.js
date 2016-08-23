/*
 * Router - It sets all desired routes (currently, there is just one :D)
 */

module.exports = function(app) {
    // Set the Express app object to react to a GET request at /
    app.get("/", function(request, response) {
        response.render("index");   //Returns index template rendered by its engine (Pug)
    });
}