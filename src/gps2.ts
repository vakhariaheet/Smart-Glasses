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
    // if(data.type == 'RMC') {
    //     console.log("GPS:", data);
    // }
    fs.appendFileSync('gps.json', JSON.stringify(data));
})

parser.on('data', (data) => {
    if (data.startsWith('$GPGGA') || data.startsWith('$GPRMC') || data.startsWith('$GNRMC') || data.startsWith('$GNGGA')) {
        gps.update(data);
    } else {
       
    }
});

port.on('error', (err) => {
    console.error('Error: ', err.message);
})

port.close((err) => {
    if (err) {
        console.error('Error closing port:', err.message);
    } else {
        console.log('Serial port closed');
    }
});


