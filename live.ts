const io = require('socket.io-client');
const { StreamCamera, Codec, Flip, SensorMode } = require('pi-camera-connect');
const socket = io.connect('http://xxx.xxx.xxx.xxx:3000/iot');

const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
    flip: Flip.Vertical,
    sensorMode: SensorMode.Mode6
});


socket.on('connect', () => {
    socket.sendBuffer = [];

    socket.emit("pi-cam-init", "Cam-1");

    console.log("Connected to the server!" + socket.id);
})

socket.on('new-consumer', (data) => {
    console.log(data + ' has join the stream');
});

socket.on('consumer-left', (data) => {
    console.log(data + ' has left the stream');
});

streamCamera.on('frame', (data) => {
    socket.binary(true).emit('video', 'Cam-1', "data:image/jpeg;base64," + data.toString("base64"));
});


async function cameraStartCapture() {
    await streamCamera.startCapture();
}

async function cameraStopCapture() {
    await streamCamera.stopCapture();
}

cameraStartCapture().then(() => {
    console.log('Camera is now capturing');
});