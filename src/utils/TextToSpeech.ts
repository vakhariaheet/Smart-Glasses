import { execSync } from "child_process";
import PlaySound from 'play-sound';

const player = PlaySound({});
const addBackSlash = (text: string) => {
    return text.replace(/'/g, "'\\''");
}

const textToSpeech = (text: string) => {
    execSync(`echo '${addBackSlash(text)}' | ~/piper/piper --model ~/piper/en_US-amy-medium.onnx --output-raw | aplay -r 22050 -f S16_LE -t raw - `)
}

// const playSpeech = async () => new Promise((resolve, reject) => {
//     player.play('welcome.wav', function (err) {
//         if (err) throw err
//         resolve("Done");
//     })
// });

export { textToSpeech, playSpeech };