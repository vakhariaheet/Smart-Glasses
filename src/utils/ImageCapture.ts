import { StillCamera } from 'pi-camera-connect';
import { playSpeech } from './TextToSpeech';
import { writeFile } from 'fs/promises';
const capture = async (name = 'test.jpeg') => {
    const respBuffer = await new StillCamera({}).takeImage();
    await writeFile(name, respBuffer);
    await playSpeech('./src/assets/sfx/capture.mp3');
    return name;
};

export default capture;
