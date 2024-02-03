import { libcamera } from 'libcamera';
import { playSpeech } from './TextToSpeech';
const capture = async (name = 'test.jpeg') => {
    const resp = await libcamera.jpeg({
        config: {
            output: name
        }
    })
    await playSpeech('./src/assets/sfx/capture.mp3')
    return resp;
}

export default capture;