var config = {
    video: false,
    audio: true
};

var audio = new AudioContext();
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

if(navigator.getUserMedia) {
    // document.querySelector(".title").textContent = "Aria is waiting an arduino...";
    document.querySelector(".title").textContent = "Uh, sounds great!";
    navigator.getUserMedia(config, audioFlow, (error) => {
        console.log(error.message);
    });
}
else {
    console.log("can't use that :/");
}

function audioFlow(stream) {
    var input = audio.createMediaStreamSource(stream);
    var analyser = audio.createAnalyser();

    analyser.fftSize = fftSize;
    var resolution = (audio.sampleRate / 2) / (analyser.fftSize);
    var bufferLength = analyser.frequencyBinCount;
    var data = new Uint8Array(bufferLength);

    function aria() {
        setTimeout(aria, 15);
        analyser.getByteFrequencyData(data);

        var frequencies = data.map(k => k * gain);

        var volumes = {};
        var values = solve(frequencies, resolution, boundaries);

        for(var band in values) {
            volumes[band] = discreteValue(values[band].average());
        }

        var sample = {
            red: limit(volumes.treble),
            green: limit(volumes.mid - 70),
            blue: limit(volumes.bass - 70),
            redPin: board.pins.redPin,
            greenPin: board.pins.greenPin,
            bluePin: board.pins.bluePin
        };

        sample.redPin = board.pins.redPin;
        sample.greenPin = board.pins.greenPin;
        sample.bluePin = board.pins.bluePin;

        changeBackground(sample);
        socket.emit("sample", sample);
    }

    input.connect(analyser);
    aria();
}
