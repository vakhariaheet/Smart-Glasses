import raspividStream from 'raspivid-stream';
import { io } from 'socket.io-client';

const stream = raspividStream();
const socket = io('http://192.168.1.5:3000');


console.log('Connected to server');

stream.on('data', (data: any) => {
    socket.emit('video', data);
});

// Handle disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});