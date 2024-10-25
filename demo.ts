import Player from 'play-sound';

const player = Player({
    player: 'mplayer'
});
player.play('welcome.mp3', {}, (err) => {
    if (err) throw err;
    
})