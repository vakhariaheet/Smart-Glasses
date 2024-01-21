import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import fs from 'fs';
import GPS from 'gps';

const port = new SerialPort({
    path: '/dev/ttyS0',
    baudRate: 9600
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
const gps = new GPS

gps.on('data', (data) => {
    if(data.type == 'RMC') {
        console.log("GPS:", data);
    }
    fs.appendFileSync('gps.json', JSON.stringify(data,null,2) + '\n');
})

parser.on('data', (data) => {
    console.log("Parser:", data);
    gps.update(data);
});


port.close((err) => {
    if (err) {
        console.error('Error closing port:', err.message);
    } else {
        console.log('Serial port closed');
    }
});


