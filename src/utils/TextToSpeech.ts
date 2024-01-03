import { execSync } from "child_process";
import PlaySound from 'play-sound';

const player = PlaySound({});
const addBackSlash = (text:string) => {
    return text.replace(/'/g, "'\\''");
}
const sayText = async (text:string) => { 
    console.log(`Converting to speech...`);
    execSync(`echo '${addBackSlash(text)}' | ~/piper/piper --model ~/piper/en_US-amy-medium.onnx --output_file welcome.wav `)
    console.log(`Playing...`);
    player.play('welcome.wav', function(err){
        if (err) throw err
    })
}

export default sayText;