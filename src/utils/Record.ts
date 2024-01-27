import fs from "fs";
import recorder from "node-record-lpcm16";
import axios from "axios";


export const startRecord = () => {
    const file = fs.createWriteStream('user.wav', { encoding: 'binary' });
    const recording = recorder.record({
        sampleRate: 16000,
        threshold: 0.5,
        silence: '1.0',
        audioType: 'wav',
    });
    recording
        .stream()
        .pipe(file)
    setTimeout(() => {
        recording.stop();
    }, 10000)
    return recording;
}

const getLastChuck = (resp: string) => {
    const lastChuck = resp.split(/\n(?={)/);
    return lastChuck[ lastChuck.length - 1 ];
};

export interface Intent {
    confidence: number,
    id: string,
    name: string
}

export interface Entity {
    body: string;
    confidence: number;
    end: number;
    entities: {};
    id: string;
    name: string;
    role: string;
    start: number;
    type: string;
    value: number;
}

export interface WITResp {
    intents: Array<Intent>
    entities: {
        [ key: string ]: Array<Entity>
    }
    isSuccess: true;
}

interface WITRespError {
    message: string;
    isSuccess: false;
}

export const stopRecord = async (recording: any): Promise<WITResp | WITRespError> => {
    recording.stop();
    const buffer = fs.readFileSync('user.wav');
    const resp = await axios.post('https://api.wit.ai/speech?client=chromium&lang=en-us&output=json', buffer, {
        headers: {
            Authorization: `Bearer ${process.env.WIT_API_KEY}`,
            'Content-Type': 'audio/wav'
        }
    });
    fs.writeFileSync('wit.json', resp.data);
    const { intents, entities } = JSON.parse(getLastChuck(resp.data));
    
   console.log(JSON.parse(getLastChuck(resp.data)));
    if (!intents.length) return {
        message: 'No intent detected',
        isSuccess: false
    };

    return { intents, entities, isSuccess: true };
}