# Smart Glasses Project 

## Introduction
This project is a prototype of a smart glasses. The glasses will help blind people to navigate in their environment.

## Hardware
The hardware used for this project is the following:

* Raspberry Pi 3 Model B
* Raspberry Pi Camera Module V2
* Touch Sensor 


## Pin Configuration
The pin configuration is the following:

1. Camera Module
   - Camera Module V2 Slot in Raspberry Pi 3 Model B

2. Touch Sensor
   - Pin 1(IO): GPIO 17
   - Pin 2(VCC): 3.3V
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
3. Install Piper TTS on Raspberry Pi 3 Model B
   ```bash
    cd ~
    wget https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_armv7.tar.gz
    tar -xzvf piper_armv7.tar.gz
    wget https://papeer.s3.ap-south-1.amazonaws.com/Audio.zip
    unzip -j Audio.zip
    
   ```
