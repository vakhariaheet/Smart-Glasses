// Record audio and save to file

var fs = require('fs');
var record = require('node-record-lpcm16');
var wav = require('wav');

var file = fs.createWriteStream('test.wav', { encoding: 'binary' });

var fileWriter = new wav.FileWriter('test.wav', {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
});

record.start({
    sampleRate: 48000,
    verbose: true
})
    .pipe(fileWriter);

setTimeout(function () {
    record.stop();
}
    , 5000);

// Path: SmartGlassESraspi/record.js