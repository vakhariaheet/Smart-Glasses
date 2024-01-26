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
    },10000)
    return recording;
}
const readFile = (path: string) => new Promise((resolve, reject) => { 
    fs.readFile(path, (err, data) => { 
        if (err) reject(err);
        resolve(data);
    })
})

export const stopRecord = async (recording: any) => {
    recording.stop();
    const buffer = await readFile('user.wav');
    const resp = await fetch({
        method: 'post',
        url: 'https://api.wit.ai/speech',
        data: buffer,
        headers: {
            'Authorization': `Bearer ${process.env.WIT_API_KEY}`,
            'Content-Type': 'audio/wav',
            'Transfer-Encoding': 'chunked',
        },
    
    })
    const data = await resp.json();
    console.log(JSON.stringify(data),"resp");
    const { outcomes } = data;

    if (!outcomes?.length) throw new Error('No entities found');

    const { entities } = outcomes?.[ 0 ];
    return entities;
}