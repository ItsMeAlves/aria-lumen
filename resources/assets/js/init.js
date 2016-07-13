const config = {
    video: false,
    audio: true
};

const fftSize = 64;
const gain = 4;
const boundaries = {
    bass: 600,
    mid: 2800,
    treble: 6400   
};

const audio = new AudioContext();
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

function volumeOf(array) {
    const acc = array.reduce((x,y) => {
        return x * y;
    });

    return Math.pow(acc, 1/array.length);
}

function changeBackground(r, g, b) {
    var rgbString = "rgb(" + r + "," + g + "," + b + ")";
    console.log(rgbString);
    $("body").css({
        "background-color": rgbString
    });
}

function solve(arr, r, b) {
    var current = 0;
    var arrIndex = 0;
    var valueIndex = 0;
    var values = {};

    for(var band in b) {
        values[band] = [];
    }

    for(var band in values) {
        while(current <= b[band]) {
            values[band][valueIndex] = arr[arrIndex];
            current += r;
            valueIndex += 1;
            arrIndex += 1;
        }
        valueIndex = 0;
    }

    return values;
}
