import { Gpio } from 'onoff';

const temperatureSensor = new Gpio(17, 'in', 'both');

temperatureSensor.watch(async (err, value) => {
	if (err) {
		throw err;
	}
    console.log('Temperature Sensor activated: Temperature detected');
    console.log(value);
});

// Handle script termination

process.on('SIGINT', () => {
    temperatureSensor.unexport();
    process.exit();
});