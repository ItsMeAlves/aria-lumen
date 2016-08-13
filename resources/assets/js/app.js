if(navigator.getUserMedia) {
    document.querySelector(".title").textContent = "Aria is waiting an arduino...";
    document.querySelector(".title").textContent = "Uh, sounds great!";
    navigator.getUserMedia(config, handle, (error) => {
        console.log(error.message);
    });
}
else {
    console.log("can't use that :/");
}

function handle(stream) {
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
            volumes[band] = volumeOf(values[band]);
        }

        var sample = {
            red: limit(discreteValue(volumes.treble)),
            green: limit(discreteValue(volumes.mid) - 70),
            blue: limit(discreteValue(volumes.bass) - 70),
            redPin: board.pins.redPin,
            greenPin: board.pins.greenPin,
            bluePin: board.pins.bluePin,
        };

        changeBackground(sample);
        socket.emit("sample", sample);
    }

    input.connect(analyser);
    aria();
}
