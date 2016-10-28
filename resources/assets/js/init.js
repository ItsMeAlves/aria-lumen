/*
 * Init - File to define some variables and functions used by Aria
 */

var lowGain = 40;               // Define a gain factor to change Aria results
var midGain = 3;               // Define a gain factor to change Aria results
var hiGain = 1;               // Define a gain factor to change Aria results
var maxPwm = 256;           // maxPwm is used to limit each color power
var fftSize = 512;         // fftSize, to define each frequency interval
var discreteLevels = 8;    // Define how many discrete levels will be considered


// Calculates an average number of a given array
Array.prototype.average = function() {
    var acc = this.reduce((x,y) => {
        return x + y;
    });
    var result = parseInt(acc / this.length);
    return result;
}

// Receives a value between 0 and 256 and translates it into a discrete level
function discreteValue(input) {
    var volume = input;
    var max = maxPwm;
    var min = 0;
    var step = (max - min) / discreteLevels;
    var current = min;

    while(current <= max) {
        if(volume >= current && volume < (current + step)) {
            volume = current;
            break;
        }
        current += step;
    }
    return volume;
}
