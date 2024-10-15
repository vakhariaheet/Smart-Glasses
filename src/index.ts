import { Gpio } from 'pigpio';
import capture from './utils/ImageCapture';
import imageToText from './utils/Bard';
import { textToSpeech, playSpeech, playSpeechSync } from './utils/TextToSpeech';
import initGPS from './utils/GPS';
import { startRecord, stopRecord } from './utils/Record';
import handleIntent from './utils/Intent';
import { startBLE } from './utils/BLE';
import { initWifi } from './utils/Wifi';
import getDB from './utils/DB';
const touchSensor = new Gpio(22, {
	mode: Gpio.INPUT,
	pullUpDown: Gpio.PUD_DOWN,
	alert: true
});

let timer: NodeJS.Timeout;
let count = 0;
let currentStatus: 'Capturing' | 'Recording' | '' = '';
let isACommandRunning = false;
let recording: any = null;
initGPS();
startBLE();
initWifi();

const handleStateChange = (level: number) => { 
	if (level === 1) {
		count++;
		clearTimeout(timer);
		timer = setTimeout(async () => {
			await tapHandler(count);
			count = 0;
		}, 300)
	}
}

touchSensor.on('alert', handleStateChange);

const tapHandler = async (count: number) => {
	if (currentStatus === 'Capturing') return;
	if (count === 0) {

	}
	if (count === 1) {
		if (currentStatus === 'Recording') {
			console.log('Recording stopped');

			const resp = await stopRecord(recording);
			if (!resp.isSuccess) {
				isACommandRunning = false;
				currentStatus = '';
				console.log(resp.transcribe);
				await textToSpeech('Sorry, I did not get that');
				await playSpeech();
				return;
			}

			await handleIntent(resp.intents, resp.entities, resp.transcribe);
			currentStatus = '';
			isACommandRunning = false;
			return;
		}
		await singleTapHandler();
	}
	else if (count === 2 && !isACommandRunning) {
		isACommandRunning = true;
		console.log('Recording started');
		currentStatus = 'Recording';
		recording = await startRecord();

	}
	else if (count === 3) {
		// await tripleTapHandler();
	}

}

const singleTapHandler = async () => {
	isACommandRunning = true;
	currentStatus = 'Capturing';
	const startTime = Date.now();
	console.log('Capturing image...');
	await capture();

	const imageClickTime = Date.now();
	console.log(`
		Time taken to capture image: ${imageClickTime - startTime}ms
		Current Elapsed Time: ${Date.now() - startTime}ms
	`);
	const loadingProccess = playSpeechSync('./src/assets/sfx/loading.mp3', true);
	try {

		await (await getDB()).setCurrentProcessId(loadingProccess.pid || null);
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
		loadingProccess.kill();
		await (await getDB()).setCurrentProcessId(null);
		await playSpeech();
		console.log('Text spoken');
		currentStatus = '';
		isACommandRunning = false;
	}
	catch (err) {
		console.log(err);
		loadingProccess.kill();
	}
}

process.on('SIGINT', () => {
	touchSensor.off('alert',handleStateChange);
	process.exit();
});

console.log('Awaiting for touch trigger...');
