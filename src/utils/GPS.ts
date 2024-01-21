import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import GPSModal from '../Models/GPSRoute';
import CurrentGPS from '../Models/CurrentGPS';
import GPS, { GGA, RMC } from 'gps';

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
}

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

const initGPS = async () => {

    const port = new SerialPort({
        path: '/dev/ttyS0',
        baudRate: 9600
    });


    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    const gps = new GPS

    gps.on('data', async (data: GGA | RMC | any) => {
        if (data.type !== 'GGA' || data.type !== 'RMC') return;
        const lastEntry = await GPSModal.findOne().sort({ createdAt: -1 });
        if (data.type == 'GGA') {
            if (lastEntry) {
                const distance = getDistanceFromLatLonInKm(lastEntry.latitude, lastEntry.longitude, data.lat, data.lon);
                if (distance > 0.1) {
                    const gpsData = new GPSModal({
                        latitude: data.lat,
                        longitude: data.lon,
                        altitude: data.alt,
                        speed: null,
                        glassesId: '1',
                    });
                    gpsData.save();
                }
            }
            else {
                const gpsData = new GPSModal({
                    latitude: data.lat,
                    longitude: data.lon,
                    altitude: data.alt,
                    speed: null,
                    glassesId: '1',
                });
                gpsData.save();
            }
        }
        if (data.type == 'RMC') {
            if (lastEntry) {
                const distance = getDistanceFromLatLonInKm(lastEntry.latitude, lastEntry.longitude, data.lat, data.lon);
                if (distance > 0.1) {
                    const currentGPS = new CurrentGPS({
                        latitude: data.lat,
                        longitude: data.lon,
                        speed: data.speed,
                        track: data.track,
                    });
                    currentGPS.save();
                }
            }
            else {
                const currentGPS = new CurrentGPS({
                    latitude: data.lat,
                    longitude: data.lon,
                    speed: data.speed,
                    track: data.track,
                });
                currentGPS.save();
            }
        }
    })

    parser.on('data', (data) => {
        gps.update(data);
    });
}

export default initGPS;