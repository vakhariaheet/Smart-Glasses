import gtts from 'gtts';
import PlaySound from 'play-sound';



const textToSpeech = async (text: string, lang = 'en') => {

    try {
        const tts = new gtts(text, lang);
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

interface PlaySoundOptions {
    player?: string;
    opts?: Record<string, any>;
}

const playSpeech = async (
    path?: string, 
    options: Partial<PlaySoundOptions> = { player: 'mplayer' }
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const player = PlaySound(options as any);
        
        player.play(path || 'welcome.mp3', (err: Error | null) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("Done");
        });
    });
};

const playSpeechSync = (path?: string, loop?: boolean) => {
    const player = PlaySound({
        player: 'mplayer',
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

    return { kill, childProcess, pid: childProcess.pid };
}

export { textToSpeech, playSpeech, playSpeechSync };