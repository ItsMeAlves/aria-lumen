function handle(stream) {
    const input = audio.createMediaStreamSource(stream);
    input.connect(audio.destination);
}

if(navigator.getUserMedia) {
    socket.on("arduino", function(data) {
        console.log("okay, starting...");
        navigator.getUserMedia(config, handle, (error) => {
            console.log(error.message);
        });
    }); 
}
else {
    console.log("can't use that :/");
}

