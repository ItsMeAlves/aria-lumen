if(navigator.getUserMedia) {
    socket.on("arduino", function(data) {
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

    const resolution = (audio.sampleRate / 2) / (analyser.fftSize / 2);
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

        changeBackground(volumes.bass, volumes.mid, volumes.treble);
    }

    input.connect(analyser);
    //input.connect(audio.destination);

    lumen();
}


