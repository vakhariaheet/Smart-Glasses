import raspividStream from 'raspivid-stream';
import { io } from 'socket.io-client';

const stream = raspividStream();
const socket = io('http://localhost:3000');


console.log('Connected to server');

stream.on('data', (data: any) => {
    socket.emit('video', data);
});

