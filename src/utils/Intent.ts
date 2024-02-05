import { exec } from "child_process";
import { readTemperature } from "./Temperature";
import { playSpeech, playSpeechSync, textToSpeech } from "./TextToSpeech";
import capture from "./ImageCapture";
import type { Entity, Intent } from "./Record";
import imageToText from "./OCR";
import { detectCurrency, generateText } from "./Bard";


function setVolume(volume: number) {
  const command = `amixer sset 'Master' ${volume}%`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error setting volume: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Volume setting command error: ${stderr}`);
      return;
    }

    console.log(`Volume set to ${volume}%`);
  });
}

const handleIntent = async (intents: Intent[], entities: Record<string, Array<Entity>>, transcribe: string) => {
  const intent = intents[ 0 ];


  switch (intent.name) {
    case 'wit$get_temperature':
      const temperature = await readTemperature();
      console.log(`The temperature is ${temperature} degree celsius`);
      await textToSpeech(`The temperature is ${temperature} degree celsius`);
      await playSpeech();
      break;
    case 'volume':
      const volume = entities[ 'wit$number:number' ][ 0 ].value;
      if (volume > 100 || volume < 0) {
        await textToSpeech('Please enter a valid volume, between 0 and 100');
        await playSpeech();
        return;
      };
      setVolume(volume);
      await playSpeech();
      await textToSpeech(`Volume updated to ${volume} percent`);
      break;
    case 'read_text':
      await capture();
      await textToSpeech('Reading text');
      const text = await imageToText('test.jpeg');
      await textToSpeech(text);
      await playSpeech();
      break;

    default:
      if (transcribe.toLowerCase().startsWith('Detect This Currency'.toLowerCase()) || transcribe.toLowerCase().startsWith('Detect This Note'.toLowerCase())) {
        await capture();
        const pro = playSpeechSync('./src/assets/sfx/loading.mp3', true);
        await textToSpeech('Detecting currency');
        const text = await detectCurrency('test.jpeg');
        await textToSpeech(text);
        pro.kill();
        await playSpeech();
        return;
      }
      if (transcribe.toLowerCase().startsWith('Hey'.toLowerCase())) {
        const pro = playSpeechSync('./src/assets/sfx/loading.mp3', true);
        const text = await generateText(transcribe.replace(/Hey Visio/i, ''));
        await textToSpeech(text);
        pro.kill();
        await playSpeech();
      }
      console.log('Invalid intent');
  }
}

export default handleIntent;