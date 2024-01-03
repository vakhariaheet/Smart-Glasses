import { Gpio } from "onoff";
import capture from "./utils/ImageCapture";
import imageToText from "./utils/Bard";
import { textToSpeech,playSpeech } from "./utils/TextToSpeech";

const touchSensor = new Gpio(17, "in", "both");

touchSensor.watch(async (err, value) => {
    if (err) {
        throw err;
    }
    if (!value) {
        const startTime = Date.now();
        console.log("Capturing image...");
        const image = await capture();
        console.log("Image captured");
        const text = await imageToText('test.jpeg');
        console.log("Text generated");
        console.log("Converting text to speech...");
        await textToSpeech(text);
        console.log("Speech generated");
        const timeTaken = Date.now() - startTime;
        console.log(`Time taken: ${timeTaken}ms`);
        console.log("Playing speech...");
        await playSpeech();
        console.log("Text spoken");
    }
});

process.on("SIGINT", () => {
    touchSensor.unexport();
    process.exit();
});

console.log("Awaiting for touch trigger...");