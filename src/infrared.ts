import { Gpio } from "onoff";

const infraredSensor = new Gpio(27, 'in', 'both');

infraredSensor.watch((err, value) => {
    if (err) {
        console.error('Error:', err);
        return;
    }

    if (value === 0) {
        console.log('IR Sensor activated: Object detected');
    } else {
        console.log('IR Sensor deactivated: No object detected');
    }
});

// Handle script termination
process.on('SIGINT', () => {
    infraredSensor.unexport();
    process.exit();
});
