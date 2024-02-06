import { StreamCamera, Codec } from "pi-camera-connect";
import * as fs from "fs";
import { io } from "socket.io-client";

// Capture 5 seconds of H264 video and save to disk
const runApp = async () => {
    const socket = io('http://192.168.1.5:3000');
    const streamCamera = new StreamCamera({
        codec: Codec.H264
    });

    const videoStream = streamCamera.createStream();

    videoStream.on("data", (data) => {
        console.log('video', data);
        socket.emit('video', data);
    })
    await streamCamera.startCapture();
};