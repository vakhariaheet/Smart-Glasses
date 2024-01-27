import { Gpio } from 'onoff';
import capture from './utils/ImageCapture';
import imageToText from './utils/Bard';
import { textToSpeech, playSpeech } from './utils/TextToSpeech';
import { readTemperature } from './utils/Temperature';
import initGPS from './utils/GPS';
import { startRecord, stopRecord } from './utils/Record';
import handleIntent from './utils/Intent';
const touchSensor = new Gpio(17, 'in', 'both');
const irSensor = new Gpio(27, 'in', 'falling');

let timer: NodeJS.Timeout;
let count = 0;
let currentStatus: 'Capturing' | 'Recording' |'' = '';
let recording:any = null;
// initGPS();
touchSensor.watch(async (err, value) => {
	if (err) {
		throw err;
	}
	if (value) {
		count++;
		clearTimeout(timer);
		timer = setTimeout(async () => { 
			await tapHandler(count);
			count = 0;
		},300)
	}
});

const tapHandler = async (count: number) => { 
	if(currentStatus === 'Capturing') return;
	if (count === 0) { 
		
	}
	if (count === 1) {
		if (currentStatus === 'Recording') {
			console.log('Recording stopped');
			const resp = await stopRecord(recording);
			if (!resp.isSuccess) {
				await textToSpeech('Sorry, I did not get that');
				await playSpeech();
				return;
			}
			await handleIntent(resp.intents,resp.entities);
		}
		await singleTapHandler();
	}
	else if (count === 2) {
		console.log('Recording started');
		currentStatus = 'Recording';
		recording = startRecord();
	}
	else if (count === 3) { 
		// await tripleTapHandler();
	}

}

const singleTapHandler = async () => { 
	currentStatus = 'Capturing';
	const startTime = Date.now();
	console.log('Capturing image...');
	await capture();
	const imageClickTime = Date.now();
	console.log(`
		Time taken to capture image: ${imageClickTime - startTime}ms
		Current Elapsed Time: ${Date.now() - startTime}ms
	`);
	console.log('Image captured');
	const text = await imageToText('test.jpeg');
	const textClickTime = Date.now();
	console.log(`
		Time taken to generate text: ${textClickTime - imageClickTime}ms
		Current Elapsed Time: ${Date.now() - startTime}ms
	`);
	console.log('Text generated');
	console.log('Converting text to speech...');
	await textToSpeech(text);
	const speechClickTime = Date.now();
	console.log(`
		Time taken to generate speech: ${speechClickTime - textClickTime}ms
		Current Elapsed Time: ${Date.now() - startTime}ms
	`);
	console.log('Speech generated');
	console.log('Playing speech...');
	await playSpeech();
	console.log('Text spoken');
	currentStatus = '';
}

process.on('SIGINT', () => {
	touchSensor.unexport();
	irSensor.unexport();
	process.exit();
});

console.log('Awaiting for touch trigger...');
