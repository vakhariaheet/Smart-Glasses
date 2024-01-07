import { Gpio } from "onoff";
const triggerPin = new Gpio(17, 'out');
const echoPin = new Gpio(18, 'in', 'both');


let startTick:[number, number];

// Trigger a pulse when a button is pressed
const triggerPulse = () => {
    triggerPin.writeSync(1); // Set trigger pin high
    setTimeout(() => {
        triggerPin.writeSync(0); // Set trigger pin low after 10 microseconds
    }, 10);
};

triggerPulse(); // Trigger the initial pulse

// Listen for changes in the echo pin
echoPin.watch((err, value) => {
    if (err) {
        throw err;
    }

    if (value === 1) {
        startTick = process.hrtime();
    } else {
        const endTick = process.hrtime(startTick);
        const pulseDuration = endTick[0] * 1e6 + endTick[1] / 1e3; // Convert to microseconds
        const distance = (pulseDuration / 2) / 29.1; // Convert to centimeters (speed of sound is approximately 343 meters/second)

        console.log(`Distance: ${distance.toFixed(2)} cm`);
        triggerPulse(); // Trigger another pulse
    }
});

// Handle script termination
process.on('SIGINT', () => {
    triggerPin.writeSync(0); // Make sure trigger pin is low before exiting
    echoPin.unexport();
    process.exit();
});
