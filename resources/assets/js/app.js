if(navigator.getUserMedia) {
    socket.on("arduino", function(data) {
        $(".title").text("Uh, sounds great!");
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

    const resolution = (audio.sampleRate / 2) / (analyser.fftSize);
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    function lumen() {
        id = requestAnimationFrame(lumen);
        analyser.getByteFrequencyData(data);

        var frequencies = data.map(k => k * gain);

        var volumes = {};
        var values = solve(frequencies, resolution, boundaries);

        for(var band in values) {
            volumes[band] = (volumeOf(values[band]) + 31);
        } 

        changeBackground(volumes.bass, volumes.treble, volumes.mid);
    }

    input.connect(analyser);
    //input.connect(audio.destination);

    lumen();
}


