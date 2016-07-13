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
    analyser.minDecibels = -31;
    analyser.maxDecibels = 224;

    const resolution = (audio.sampleRate / 2) / (analyser.fftSize / 2);
    const bufferLength = analyser.frequencyBinCount;
    const frequencies = new Uint8Array(bufferLength);

    function lumen() {
        id = requestAnimationFrame(lumen);
        analyser.getByteFrequencyData(frequencies);

        var volumes = {};
        var values = solve(frequencies, resolution, boundaries);

        for(var band in values) {
            volumes[band] = (volumeOf(values[band]) + 31) * gain;
        } 

        changeBackground(volumes.bass, volumes.treble, volumes.mid);
    }

    input.connect(analyser);
    //input.connect(audio.destination);

    lumen();
}


