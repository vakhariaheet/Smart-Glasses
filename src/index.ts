import { Gpio } from 'onoff';
import capture from './utils/ImageCapture';
import imageToText from './utils/Bard';
import { textToSpeech, playSpeech } from './utils/TextToSpeech';

const touchSensor = new Gpio(17, 'in', 'both');

touchSensor.watch(async (err, value) => {
	if (err) {
		throw err;
	}
	if (!value) {
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
});

process.on('SIGINT', () => {
	touchSensor.unexport();
	process.exit();
});

console.log('Awaiting for touch trigger...');
