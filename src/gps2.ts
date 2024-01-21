import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import {parseNmeaSentence} from 'nmea-simple';
const port = new SerialPort({
    path: '/dev/ttyS0',
    baudRate: 9600
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    console.log(data);
    const gpsData = parseNmeaSentence(data);
    console.log(gpsData);
});




