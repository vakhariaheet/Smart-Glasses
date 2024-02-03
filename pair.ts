import bleno from '@abandonware/bleno';
import util from 'util';
import wifi from 'node-wifi';

wifi.init({
    iface: null
});

const connectToWifi = (ssid: string, password: string) => new Promise((resolve, reject) => {
    wifi.connect({ ssid, password }, () => {
        resolve("Connected to WiFi");
    });
})

function getWifiConnections(): Promise<any> {
    return new Promise((resolve, reject) => {
        wifi.getCurrentConnections((err: any, currentConnections) => {
            if (err) {
                reject(err);
            }
            resolve(currentConnections);
        });
    });
}


class PairCharacteristic extends bleno.Characteristic {
    private _updateValueCallback: null;
    private currentWifi: string;
    constructor() {
        super({
            uuid: '0000ffe1-0000-1000-8000-00805f9b34fb',
            properties: [ 'read', 'write', 'notify', 'writeWithoutResponse' ],
            value: null,

        });
        getWifiConnections().then((connections) => {
            if (connections.length > 0)
                this.currentWifi = connections[ 0 ].ssid;
            else {
                this.currentWifi = '';
            }

        });
        this.value = Buffer.alloc(0);
        this._updateValueCallback = null;
    }

    onReadRequest(offset: any, callback: any) {
        console.log('PairCharacteristic - onReadRequest: value = ' + this.value?.toString('hex'));
        callback(this.RESULT_SUCCESS, this.currentWifi ? Buffer.from(this.currentWifi) : Buffer.alloc(0));
    }

    async onWriteRequest(data: any, offset: any, withoutResponse: any, callback: any) {
        console.log('Received data:', Buffer.from(data, 'hex').toString('utf8'));
        this.value = data;
        const [ ssid, password ] = Buffer.from(data, 'hex').toString('utf8').split(':');
        console.log('SSID:', ssid);
        console.log('Password:', password);
        if (!ssid || !password) {
            console.log('Invalid SSID or password');
            return;
        }
        try {
            await connectToWifi(ssid, password);
            const currentConnections = await getWifiConnections() as wifi.WiFiNetwork[];

            const { ssid: connectedSsid } = currentConnections[ 0 ];
            if (connectedSsid === ssid) {
                console.log('Connected to WiFi:', ssid);
                this.currentWifi = ssid;
                callback(this.RESULT_SUCCESS);
            }
            else {
                console.log('Failed to connect to WiFi:', ssid);
                callback(this.RESULT_UNLIKELY_ERROR);
            }
        } catch (err) {
            console.log('Error connecting to WiFi:', err);
        }

        console.log('PairCharacteristic - onWriteRequest: value = ' + this.value?.toString('hex'));
        callback(this.RESULT_SUCCESS);
    }


    onSubscribe(maxValueSize: any, updateValueCallback: any) {
        console.log('PairCharacteristic - onSubscribe');
        this._updateValueCallback = updateValueCallback;
    }

    onUnsubscribe() {
        console.log('PairCharacteristic - onUnsubscribe');
        this._updateValueCallback = null;
    }



}


bleno.on('stateChange', (state: string) => {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising('SmartGlassESraspi', [ '0000ffe0-0000-1000-8000-00805f9b34fb' ]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', (error: any) => {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([
            new bleno.PrimaryService({
                uuid: '0000ffe0-0000-1000-8000-00805f9b34fb',
                characteristics: [
                    new PairCharacteristic()
                ]
            })
        ]);
    }
});
