import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import fs from 'fs';
import GPS from 'gps';
import mysql from 'mysql2/promise';

const port = new SerialPort({
    path: '/dev/ttyS0',
    baudRate: 9600
});

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
}

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

const pool = mysql.createPool({
   uri:process.env.DB_URI
});

(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS gps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            latitude FLOAT,
            longitude FLOAT,
            altitude FLOAT,
            glassesId INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS gpsRoute (
            id INT AUTO_INCREMENT PRIMARY KEY,
            latitude FLOAT,
            longitude FLOAT,
            altitude FLOAT,
            glassesId INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    
 })();


const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
const gps = new GPS

gps.on('data', async (data) => {
    if (data.type !== 'GGA' && data.type !== 'RMC') return;
    const [lastEntry] = await pool.query('SELECT * FROM gpsRoute ORDER BY createdAt DESC LIMIT 1') as any;
    if (data.type == 'GGA') {
        if (lastEntry) {
            const distance = getDistanceFromLatLonInKm(lastEntry.latitude, lastEntry.longitude, data.lat, data.lon);
            if (distance > 0.1) {
                await pool.query('INSERT INTO gpsRoute (latitude, longitude, altitude, glassesId) VALUES (?, ?, ?, ?)', [data.lat, data.lon, data.alt, 1]);
            }
        }
        else {
            await pool.query('INSERT INTO gpsRoute (latitude, longitude, altitude, glassesId) VALUES (?, ?, ?, ?)', [data.lat, data.lon, data.alt, 1]);
        }   
    }
    if (data.type == 'RMC') {
        if (lastEntry) {
            const distance = getDistanceFromLatLonInKm(lastEntry.latitude, lastEntry.longitude, data.lat, data.lon);
            if (distance > 0.1) {
                //    Store in gpsRoute table
                await pool.query('INSERT INTO gpsRoute (latitude, longitude, speed, glassesId) VALUES (?, ?, ?, ?)', [data.lat, data.lon, data.speed, 1]);
            }
        }
        else {
            await pool.query('INSERT INTO gpsRoute (latitude, longitude, speed, glassesId) VALUES (?, ?, ?, ?)', [data.lat, data.lon, data.speed, 1]);
        }   
    }
    console.log(data);
    // fs.appendFileSync('gps.json', JSON.stringify(data));
})

parser.on('data', (data) => {
    if (data.startsWith('$GPGGA') || data.startsWith('$GPRMC') || data.startsWith('$GNRMC')) {
        console.log('Received valid data:', data);
        gps.update(data);
    } else {
        console.log('Ignored garbage value:', data);
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


