let Mic = require('node-microphone');
const fs = require('fs');
let mic = new Mic();

let myWritableStream = fs.createWriteStream('test.wav');
let micStream = mic.startRecording();
micStream.pipe( myWritableStream );
setTimeout(() => {
    console.log('stopping');
    mic.stopRecording();
}, 3000);
mic.on('info', (info) => {
	console.log(info);
});
mic.on('error', (error) => {
	console.log(error);
});