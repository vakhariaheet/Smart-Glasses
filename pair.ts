import bleno from '@abandonware/bleno';
import util from 'util';

class PairCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: '0000ffe1-0000-1000-8000-00805f9b34fb',
            properties: [ 'read', 'write' ],
            value: null
        });
    }

    onReadRequest(offset, callback) {
        console.log('PairCharacteristic - onReadRequest: value = ' + (this.value ? this.value.toString('hex') : 'null'));

        callback(this.RESULT_SUCCESS, this.value);
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        if (data) {
            this.value = data;
            console.log('PairCharacteristic - onWriteRequest: value = ' + this.value?.toString('hex'));
        } else {
            console.log('PairCharacteristic - onWriteRequest: data is null or undefined');
        }

        callback(this.RESULT_SUCCESS);
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
