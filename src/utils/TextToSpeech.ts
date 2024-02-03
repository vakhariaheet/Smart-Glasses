import gtts from 'gtts';
import PlaySound from 'play-sound';

const player = PlaySound({
    player: 'mplayer'
});

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
    player.play(path || 'welcome.mp3', function (err) {
        if (err) throw err
        resolve("Done");
    })

});

const playSpeechSync = (path?: string, loop?: boolean) => {
    return player.play(path || 'welcome.mp3', {
        mplayer: [ '-loop', loop ? '0' : '999' ]
    }, function (err) {
        if (err) throw err;
    })
}

export { textToSpeech, playSpeech, playSpeechSync };