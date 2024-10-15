import {Gpio} from 'pigpio';

const touchSensor = new Gpio(22, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    alert: true
});
console.log('Started');

const handleStateChange = (level: number) => { 
    console.log('Touch sensor level: ', level);
    if (level === 1) {
        console.log('Touch sensor tapped');
    }
}
touchSensor.on('alert', handleStateChange)


process.on('SIGINT', () => {
    touchSensor.off('alert', handleStateChange);
    process.exit();
  });