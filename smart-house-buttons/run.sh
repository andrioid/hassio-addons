#!/usr/bin/with-contenv bashio

bashio::log.info "Reverse tunnel initializing."

username=$(bashio::config 'username')
host=$(bashio::config 'server.host')

bashio::log.info "Reverse tunnel configured for $username@$host"

bashio::log.info "Setting ENV variables"

MQTT_HOST=$(bashio::services mqtt "host")
MQTT_USER=$(bashio::services mqtt "username")
MQTT_PASSWORD=$(bashio::services mqtt "password")
SH_HOST=$(bashio::config 'modbus_host')

bashio::log.info "Running app"

bun index.ts