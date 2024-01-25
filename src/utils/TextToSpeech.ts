import gtts from 'gtts';
import PlaySound from 'play-sound';

const player = PlaySound({});

const textToSpeech = async (text: string) => { 
    try {
        const tts = new gtts(text, 'en');
        return new Promise((resolve, reject) => {
            tts.save('welcome.mp3', function (err:any, result:any) {
                if (err) {
                    console.error(err);
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
    player.play('welcome.mp3', function (err) {
        if (err) throw err
        resolve("Done");
    })
});

export {textToSpeech , playSpeech};