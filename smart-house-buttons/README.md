# Smarthouse-Buttons

## Background

We bought this house and the previous owner told me it was a smart-house and I was like: "Great!". But, it's ancient, runs Windows CE and the relays are starting to break down.

So, I wanted to migrate to Zigbee and got a quote on replacing all my wall switches and only the wall switches took me over budget.

## Research

With a little creative geekyness I managed to grab the switch status from the old controller with modbus so I could tell what buttons were currently being pressed.

## Solution

Well, a "solution" is stretching it. It's a semi-permenent workaround that does the following.

1. Listens for button/switch presses by polling the Carlo Gavazzi controller through modbus
2. If a button press is detected, it sends an MQTT even to Home Assistant
3. With an automation you can then hook smart-house button presses to Zigbee/Wifi/Bluetooth devices.
