import {SerialPort} from 'serialport';
import  ReadLine from '@serialport/parser-readline';
import nmea from 'nmea-simple';
const port = new SerialPort({
    path: '/dev/ttyS0',
    baudRate: 9600
});


const parser = port.pipe(new ReadLine.ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    const gpsData = nmea.parseNmeaSentence(data);
    console.log(gpsData);
});




