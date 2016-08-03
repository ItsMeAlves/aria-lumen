var btn = document.querySelector(".settings-button");
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