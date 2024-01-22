import {gTTS} from 'gtts.js';
import PlaySound from 'play-sound';

const player = PlaySound({});

const textToSpeech = async (text: string) => { 
    try {
        const gtts = new gTTS(text, 'en');
        await gtts.save('welcome.wav');
    }
    catch (err) { 
        console.error(err);
    }

}

const playSpeech = async () => new Promise((resolve, reject) => {
    player.play('welcome.wav', function (err) {
        if (err) throw err
        resolve("Done");
    })
});

export {textToSpeech , playSpeech};