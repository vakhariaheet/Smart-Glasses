let Mic = require('node-microphone');
let mic = new Mic();
let micStream = mic.startRecording();
micStream.pipe( myWritableStream );
setTimeout(() => {
    logger.info('stopped recording');
    mic.stopRecording();
}, 3000);
mic.on('info', (info) => {
	console.log(info);
});
mic.on('error', (error) => {
	console.log(error);
});