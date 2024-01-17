const gpsd = require('node-gpsd');


const listener = new gpsd.Listener({
  port: 2947,  // default gpsd port
  hostname: 'localhost',  // default gpsd hostname
  parse: true,
  device : '/dev/ttyS0',
});


listener.connect(() => {
  console.log('Connected to gpsd');

  // Add a 'raw' listener to handle TPV data (Time, Position, Velocity)
  listener.on('TPV', (tpvData) => {
    console.log(`Raw`,tpvData)
    if (tpvData.lat && tpvData.lon) {
      console.log(`Latitude: ${tpvData.lat}, Longitude: ${tpvData.lon}`);
    }
  });
  listener.on('raw', (data) => {
    console.log('Raw GPS Data:', data);
  });
  // Start watching for TPV data
  listener.watch();
});

// Handle errors
listener.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

// Handle socket close event
listener.on('close', () => {
  console.log('Connection closed');
});

// Handle socket error event
listener.on('disconnected', () => {
  console.log('Disconnected from gpsd');
});
