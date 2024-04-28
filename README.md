# Andri's Home Assistant Addons

### Carlo Gavazzi Smart House buttons

A program that polls button registers via modbus, maps to addresses and sends trigger events to Home Assistant via MQTT.

#### Configuration

It automatically detects your MQTT settings, but requires you to set a host for the Smart-House controller in configuration.

#### Current Status

- [x] Prototype
- [x] Works in my house
- [x] Home Assistant addon
- [ ] Calculate how long the buttons are pressed
- [ ] Enable dimming functions somehow

## Installation

Go into "Settings" -> "Add-ons" -> "Add-on Store" -> "..." -> "Repositories" -> "Add" -> "https://github.com/andrioid/hassio-addons"

Then you should be able to see if in your "Add-on Store" called "Smart-House buttons".

## Disclaimer

Feel free to open issues, but my time is limited so I'm not providing free support of any kind.
