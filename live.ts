import raspividStream from 'raspivid-stream';
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.5:3000');


setInterval(() => {
    socket.emit('video', 'Hello, world!');
}, 1000)