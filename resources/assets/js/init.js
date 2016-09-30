/*
 * Init - File to define some variables and functions used by Aria
 */

var gain = 2.5;               // Define a gain factor to change Aria results
var maxPwm = 256;           // maxPwm is used to limit each color power
var fftSize = 512;         // fftSize, to define each frequency interval
var discreteLevels = 32;    // Define how many discrete levels will be considered

// This object defines all frequency ranges we want
var boundaries = {
    bass: {
        min: 0,
        max:800
    },
    mid: {
        min: 800,
        max: 1000
    },
    treble: {
        min: 1000,
        max: 3000
    }
};

// Calculates an average number of a given array
Array.prototype.average = function() {
    var acc = this.reduce((x,y) => {
        return x + y;
    });

    return parseInt(acc / this.length);
}

// Updates background color
function changeBackground(colors) {
    var rgbString = "rgb(" + colors.red + "," + colors.green +
        "," + colors.blue + ")";
    document.querySelector("body").style.backgroundColor = rgbString;
}

// Divides arr into smaller arrays
// Each array returned represents the frequency band divided by boundaries size
function solve(arr, r, b) {
    var current = 0;
    var arrIndex = 0;
    var valueIndex = 0;
    var values = {};

    for(var band in b) {
        values[band] = [];

        while(current <= b[band].min) {
            current += r;
            arrIndex += 1;
        }

        while(current <= b[band].max) {
            values[band][valueIndex] = arr[arrIndex];
            current += r;
            valueIndex += 1;
            arrIndex += 1;
        }
        current = 0;
        arrIndex = 0;
        valueIndex = 0;
    }

    return values;
}

// Limit an input value into a range between 0 and maxPwm
function limit(input) {
    var volume = (input > (maxPwm - 1)) ? maxPwm - 1 : input;
    return (volume < 0) ? 0 : volume;
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
