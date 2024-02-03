import gtts from 'gtts';
import PlaySound from 'play-sound';



const textToSpeech = async (text: string) => {

    try {
        const tts = new gtts(text);
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
    const player = PlaySound({
        player: 'mplayer'
    });
    player.play(path || 'welcome.mp3', function (err) {
        if (err) throw err
        resolve("Done");
    })

});

const playSpeechSync = (path?: string, loop?: boolean) => {
    const player = PlaySound({
        player: 'mplayer'
    });
    const playOptions = loop ? { mplayer: [ '-loop', '999' ] } : {};

    const childProcess = player.play(path || "welcome.mp3", playOptions, (err) => {
        if (err) {
            console.error('Error playing sound:', err);
        }
    });

    const kill = () => {
        childProcess.kill();
    };

    return { kill, childProcess };
}

export { textToSpeech, playSpeech, playSpeechSync };