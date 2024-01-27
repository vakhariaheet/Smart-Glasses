import { exec } from "child_process";
import { readTemperature } from "./Temperature";
import { playSpeech, textToSpeech } from "./TextToSpeech";
import capture from "./ImageCapture";
import imageToText from "./Bard";
import type { Entity, Intent } from "./Record";


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

const handleIntent = async (intents: Intent[], entities: Record<string,Array<Entity>>) => {
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
      await textToSpeech(`Setting volume to ${volume}`);
      await playSpeech();
      setVolume(volume);
      break;
    case 'read_text':
      await capture();
      await textToSpeech('Reading text');
      const text = await imageToText('test.jpeg');
      await textToSpeech(text);
      await playSpeech();
      break;

    default:
      console.log('Invalid intent');
  }
}

export default handleIntent;