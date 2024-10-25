const Player = require('play-sound');

const player = new Player({
    player: 'mplayer'
});
player.play('welcome.mp3');