const Mic = require('node-microphone');
const fs = require('fs');

const mic = new Mic();
const myWritableStream = fs.createWriteStream('test.wav');

mic.on('info', (info) => {
    console.log('Microphone info:', info);
});

mic.on('error', (error) => {
    console.error('Microphone error:', error);
});

mic.on('data', (data) => {
    // Here you can do something with the data if needed
    console.log('Received data from microphone:', data.length, 'bytes');
});

mic.on('end', () => {
    console.log('Microphone recording ended');
});

mic.startRecording()
    .pipe(myWritableStream);

setTimeout(() => {
    console.log('Stopping recording');
    mic.stopRecording();
}, 3000);
