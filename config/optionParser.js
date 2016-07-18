var options = require("minimist")(process.argv.slice(2));

var optionParser = (obj) => {
    for(var prop in obj) {
        if(options[prop] === undefined)
            obj[prop].falsy();
        else
            obj[prop].truthy(options[prop]);
    }
}

module.exports = optionParser;
