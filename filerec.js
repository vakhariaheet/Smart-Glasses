const fs = require('fs');
const recorder = require('node-record-lpcm16');
const { Readable } = require('stream');


(async () => {
    const recording = recorder.record({
        sampleRate: 16000,
        channels: 1,
        threshold: 0.5,
        endOnSilence: true,
        silence: '5.0',
    });
    const audioFile = fs.createWriteStream('userAudio.wav', { encoding: 'binary' });
    recording.stream().pipe(audioFile);
    console.log('Recording started');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    recording.stop();
    const file = fs.readFileSync('userAudio.wav');
	var myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer IO2CFG4ESPXTC7WQA32J4LX2NO4L623A');
	myHeaders.append('Content-Type', 'audio/wave');

	// var file = userAudio;

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: file,
		redirect: 'follow',
	};
    const resp = await
        fetch(
            'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer IO2CFG4ESPXTC7WQA32J4LX2NO4L623A',
                    'Content-Type': 'audio/wave',
                },
                body: file,
                redirect: 'follow',
           }
        );
    const data = await resp.text();
    console.log(data);
    fs.writeFileSync('wit.txt', data);
})();
