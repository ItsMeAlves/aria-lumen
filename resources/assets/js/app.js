/*
 * Client app file - Handles all data
 */

 // First we need to set what we want from user media. We just need audio
var config = {
    video: false,
    audio: true
};

// Gets the canvas element
var board = document.querySelector('#board');
var boardContext = board.getContext("2d");
board.setAttribute("height", window.innerHeight);
board.setAttribute("width", window.innerWidth);

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
    const input = audio.createMediaStreamSource(stream);

    // Then creates three different filters
    const lowFilter = audio.createBiquadFilter();
    const midFilter = audio.createBiquadFilter();
    const hiFilter = audio.createBiquadFilter();

    // Four analysers, one for each filter and another for time domain analysis
    const lowAnalyser = audio.createAnalyser();
    const midAnalyser = audio.createAnalyser();
    const hiAnalyser = audio.createAnalyser();
    const analyser = audio.createAnalyser();

    // Gets canvas measures
    const WIDTH = board.offsetWidth;
    const HEIGHT = board.offsetHeight;

    // Setup for the lowpass filter to get the bass
    lowFilter.type = "lowpass",
    lowFilter.frequency.value = 1350;
    lowFilter.Q.value = 100;
    lowFilter.gain.value = 1;

    // A bandpass filter to get mid frequencies
    midFilter.type = "bandpass",
    midFilter.frequency.value = 1800;
    midFilter.Q.value = 0.5;
    midFilter.gain.value = 1;

    // And a high pass, for high notes
    hiFilter.type = "highpass",
    hiFilter.frequency.value = 2200;
    hiFilter.Q.value = 1000;
    hiFilter.gain.value = 1;

    // Sets fftSize for all analysers
    lowAnalyser.fftSize = fftSize;
    midAnalyser.fftSize = fftSize;
    hiAnalyser.fftSize = fftSize;
    analyser.fftSize = fftSize;

    // Creates arrays to hold data for all of analysers
    var lowBufferLength = lowAnalyser.frequencyBinCount;
    var midBufferLength = midAnalyser.frequencyBinCount;
    var hiBufferLength = hiAnalyser.frequencyBinCount;
    var bufferLength = analyser.frequencyBinCount;
    var lowData = new Uint8Array(lowBufferLength);
    var midData = new Uint8Array(midBufferLength);
    var hiData = new Uint8Array(hiBufferLength);
    var dataArray = new Uint8Array(bufferLength);

    // Change background color and draws a time domain waveform
    function drawWaveform(color) {
        // Gets time domain data and sets line aspects
        analyser.getByteTimeDomainData(dataArray);
        boardContext.fillStyle = color;
        boardContext.fillRect(0, 0, WIDTH, HEIGHT);
        boardContext.lineWidth = 3;
        boardContext.strokeStyle = 'rgb(0, 0, 0)';

        boardContext.beginPath();

        // Calculates where line should start
        // Also, draws the rest of it
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

        // Set the line inside to the canvas
        boardContext.lineTo(board.width, board.height/2);
        boardContext.stroke();
    };


    // Defines Aria
    function aria() {
        // Calls Aria recursively after each 16ms
        setTimeout(aria, 16);

        //Writes down in the data array the frequency values for each band
        lowAnalyser.getByteFrequencyData(lowData);
        midAnalyser.getByteFrequencyData(midData);
        hiAnalyser.getByteFrequencyData(hiData);

        // Define the new frequencies arrays after applying gain
        var lowFrequencies = Array.from(lowData.map(k => k * lowGain));
        var midFrequencies = Array.from(midData.map(k => k * midGain));
        var hiFrequencies = Array.from(hiData.map(k => k * hiGain));

        // Creates a sample data containing light intensity
        var sample = {
            red: discreteValue(hiFrequencies.average()),
            green: discreteValue(midFrequencies.average()),
            blue: discreteValue(lowFrequencies.average()),
        };

        // Change background by the given sample and draws a time domain waveform
        drawWaveform("rgb(" + sample.red + "," +
            sample.green + "," + sample.blue + ")");

        // Emit sample event back to the server
        socket.emit("sample", sample);
    }


    // Connect the input audio to the AnalyserNode
    input.connect(lowFilter);
    input.connect(midFilter);
    input.connect(hiFilter);
    lowFilter.connect(lowAnalyser);
    midFilter.connect(midAnalyser);
    hiFilter.connect(hiAnalyser);
    input.connect(analyser);

    // Calls Aria
    aria();
}
