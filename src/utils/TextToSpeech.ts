import gtts from 'gtts';
import PlaySound from 'play-sound';

const player = PlaySound({});

const textToSpeech = async (text: string) => { 
    try {
        const tts = new gtts(text, 'en');
        return new Promise((resolve, reject) => {
            tts.save('welcome.wav', function (err:any, result:any) {
                if (err) {
                    reject(err);
                }
            });
            resolve("Done")  
        })
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