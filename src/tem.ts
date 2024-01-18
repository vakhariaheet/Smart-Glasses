import * as rpio from 'rpio';

const sensorPin = 17; // GPIO17 or the pin you connected the OUT of LM35 to

// Set up the GPIO
rpio.open(sensorPin, rpio.INPUT, rpio.ANALOG);

// Function to read temperature from LM35
function readTemperature() {
    const reading = rpio.readadc(sensorPin, 0);
    const millivolts = (reading / 1023) * 3300; // 3.3V is the Raspberry Pi voltage
    const temperatureCelsius = millivolts / 10;

    return temperatureCelsius;
}

// Read temperature and log it
const temperature = readTemperature();
console.log(`Temperature: ${temperature.toFixed(2)}°C`);

// Close GPIO pin
rpio.close(sensorPin);
