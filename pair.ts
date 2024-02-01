import bleno from 'bleno';
import util from 'util';

class PairCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: '0000ffe1-0000-1000-8000-00805f9b34fb',
            properties: [ 'read', 'write' ],
            value: null
        });
    }

    onReadRequest(offset: number, callback: any) {
        console.log('PairCharacteristic - onReadRequest: value = ' + this.value?.toString('hex'));

        callback(this.RESULT_SUCCESS, this.value);
    }

    onWriteRequest(data: Buffer, offset: number, withoutResponse: boolean, callback: any) {
        this.value = data;

        console.log('PairCharacteristic - onWriteRequest: value = ' + this.value.toString('hex'));

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
