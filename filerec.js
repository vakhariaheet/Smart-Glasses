// Record audio and save to file

var fs = require('fs');
var recorder = require('node-record-lpcm16');


const file = fs.createWriteStream('user.wav', { encoding: 'binary' });

const recording = recorder.record({
    sampleRate: 48000,
    verbose: true,
});

recording
.stream()
.pipe(file)

setTimeout(function () {
	recording.stop();
}, 5000);

// Path: SmartGlassESraspi/record.js
