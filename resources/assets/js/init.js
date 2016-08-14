var gain = 1;
var maxPwm = 256;
var fftSize = 2048;
var discreteLevels = 32;
var boundaries = {
    bass: {
        min: 0,
        max:600
    },
    mid: {
        min: 600,
        max: 2000
    },
    treble: {
        min: 2000,
        max: 5500
    }
};

Array.prototype.average = function() {
    var acc = this.reduce((x,y) => {
        return x + y;
    });

    return parseInt(acc / this.length);
}

function changeBackground(colors) {
    var rgbString = "rgb(" + colors.red + "," + colors.green +
        "," + colors.blue + ")";
    document.querySelector("body").style.backgroundColor = rgbString;
}

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

function limit(input) {
    var volume = (input > (maxPwm - 1)) ? maxPwm - 1 : input;
    return (volume < 0) ? 0 : volume;
}

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

function mapper(x, in_min, in_max, out_min, out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
