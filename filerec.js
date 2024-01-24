// Record audio and save to file

var fs = require('fs');
var recorder = require('node-record-lpcm16');


const file = fs.createWriteStream('user.wav', { encoding: 'binary' });

const recording = recorder.record({
    sampleRate: 16000,
    threshold: 0.5,
    silence: '1.0',
    audioType: 'wav',
});

recording
.stream()
.pipe(file)

setTimeout(function () {
	recording.stop();
}, 5000);

// Path: SmartGlassESraspi/record.js
