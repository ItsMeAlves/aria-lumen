var config = {
    video: false,
    audio: true
};

var fftSize = 1024;
var gain = 1;
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

var board = new Board();
board.updateForm();
var audio = new AudioContext();
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

function volumeOf(array) {
    var acc = array.reduce((x,y) => {
        return x + y;
    });

    return parseInt(acc / array.length);
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
