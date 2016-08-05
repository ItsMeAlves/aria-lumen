function Board() {
    this.pins = {
        redPin: 8,
        greenPin: 9,
        bluePin: 10
    };
    this.updateForm = () => {
        document.querySelector(".redPin").placeholder = "Set pin to control red lights (default: " + 
            this.pins.redPin + ")";
        document.querySelector(".greenPin").placeholder = "Set pin to control green lights (default: " + 
            this.pins.greenPin + ")";
        document.querySelector(".bluePin").placeholder = "Set pin to control blue lights (default: " + 
            this.pins.bluePin + ")";
    }
}

