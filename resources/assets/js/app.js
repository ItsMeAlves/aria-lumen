/*
 * Client app file - Handles all data
 */

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
    document.querySelector(".title").textContent = "Uh, sounds great!";
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
    var analyser = audio.createAnalyser();

    // Sets fftSize and calculates frequency resolution given by the analyser
    analyser.fftSize = fftSize;
    var resolution = (audio.sampleRate / 2) / (analyser.fftSize);
    var bufferLength = analyser.frequencyBinCount;
    var data = new Uint8Array(bufferLength);

    // Defines Aria
    function aria() {
        // Calls Aria recursively after each 15ms
        setTimeout(aria, 15);

        //Writes down in the data array the frequency values
        analyser.getByteFrequencyData(data);

        // Define a new frequencies array after applying gain
        var frequencies = data.map(k => k * gain);

        // Calculates all of each bandwidth array
        var volumes = {};
        var values = solve(frequencies, resolution, boundaries);

        // Sets each bandwidth volumes
        for(var band in values) {
            volumes[band] = discreteValue(values[band].average());
        }

        // Creates a sample data containing board pins and light intensity
        var sample = {
            red: limit(volumes.treble),
            green: limit(volumes.mid - 70),
            blue: limit(volumes.bass - 70),
            redPin: board.pins.redPin,
            greenPin: board.pins.greenPin,
            bluePin: board.pins.bluePin
        };

        // Change background by the given sample
        changeBackground(sample);
        // Emit sample event back to the server
        socket.emit("sample", sample);
    }

    // Connect the input audio to the AnalyserNode
    input.connect(analyser);
    // Calls Aria
    aria();
}
