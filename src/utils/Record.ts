import fs from "fs";
import recorder from "node-record-lpcm16";
import axios from "axios";


export const startRecord = () => {
    const recording = recorder.record({
        sampleRate: 16000,
        threshold: 0.5,
        silence: '1.0',
        audioType: 'wav',
    });
    recording
        .stream()
        .file('user.wav')
    setTimeout(() => { 
        recording.stop();
    },10000)
    return recording;
}

export const stopRecord = async (recording: any) => {
    recording.stop();
    const buffer = fs.readFileSync('user.wav');
    const resp = await axios.post('https://api.wit.ai/speech?client=chromium&lang=en-us&output=json', buffer, {
        headers: {
            Authorization: `Bearer ${process.env.WIT_API_KEY}`,
            'Content-Type': 'audio/wav'
        }
    });
    const { outcomes } = resp.data;
    const { entities } = outcomes[ 0 ];
    return entities;
}