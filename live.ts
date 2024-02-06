import { io } from 'socket.io-client';
import { StreamCamera, Codec, Flip, SensorMode } from 'pi-camera-connect';
const socket = io('http://localhost:3000');

const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
    flip: Flip.Vertical,
    sensorMode: SensorMode.Mode6
});


socket.on('connect', () => {
    socket.sendBuffer = [];


    console.log("Connected to the server!" + socket.id);
})


streamCamera.on('frame', (data: any) => {
    socket.emit('video', "data:image/jpeg;base64," + data.toString("base64"));
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