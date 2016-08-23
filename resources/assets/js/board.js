/*
 * Board - Define a Board constructor to handle board related data on client
 */

function Board() {
    // Creates a pins attribute to save its values
    this.pins = {
        redPin: 8,
        greenPin: 9,
        bluePin: 10
    };

    // Updates pin changing form based on its own pins
    this.updateForm = () => {
        document.querySelector(".redPin").placeholder = "Set pin to control red lights (default: " +
            this.pins.redPin + ")";
        document.querySelector(".greenPin").placeholder = "Set pin to control green lights (default: " +
            this.pins.greenPin + ")";
        document.querySelector(".bluePin").placeholder = "Set pin to control blue lights (default: " +
            this.pins.bluePin + ")";
    }
}

// Creates an object
var board = new Board();
board.updateForm();
