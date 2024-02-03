import Wifi, { WiFiNetwork } from 'node-wifi';
import fs from 'fs';

Wifi.init({
    iface: null
});

interface WifiCredentials {
    ssid: string;
    password: string;
}

export const connectToWifi = (ssid: string, password: string) => new Promise((resolve, reject) => {
    Wifi.connect({ ssid, password }, () => {
        resolve("Connected to WiFi");
    });

    const savedWifis = JSON.parse(fs.readFileSync('wifis.json', 'utf8'));

    if (!savedWifis.find((wifi: WifiCredentials) => wifi.ssid === ssid)) {
        savedWifis.push({
            ssid,
            password
        });
        fs.writeFileSync('wifis.json', JSON.stringify(savedWifis));
    }
})
export const getAllAvailableWifi = () => new Promise((resolve: (value: Wifi.WiFiNetwork[] | PromiseLike<Wifi.WiFiNetwork[]>) => void, reject) => {
    Wifi.scan((err: any, networks) => {
        if (err) {
            reject(err);
        }
        resolve(networks);
    });
})
export const isInternetConnected = async () => new Promise((resolve, reject) => {
    require('dns').resolve('www.google.com', function (err: any) {
        if (err) {
            reject(false);
        } else {
            resolve(true);
        }
    });
})

export function getWifiConnection(): Promise<WiFiNetwork> {
    return new Promise((resolve, reject) => {
        Wifi.getCurrentConnections((err: any, currentConnections) => {
            if (err) {
                reject(err);
            }
            resolve(currentConnections[ 0 ]);
        });
    });
}

export const initWifi = async () => {
    const currentConnection = await getWifiConnection();

    if (currentConnection) {
        const isInternet = await isInternetConnected();
        if (isInternet)
            return {
                message: `Connected to WiFi: ${currentConnection.ssid}`,
                isSuccess: true
            };
        else {
            console.log('No internet connection');
            return {
                message: 'No internet connection',
                isSuccess: false
            }
        }
    }
    const savedWifis = JSON.parse(fs.readFileSync('wifis.json', 'utf8'));
    const availableWifi = await getAllAvailableWifi() as WiFiNetwork[];
    const savedWifi = availableWifi.find((wifi) => savedWifis.includes(wifi.ssid));
    const wifiCredentials = savedWifis.find((wifi: WifiCredentials) => wifi.ssid === savedWifi?.ssid);
    if (savedWifi) {
        await connectToWifi(wifiCredentials.ssid, wifiCredentials.password);
        console.log('Connected to WiFi:', wifiCredentials.ssid);
        console.log('Checking internet connection...');
        const isInternet = await isInternetConnected();
        if (!isInternet) {
            console.log('No internet connection');
            return {
                message: 'No internet connection',
                isSuccess: false
            }
        }
        return {
            message: `Connected to WiFi: ${wifiCredentials.ssid}`,
            isSuccess: true
        }
    }
    else {
        console.log('No saved WiFi found');
        return {
            message: 'No saved WiFi found',
            isSuccess: false
        }
    }

}


