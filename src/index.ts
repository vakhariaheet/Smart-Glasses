import { Gpio } from 'onoff';
import capture from './utils/ImageCapture';
import imageToText from './utils/Bard';
import connectMongo from './utils/connectMongo';
import { textToSpeech, playSpeech } from './utils/TextToSpeech';
import { readTemperature } from './utils/Temperature';
import  { getDistanceFromLatLonInKm } from './utils/GPS';
import * as gpsd from 'node-gpsd';
import { TPVDATA } from './types';
import GPS from './Models/GPS';
const touchSensor = new Gpio(17, 'in', 'both');
const irSensor = new Gpio(27, 'in', 'falling');

let timer: NodeJS.Timeout;
let count = 0;


connectMongo();


const listener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    device: '/dev/ttyS0', // Correct path for your GPS device
    parse: true
});
listener.connect(() => {
	console.log('Connected to gpsd');

	// Add a 'raw' listener to handle TPV data (Time, Position, Velocity)
	listener.on('TPV', async (tpvData: TPVDATA) => {
		console.log(`Raw`, tpvData)
		if (tpvData.lat && tpvData.lon) {
			const lastEntry = await GPS.findOne().sort({ createdAt: -1 });
			if (lastEntry) {
				const lastEntryLat = lastEntry.latitude;
				const lastEntryLon = lastEntry.longitude;
				const distance = getDistanceFromLatLonInKm(
					lastEntryLat,
					lastEntryLon,
					tpvData.lat,
					tpvData.lon
				);
				if (distance > 0.001) {
					const gps = new GPS({
						latitude: tpvData.lat,
						longitude: tpvData.lon,
						speed: tpvData.speed,
						altitude: tpvData.alt,
						climb: tpvData.climb,
						glassesId: '1'
					});
					await gps.save();
				}

			}
			else {
				const gps = new GPS({
					latitude: tpvData.lat,
					longitude: tpvData.lon,
					speed: tpvData.speed,
					altitude: tpvData.alt,
					climb: tpvData.climb,
					glassesId: '1'
				});
				await gps.save();
			}
		}
	});
	// Start watching for TPV data
	listener.watch();
});

// Handle errors
listener.on('error', (err: any) => {
	console.error(`Error: ${err.message}`);
});
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
	if (count === 0) { 
		// Long press
	}
	if (count === 1) {
		await singleTapHandler();
	}
	else if (count === 2) {
		const temperature = await readTemperature();
		console.log(`The temperature is ${temperature} degree celsius`);
		textToSpeech(`The temperature is ${temperature} degree celsius`);
		await playSpeech();
	}
	else if (count === 3) { 
		// await tripleTapHandler();
	}
}

const singleTapHandler = async () => { 
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
}

process.on('SIGINT', () => {
	touchSensor.unexport();
	irSensor.unexport();
	process.exit();
});

console.log('Awaiting for touch trigger...');
