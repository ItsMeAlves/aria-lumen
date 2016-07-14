if(navigator.getUserMedia) {
    socket.on("arise", () => {
        document.querySelector(".title").textContent = "Uh, sounds great!";
        navigator.getUserMedia(config, handle, (error) => {
            console.log(error.message);
        });
    }); 
}
else {
    console.log("can't use that :/");
}

function handle(stream) {
    const input = audio.createMediaStreamSource(stream);
    const analyser = audio.createAnalyser();

    analyser.fftSize = fftSize;
    // analyser.minDecibels = -50;
    // analyser.maxDecibels = 205;
    const resolution = (audio.sampleRate / 2) / (analyser.fftSize);
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    function lumen() {
        setTimeout(lumen, 15);
        analyser.getByteFrequencyData(data);

        var frequencies = data.map(k => k * gain);

        var volumes = {};
        var values = solve(frequencies, resolution, boundaries);

        for(var band in values) {
            volumes[band] = (volumeOf(values[band]));
        }

        var colors = {
            red: volumes.bass,
            green: volumes.mid,
            blue: volumes.treble
        };

        changeBackground(colors);
        socket.emit("sample", colors);
    }

    input.connect(analyser);
    //input.connect(audio.destination);

    lumen();
}


