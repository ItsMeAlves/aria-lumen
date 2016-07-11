var config = {
    video: false,
    audio: true
};

var audio = new AudioContext();
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

