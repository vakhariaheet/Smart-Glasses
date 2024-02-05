import fs from "fs";
import recorder from "node-record-lpcm16";
import { playSpeech } from "./TextToSpeech";
import axios from "axios";


export const startRecord = async () => {
    const file = fs.createWriteStream('user.wav', { encoding: 'binary' });
    await playSpeech('./src/assets/sfx/start.mp3');
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
    transcribe: string;
}

interface WITRespError {
    message: string;
    isSuccess: false;
}

export const stopRecord = async (recording: any): Promise<WITResp | WITRespError> => {
    if (!recording) return { message: 'No recording found', isSuccess: false };
    recording.stop();
    await playSpeech('./src/assets/sfx/stop.mp3');
    const buffer = fs.readFileSync('user.wav');
    const resp = await axios.post('https://api.wit.ai/speech?client=chromium&lang=en-us&output=json', buffer, {
        headers: {
            Authorization: `Bearer ${process.env.WIT_API_KEY}`,
            'Content-Type': 'audio/wav'
        }
    });
    fs.writeFileSync('wit.json', resp.data);
    const { intents, entities, text } = JSON.parse(getLastChuck(resp.data));

    if (!intents.length) return {
        message: 'No intent detected',
        isSuccess: false
    };

    return { intents, entities, isSuccess: true, transcribe: text };
}