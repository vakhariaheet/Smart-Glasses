import gtts from 'gtts';
import PlaySound from 'play-sound';

const player = PlaySound({});

const textToSpeech = async (text: string) => {
    try {
        const tts = new gtts(text, 'en');
        return new Promise((resolve, reject) => {
            tts.save('welcome.mp3', function (err: any, result: any) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else resolve("Done")
            });
        })
    }
    catch (err) {
        console.error(err);
    }

}

const playSpeech = async (path?: string) => new Promise((resolve, reject) => {
    const resp = player.play(path || 'welcome.mp3', function (err) {
        if (err) throw err
        resolve("Done");
    })
});

const playSpeechSync = (path?: string, loop?: boolean) => {
    let resp =
        player.play(path || 'welcome.mp3', function (err) {
            if (err) throw err
            if (loop) {
                resp = playSpeechSync(path, loop);
            }
        })

    return resp;
}

export { textToSpeech, playSpeech, playSpeechSync };