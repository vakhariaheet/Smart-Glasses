import { Gpio } from 'onoff';

const sensorPin = 17; // GPIO17 or the pin you connected the OUT of LM35 to
const sensor = new Gpio(sensorPin, 'in', 'rising');

// Function to read temperature from LM35
function readTemperature() {
    const reading = sensor.readSync();
    const millivolts = (reading / 1) * 3300; // Assuming LM35 directly connected to GPIO without resistors
    const temperatureCelsius = millivolts / 10;

    return temperatureCelsius;
}

// Read temperature and log it
const temperature = readTemperature();
console.log(`Temperature: ${temperature.toFixed(2)}°C`);

// Unexport GPIO pin
sensor.unexport();
