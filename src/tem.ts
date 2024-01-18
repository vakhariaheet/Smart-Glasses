import * as spi from 'spi-device';

const sensorChannel = 0; // Channel on the MCP3008 ADC chip
const spiOptions:spi.SpiOptions = {
  mode: 0, // Correct mode for MCP3008
  maxSpeedHz: 1350000 // MCP3008 supports up to 2.048MHz
};

// Create SPI device
const device = spi.openSync(0, 0, spiOptions);

// Function to read temperature from LM35
function readTemperature() {
  const message = [{
    sendBuffer: Buffer.from([0x01, (8 + sensorChannel) << 4, 0x00]),
    receiveBuffer: Buffer.alloc(3),
    byteLength: 3,
    speedHz: spiOptions.maxSpeedHz
  }];

  device.transferSync(message);

  const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) + message[0].receiveBuffer[2];
  const millivolts = (rawValue / 1023) * 3300; // 3.3V is the Raspberry Pi voltage
  const temperatureCelsius = millivolts / 10;

  return temperatureCelsius;
}

// Read temperature and log it
const temperature = readTemperature();
console.log(`Temperature: ${temperature.toFixed(2)}°C`);

// Close SPI device
device.closeSync();
