import Player from 'play-sound';

const player = Player({
    player: 'mplayer'

})


player.play('welcome.mp3', { timeout: 300 }, function (err) {
    if (err) {
        throw err;
    }
});