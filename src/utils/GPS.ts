import * as gpsd from 'node-gpsd';
import { TPVDATA } from '../types';
import GPS from '../Models/GPS';


const listener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    device: '/dev/ttyS0', // Correct path for your GPS device
    parse: true
  });
  
const deg2rad = (deg: number) => { 
    return deg * (Math.PI/180)
}

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => { 
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1); // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}
  listener.connect(() => {
    console.log('Connected to gpsd');
  
    // Add a 'raw' listener to handle TPV data (Time, Position, Velocity)
    listener.on('TPV', async (tpvData:TPVDATA) => {
      console.log(`Raw`,tpvData)
        if (tpvData.lat && tpvData.lon) {
            const lastEntry = await GPS.findOne().sort({ createdAt: -1 });
            if (lastEntry) {
                const lastEntryLat = lastEntry.latitude;
                const lastEntryLon = lastEntry.longitude;
                const distance = getDistanceFromLatLonInKm(
                    lastEntryLat,
                    lastEntryLon,
                    tpvData.lat,
                    tpvData.lon
                );
                if (distance > 0.001) {
                    const gps = new GPS({
                        latitude: tpvData.lat,
                        longitude: tpvData.lon,
                        speed: tpvData.speed,
                        altitude: tpvData.alt,
                        climb: tpvData.climb,
                        glassesId: '1'
                    });
                    await gps.save();
                }
            
            }
            else {
                const gps = new GPS({
                    latitude: tpvData.lat,
                    longitude: tpvData.lon,
                    speed: tpvData.speed,
                    altitude: tpvData.alt,
                    climb: tpvData.climb,
                    glassesId: '1'
                });
                await gps.save();
            }
      }
    });
    // Start watching for TPV data
    listener.watch();
  });
  
  // Handle errors
  listener.on('error', (err:any) => {
    console.error(`Error: ${err.message}`);
  });
  