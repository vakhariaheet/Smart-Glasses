import { exec } from "child_process";
import { readTemperature } from "./Temperature";
import { playSpeech, textToSpeech } from "./TextToSpeech";


function setVolume(volume:number) {
    const command = `amixer sset 'PCM' ${volume}%`;
  
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

const handleIntent = async (entities: { [ key: string ]: any[] }) => { 
    const { intent } = entities;
    if (!intent) return;
    const firstIntent = intent[ 0 ];

    switch (firstIntent.value) { 
        case 'get_temperature':
            const temperature = await readTemperature();
            console.log(`The temperature is ${temperature} degree celsius`);
            await textToSpeech(`The temperature is ${temperature} degree celsius`);
            await playSpeech();
            break;
        case 'volume':
            const volume = entities.number[0].value;
            if (volume > 100 || volume < 0) {
               await textToSpeech('Please enter a valid volume, between 0 and 100');
                await playSpeech();
                return;
            };
            await textToSpeech(`Setting volume to ${volume}`);
            await playSpeech();
            setVolume(volume);
            break;
        
        default:
            console.log('Invalid intent');
    }
}

export default handleIntent;