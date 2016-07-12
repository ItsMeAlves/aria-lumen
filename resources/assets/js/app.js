function changeBackground(rgbString) {
    $("body").css({
        "background-color": rgbString
    });
}

function handle(stream) {
    const input = audio.createMediaStreamSource(stream);
    const audible = audio.createBiquadFilter();
    const analyser = audio.createAnalyser();
    audible.type = "lowpass",
    audible.frequency.value = 4000;

    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const frequencies = new Uint8Array(bufferLength);
    const time = new Uint8Array(bufferLength);

    function lumen() {
        id = requestAnimationFrame(lumen);
        analyser.getByteFrequencyData(frequencies);
        analyser.getByteTimeDomainData(time);

        var volume = volumeOf(frequencies);
        changeBackground("rgb(" + volume + "," + volume + "," + volume + ")"); 
    }

    input.connect(audible);
    audible.connect(analyser);
    audible.connect(audio.destination);

    lumen();
}

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

