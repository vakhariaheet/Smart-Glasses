import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parseNmeaSentence } from 'nmea-simple';
import GPS from 'gps';
const port = new SerialPort({
    path: '/dev/ttyS0',
    baudRate: 9600
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
const gps = new GPS;

gps.on('data', data => {
    console.log(data, gps.state);
})

parser.on('data', (data) => {
    console.log(data);
    gps.updatePartial(data);
});




