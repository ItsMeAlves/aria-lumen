# Aria Lumen
This project aims to create a nice audio visualisation using Web Audio API and, after that, control an arduino board attached to the computer. It's a very nice work to turn music into dancing leds!

## Using this
Anyone can easily execute this by simply downloading and running inside its root directory:
```
node server.js
```
This execution starts a server. Now, just simply open your browser and `locahost:3000` it.

## Features
It's made by two parts: Aria and Lumen. These two starts together by default, but if is your desire to run just Aria, it's possible by doing:
```
node server.js --just-aria
```
With this flag, Lumen will not be started and Aria will not wait for an arduino board anymore. 

## Aria
This is the browser part. When the server says it's okay to start listening (after connectirng an arduino board through USB), Aria asks for permission to use the microphone. After that, it listen the audio stream and connect this to a analyser node, which provides a nice FFT implementation. Using this feature, it's possible to divide audio in frequency bands, allowing us to assign a band or a combination of them to a color. The default implementation tells the browser to change `<body>` background color property to a RGB value where R is the bass, G is the mid frequencies and B is all the treble. Finally, this result is continuously sent to Lumen.

## Lumen
It lives inside the server, searching for an arduino board. When it's ready, it tells Aria that it's okay to start listening. So, it waits until Aria sends any sample, which means a simple combination of RGB. After that, it controls the arduino to power on three pins according to the sample received (by default: red pin is 8, green pin is 9, blue pin is 10).
