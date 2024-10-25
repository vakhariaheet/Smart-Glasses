import Player from 'play-sound';

const player = Player({
    player: 'mplayer'

})


player.play('welcome.mp3', function (err) {
    if (err) {
        throw err;
    }
});