import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parseNmeaSentence } from 'nmea-simple';
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


