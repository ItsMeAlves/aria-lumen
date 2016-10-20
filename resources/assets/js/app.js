/*
 * Client app file - Handles all data
 */

var board = document.querySelector('#board');
var boardContext = board.getContext("2d");
board.setAttribute("height", window.innerHeight);
board.setAttribute("width", window.innerWidth);


 // First we need to set what we want from user media. We just need audio
var config = {
    video: false,
    audio: true
};

// Then, we require a AudioContext and the user media object
// It will just work when served by a server
var audio = new AudioContext();
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

// If we got user media support by the browser, lets require it!
if(navigator.getUserMedia) {
    // document.querySelector(".title").textContent = "Uh, sounds great!";
    // Requests user media by the config object created above
    // If everything runs fine, it will run audioFlow function passing a stream object
    // But if something goes wrong, it will execute the last callback
    navigator.getUserMedia(config, audioFlow, (error) => {
        console.log(error.message);
    });
}
else {
    // It will be shown just in case the browser doesn't support user media
    console.log("can't use that :/");
}

// Gets all the stream data and calls Aria
function audioFlow(stream) {
    // Create an audio input by the given stream and create an AnalyserNode
    var input = audio.createMediaStreamSource(stream);
    var lowAnalyser = audio.createAnalyser();
    var midAnalyser = audio.createAnalyser();
    var hiAnalyser = audio.createAnalyser();
    var analyser = audio.createAnalyser();
    var lowFilter = audio.createBiquadFilter();
    var midFilter = audio.createBiquadFilter();
    var hiFilter = audio.createBiquadFilter();

    const WIDTH = board.offsetWidth;
    const HEIGHT = board.offsetHeight;

    lowFilter.type = "lowpass",
    lowFilter.frequency.value = 1350;
    lowFilter.Q.value = 100;
    lowFilter.gain.value = 1;

    midFilter.type = "bandpass",
    midFilter.frequency.value = 1800;
    midFilter.Q.value = 0.5;
    midFilter.gain.value = 1;

    hiFilter.type = "highpass",
    hiFilter.frequency.value = 2200;
    hiFilter.Q.value = 1000;
    hiFilter.gain.value = 1;

    // Sets fftSize and calculates frequency resolution given by the analyser
    lowAnalyser.fftSize = fftSize;
    midAnalyser.fftSize = fftSize;
    hiAnalyser.fftSize = fftSize;
    analyser.fftSize = fftSize;
    var resolution = (audio.sampleRate / 2) / (hiAnalyser.fftSize);

    var lowBufferLength = lowAnalyser.frequencyBinCount;
    var midBufferLength = midAnalyser.frequencyBinCount;
    var hiBufferLength = hiAnalyser.frequencyBinCount;
    var bufferLength = analyser.frequencyBinCount;
    var lowData = new Uint8Array(lowBufferLength);
    var midData = new Uint8Array(midBufferLength);
    var hiData = new Uint8Array(hiBufferLength);
    var dataArray = new Uint8Array(bufferLength);

    function drawWaveform(color) {
        analyser.getByteTimeDomainData(dataArray);
        boardContext.fillStyle = color;
        boardContext.fillRect(0, 0, WIDTH, HEIGHT);
        boardContext.lineWidth = 3;
        boardContext.strokeStyle = 'rgb(0, 0, 0)';

        boardContext.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for(var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
                boardContext.moveTo(x, y);
            }
            else {
                boardContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        boardContext.lineTo(board.width, board.height/2);
        boardContext.stroke();
    };


    // Defines Aria
    function aria() {
        // Calls Aria recursively after each 15ms
        setTimeout(aria, 16);

        //Writes down in the data array the frequency values
        lowAnalyser.getByteFrequencyData(lowData);
        midAnalyser.getByteFrequencyData(midData);
        hiAnalyser.getByteFrequencyData(hiData);

        // Define a new frequencies array after applying gain
        var lowFrequencies = Array.from(lowData.map(k => k * lowGain));
        var midFrequencies = Array.from(midData.map(k => k * midGain));
        var hiFrequencies = Array.from(hiData.map(k => k * hiGain));

        // Creates a sample data containing board pins and light intensity
        var sample = {
            red: discreteValue(hiFrequencies.average()),
            green: discreteValue(midFrequencies.average()),
            blue: discreteValue(lowFrequencies.average()),
        };

        console.log(sample.red, sample.green, sample.blue);

        // Change background by the given sample
        drawWaveform("rgb(" + sample.red + "," +
            sample.green + "," + sample.blue + ")");
        // Emit sample event back to the server
        socket.emit("sample", sample);
    }


    // Connect the input audio to the AnalyserNode
    input.connect(lowFilter);
    lowFilter.connect(lowAnalyser);
    input.connect(midFilter);
    midFilter.connect(midAnalyser);
    input.connect(hiFilter);
    hiFilter.connect(hiAnalyser);
    input.connect(analyser);

    // Calls Aria
    aria();
}
