/*
 * Settings -  Control settings panel
 */

var btn = document.querySelector(".settings-button");
var arduino = document.querySelector("#arduino-settings");
var panel = document.querySelector(".settings");

btn.addEventListener("click", (e) => {
    e.preventDefault();
    if(panel.className.match("hidden")) {
        let classes = panel.className.split(" ");
        let result = classes.filter((x) => {
            return x != "hidden";
        });
        
        panel.className = result.join(" ");
    }
    else {
        panel.className += " hidden";
    }
});

arduino.addEventListener("click", (e) => {
    e.preventDefault();
    
    for(var pin in board.pins) {
        let field = document.querySelector("." + pin);
        let input = field.value;

        if(input == "") {
            input = board.pins[pin];
        }

        let value = parseInt(input);
        if(!isNaN(value) && value > 0 && value < 14) {
            board.pins[pin] = value;
        }
        field.value = "";
    }
    board.updateForm();
});