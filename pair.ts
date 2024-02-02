import bleno from '@abandonware/bleno';
import util from 'util';
import wifi from 'node-wifi';

wifi.init({
    iface: null
});

class PairCharacteristic extends bleno.Characteristic {
    private _updateValueCallback: null;

    constructor() {
        super({
            uuid: '0000ffe1-0000-1000-8000-00805f9b34fb',
            properties: [ 'read', 'write', 'notify', 'writeWithoutResponse' ],
            value: null,

        });

        this.value = Buffer.alloc(0);
        this._updateValueCallback = null;
    }

    onReadRequest(offset: any, callback: any) {
        console.log('PairCharacteristic - onReadRequest: value = ' + this.value?.toString('hex'));
        callback(this.RESULT_SUCCESS, this.value);
    }

    onWriteRequest(data: any, offset: any, withoutResponse: any, callback: any) {
        console.log('Received data:', Buffer.from(data, 'hex').toString('utf8'));
        this.value = data;
        const [ ssid, password ] = Buffer.from(data, 'hex').toString('utf8').split(':');
        console.log('SSID:', ssid);
        console.log('Password:', password);
        if (!ssid || !password) {
            console.log('Invalid SSID or password');
            return;
        }
        wifi.connect({ ssid, password }, () => {
            console.log('Connected to WiFi');
        });
        wifi.getCurrentConnections((currentConnections: any) => {
            console.log(currentConnections);
        })
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
