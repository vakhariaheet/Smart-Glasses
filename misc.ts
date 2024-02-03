import { ChildProcess, exec } from 'child_process';
import PlaySound from 'play-sound';
import { setTimeout } from 'timers/promises';

const player = PlaySound({});

(async () => {
    const playSoundLoop = (path: string, loop: boolean = false) => {
        let childProcess: ChildProcess | null = null;

        const playSound = () => {
            childProcess = exec(`aplay ${path}`, (err) => {
                if (err) {
                    console.error('Error playing sound:', err);
                } else if (loop) {
                    playSound(); // Play the sound again if loop is true
                }
            });
        };

        playSound();

        const kill = () => {
            if (childProcess) {
                childProcess.kill();
            }
        };

        return { kill, childProcess };
    };
    const res = playSoundLoop('./src/assets/sfx/loading.mp3', true);
    await setTimeout(4000);
    res.kill();
    console.log('Done');
})();



