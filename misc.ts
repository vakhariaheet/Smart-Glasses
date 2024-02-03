import PlaySound from 'play-sound';
import { setTimeout } from 'timers/promises';

const player = PlaySound({
    player: 'mplayer'
});

(async () => {
    const playSpeechSync = (path?: string, loop?: boolean) => {
        return player.play(path || 'welcome.mp3', {
            mplayer: [ '-loop', loop ? '0' : '999' ]
        }, function (err) {
            if (err) throw err

        })
    }
    const res = playSpeechSync('./src/assets/sfx/start.mp3', true);
    await setTimeout(4000);
    res.kill();
})();



