Table of Contents

- [Team](#team)
- [Introduction](#introduction)
- [Features](#features)
- [Hardware](#hardware)
- [Pin Configuration](#pin-configuration)
- [Software](#software)
  - [Installation](#installation)
  - [Usage](#usage)
- [References](#references)

## Team

| Name           | Enrollment Number | Roll No. | Sem |
| -------------- | ----------------- | -------- | --- |
| Lisha Modhiya  | 202201619010156   | B42      | 4   |
| Honey Patel    | 202201619010292   | C62      | 4   |
| Heet Vakharia  | 202201619010226   | B114     | 4   |
| Pooja Mistry   | 202201619010154   | B40      | 4   |
| Krish Thakkar  | 202201619010218   | B106     | 4   |
| Dhruvi Sindhav | 202201619010211   | B99      | 4   |
| Aesha Koshti   | 202201619010147   | B33      | 4   |
| Liza Shaikh    | 202201619010204   | B92      | 4   |
| Bhumika Chawla | 202201619010125   | B10      | 4   |
| Twisha Shah    | 202201619010202   | B90      | 4   |

## Introduction

This project is a prototype of a smart glasses. The glasses will help blind people to navigate.

## Features

1. Describe Environment
   - The application will describe the environment to the user by capturing the image and processing it using the Google's Gemini Vision Pro API.
2. Read Text
   - The application will read the text from the image using Tesseract OCR.
3. Detect Currency
   - The application will detect the currency from the image using the Google's Gemini Vision Pro API.
4. Hey Visio
   - The user can ask anything directly to google's gemini.
   - Basically, send prompts to the google's gemini using the voice.
5. Navigation
   - The application will provide navigation to the user using the GPS module.
6. Temperature
   - The application will provide the temperature to the user using the temperature sensor.
7. Change Volume Controls
   - The user can change the volume of the application using voice commands.
8. Visio Pair
   - A mobile application to pair with the smart glasses to provide additional features.
   - The mobile uses BLE to connect with the smart glasses and send wifi credentials to the smart glasses. and update setting of the smart glasses.
9. Visio Alley
   - A mobile application for user's family to track the user's location and provide additional features.

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

2. Trigger the touch sensor to test the application

## References

- [Raspberry Pi](https://www.raspberrypi.org/)
- [Raspberry Pi Camera Module V2](https://www.raspberrypi.org/products/camera-module-v2/)
- [Raspberry Pi Imager](https://www.raspberrypi.org/downloads/raspbian/)
- [Nodejs](https://nodejs.org/en/)
- [Configuring Wifi and Bluetooth in Raspberry PI ](https://www.digikey.in/en/maker/tutorials/2016/raspberry-pi-wi-fi-bluetooth-setup-how-to-configure-your-pi-4-model-b-3-model-b)
