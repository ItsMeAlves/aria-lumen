var config = {
    video: false,
    audio: true
};

var audio = new AudioContext();
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

function volumeOf(array) {
    var sum = array.reduce((x,y) => {
        return x * y;
    });

    return sum / array.length;
}
