# Smart Glasses Project

## Introduction

This project is a prototype of a smart glasses. The glasses will help blind people to navigate.

## Hardware

The hardware used for this project is the following:

- Raspberry Pi 3 Model B
- Raspberry Pi Camera Module V2
- Touch Sensor

## Pin Configuration

The pin configuration is the following:

1. Camera Module

   - Camera Module V2 Slot in Raspberry Pi 3 Model B

2. Touch Sensor
   - Pin 1(IO): GPIO 17
   - Pin 2(VCC): 3.3V
   - Pin 3(GND): GND
3. GPS Module
   - Pin 1(VCC): 5V
   - Pin 2(RX) : TXD
   - Pin 3(TX) : RXD
   - Pin 4(GND): GND
4. Temperature Sensor
   - Pin 1(VCC): 5V
   - Pin 2(DATA): GPIO 27
   - Pin 3(GND): GND

## Software

### Installation

1. Install Raspbian on Raspberry Pi 3 Model B
   1. Download Raspberry Pi Imager from [Raspbian](https://www.raspberrypi.org/downloads/raspbian/)
   2. Create a bootable SD card using Raspberry Pi Imager
2. Install Nodejs on Raspberry Pi 3 Model B
   ```bash
    sudo apt-get update
    curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
   ```
3. Install sox on Raspberry Pi 3 Model B
   ```bash
    sudo apt-get install sox libsox-fmt-all
   ```
4. Clone this repository on Raspberry Pi 3 Model B
   ```bash
    git clone https://github.com/vakhariaheet/Smart-Glasses
    cd Smart-Glasses
    npm install
   ```

### Usage

1. Run the following command to start the application

   ```bash
    npm start
   ```

2. Trigger the touch sensor to start the application

## References

- [Raspberry Pi](https://www.raspberrypi.org/)
- [Raspberry Pi Camera Module V2](https://www.raspberrypi.org/products/camera-module-v2/)
- [Raspberry Pi Imager](https://www.raspberrypi.org/downloads/raspbian/)
- [Nodejs](https://nodejs.org/en/)
- [Configuring Wifi and Bluetooth in Raspberry PI ](https://www.digikey.in/en/maker/tutorials/2016/raspberry-pi-wi-fi-bluetooth-setup-how-to-configure-your-pi-4-model-b-3-model-b)

### Errors

bcm2835_init: Unable to open /dev/gpiomem: Permission denied
This error occurs when the user does not have permission to access the GPIO pins. To resolve this error, run the following command:

```bash
sudo usermod -a -G gpio $USER
sudo chmod o+rw /dev/gpiomem
```
