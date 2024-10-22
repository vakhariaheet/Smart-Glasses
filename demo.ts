import { Gpio } from 'pigpio';

// Define interface for RGB color
interface RGBColor {
    r: number;
    g: number;
    b: number;
}

class RGBLed {
    private redLED: Gpio;
    private greenLED: Gpio;
    private blueLED: Gpio;

    constructor() {
        // Initialize pins - define them as output
        this.redLED = new Gpio(16, { mode: Gpio.OUTPUT });
        this.greenLED = new Gpio(20, { mode: Gpio.OUTPUT });
        this.blueLED = new Gpio(21, { mode: Gpio.OUTPUT });
    }

    // Set color method (values from 0-255)
    public setColor(color: RGBColor): void {
        // Invert values for common anode
        this.redLED.pwmWrite(255 - color.r);
        this.greenLED.pwmWrite(255 - color.g);
        this.blueLED.pwmWrite(255 - color.b);
    }

    // Turn off all LEDs
    public turnOff(): void {
        this.setColor({ r: 0, g: 0, b: 0 });
    }

    // Example color sequence
    public async showColors(): Promise<void> {
        const colors: RGBColor[] = [
            { r: 255, g: 0, b: 0 },    // Red
            { r: 0, g: 255, b: 0 },    // Green
            { r: 0, g: 0, b: 255 },    // Blue
            { r: 255, g: 0, b: 255 },  // Purple
            { r: 0, g: 0, b: 0 }       // Off
        ];

        for (const color of colors) {
            this.setColor(color);
            await this.delay(1000);
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Cleanup method
    public cleanup(): void {
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