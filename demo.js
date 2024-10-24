const Gpio = require('pigpio').Gpio;

class RGBLed {
	constructor() {
		// Initialize pins - define them as output
		this.redLED = new Gpio(16, { mode: Gpio.OUTPUT });
		this.greenLED = new Gpio(20, { mode: Gpio.OUTPUT });
		this.blueLED = new Gpio(21, { mode: Gpio.OUTPUT });
	}

	// Set color method (values from 0-255)
	setColor(color) {
		// Invert values for common anode
		this.redLED.pwmWrite(255 - color.r);
		this.greenLED.pwmWrite(255 - color.g);
		this.blueLED.pwmWrite(255 - color.b);
	}

	// Turn off all LEDs
	turnOff() {
		this.setColor({ r: 254, g: 254, b: 254 });
	}
	generateRandomColor() {
		return {
			r: Math.floor(Math.random() * 256),
			g: Math.floor(Math.random() * 256),
			b: Math.floor(Math.random() * 256),
		};
	}
	// Example color sequence
	async showColors() {
        count = 0;
		while (count < 5) {
			this.setColor(this.generateRandomColor());
            await this.delay(1000);
            this.fade(this.generateRandomColor(), 1000);
            await this.delay(1000);
            count++;
        }
        this.setColor({r:254, g:254, b:254});
	}
	// Add to the RGBLed class
	async fade(color, duration) {
		return new Promise((resolve) => {
			const steps = 100;
			const interval = duration / steps;
			let step = 0;

			const timer = setInterval(() => {
				if (step >= steps) {
					clearInterval(timer);
					resolve();
					return;
				}

				const r = Math.floor((color.r * step) / steps);
				const g = Math.floor((color.g * step) / steps);
				const b = Math.floor((color.b * step) / steps);

				this.setColor({ r, g, b });
				step++;
			}, interval);
		});
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Cleanup method
	cleanup() {
		this.turnOff();
	}
}

// Main execution
async function main() {
	const rgbLed = new RGBLed();

	try {
		await rgbLed.showColors();
	} catch (error) {
		console.error('Error:', error);
	}

	// Handle cleanup on program exit
	process.on('SIGINT', () => {
		rgbLed.cleanup();
		process.exit();
	});
}

main();
