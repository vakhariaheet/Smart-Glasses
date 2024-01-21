import { Gpio } from 'onoff';
import capture from './utils/ImageCapture';
import imageToText from './utils/Bard';
import connectMongo from './utils/connectMongo';
import { textToSpeech, playSpeech } from './utils/TextToSpeech';
import { readTemperature } from './utils/Temperature';
import  { getDistanceFromLatLonInKm } from './utils/GPS';
import CurrentGPS from './Models/CurrentGPS';
import GPSRoute from './Models/GPSRoute';
import GPS, { GGA, RMC } from 'gps';
import { ReadlineParser, SerialPort } from 'serialport';
const touchSensor = new Gpio(17, 'in', 'both');
const irSensor = new Gpio(27, 'in', 'falling');

let timer: NodeJS.Timeout;
let count = 0;


connectMongo();
const port = new SerialPort({
	path: '/dev/ttyS0',
	baudRate: 9600
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
const gps = new GPS

gps.on('data', async (data: GGA | RMC | any) => {
	if (data.type !== 'GGA' || data.type !== 'RMC') return;
	const lastEntry = await GPSRoute.findOne().sort({ createdAt: -1 });
	if (data.type == 'GGA') {
		if (lastEntry) {
			const distance = getDistanceFromLatLonInKm(lastEntry.latitude, lastEntry.longitude, data.lat, data.lon);
			if (distance > 0.1) {
				const gpsData = new GPSRoute({
					latitude: data.lat,
					longitude: data.lon,
					altitude: data.alt,
					speed: null,
					glassesId: '1',
				});
				gpsData.save();
			}
		}
		else {
			const gpsData = new GPSRoute({
				latitude: data.lat,
				longitude: data.lon,
				altitude: data.alt,
				speed: null,
				glassesId: '1',
			});
			gpsData.save();
		}
	}
	if (data.type == 'RMC') {
		if (lastEntry) {
			const distance = getDistanceFromLatLonInKm(lastEntry.latitude, lastEntry.longitude, data.lat, data.lon);
			if (distance > 0.1) {
				const currentGPS = new CurrentGPS({
					latitude: data.lat,
					longitude: data.lon,
					speed: data.speed,
					track: data.track,
				});
				currentGPS.save();
			}
		}
		else {
			const currentGPS = new CurrentGPS({
				latitude: data.lat,
				longitude: data.lon,
				speed: data.speed,
				track: data.track,
			});
			currentGPS.save();
		}
	}
	console.log("GPS:", data);
})

parser.on('data', (data) => {
	console.log("Parser:", data);
	gps.update(data);
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
