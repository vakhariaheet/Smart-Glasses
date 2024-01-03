import { Gpio } from "onoff";
import capture from "./utils/ImageCapture";
import imageToText from "./utils/Bard";
import sayText from "./utils/TextToSpeech";
import dotenv from 'dotenv';

const touchSensor = new Gpio(17, "in", "both");

touchSensor.watch( async (err, value) => {
  if (err) {
    throw err;
  }
  if(!value) {
      console.log("Capturing image...");
      const image = await capture();
      console.log("Image captured");
      const text = await imageToText('test.jpeg');
      console.log("Text generated");  
      await sayText(text);
        console.log("Text spoken");
  }
});

process.on("SIGINT", () => {
    touchSensor.unexport();
    process.exit();
});