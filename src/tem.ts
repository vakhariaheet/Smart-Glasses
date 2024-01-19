import * as sensor from 'node-dht-sensor';

const sensorType = 11; // DHT11 sensor type
const sensorPin = 17; // GPIO17 or the pin you connected the DHT11 sensor to

// Read data from the DHT11 sensor
sensor.read(sensorType, sensorPin, (err, temperature, humidity) => {
  if (!err) {
    console.log(`Temperature: ${temperature.toFixed(2)}°C, Humidity: ${humidity.toFixed(2)}%`);
  } else {
    console.error(`Error reading from DHT11 sensor: ${err}`);
  }
});
