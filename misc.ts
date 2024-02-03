import PlaySound from 'play-sound';
import { setTimeout } from 'timers/promises';

const player = PlaySound({});

(async () => {
    console.log(__dirname + '/src/assets/sfx/camera.mp3');

    const pro = player.play(__dirname + '/src/assets/sfx/loading.mp3', function (err) {
        if (err) throw err
        console.log("Done");
    });
    await setTimeout(3000);
    console.log('Done');
    pro.kill();
})();



