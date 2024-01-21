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

   
}

export default initGPS;