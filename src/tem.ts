import { Gpio } from 'onoff';

const sensorPin = 17; // GPIO17 or the pin you connected the OUT of LM35 to
const sensor = new Gpio(sensorPin, 'in', 'both'); // 'both' triggers on both rising and falling edges

// Function to read temperature from LM35
function readTemperature() {
    const reading = sensor.readSync();
    console.log(`Reading: ${reading}`);
    const millivolts = (reading / 1) * 3300; // Assuming LM35 directly connected to GPIO without resistors
    const temperatureCelsius = millivolts / 10;

    return temperatureCelsius;
}

// Read temperature multiple times and average for better accuracy
const readings = [];
let temperature = 0;
for (let i = 0; i < 10; i++) {
    temperature = readTemperature();
    console.log(`Temperature: ${temperature.toFixed(2)}°C`);
    readings.push(temperature);
}

// Calculate average temperature
const averageTemperature = readings.reduce((sum, value) => sum + value, 0) / readings.length;

// Log the average temperature
console.log(`Average Temperature: ${averageTemperature.toFixed(2)}°C`);

// Unexport GPIO pin
sensor.unexport();
