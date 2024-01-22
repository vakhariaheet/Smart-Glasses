import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import GPS, { RMC } from 'gps';
import axios from 'axios';

const initGPS = async () => {

    const port = new SerialPort({
        path: '/dev/ttyS0',
        baudRate: 9600
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    const gps = new GPS

    gps.on('data', async (data: RMC) => {
        if (data.type !== 'RMC') return;
        console.log(data);
        await axios.post(`${process.env.BACKEND_URL}/api/update-coors`, {
            latitude: data.lat,
            longitude: data.lon,
            speed: data.speed,
            track: data.track,
            glasses_id: 1,
            code: process.env.CODE
        });
    });

    parser.on('data', (data) => {
        gps.update(data);
    });

    // Handle the process termination event
    const handleExit = async () => {
        // Close the serial port
        port.close((err) => {
            if (err) {
                console.error('Error closing port:', err.message);
            } else {
                console.log('Serial port closed');
            }
            process.exit();
        });
    };

    // Register the handleExit function to be called on process termination
    process.on('SIGINT', handleExit);
    process.on('SIGTERM', handleExit);
};

export default initGPS;
