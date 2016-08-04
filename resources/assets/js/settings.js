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
    var pins = {
        redPin: 8,
        greenPin: 9,
        bluePin: 10 
    };

    for(var pin in pins) {
        let field = document.querySelector("." + pin);
        let value = parseInt(field.value);

        if(!isNaN(value) && value > 0 && value < 14) {
            pins[pin] = value;
        }
        else {
            field.value = pins[pin];
        }
    }

    socket.emit("pins", pins);
});