#!/usr/bin/with-contenv bashio

bashio::log.info "Reverse tunnel initializing."

username=$(bashio::config 'username')
host=$(bashio::config 'server.host')

bashio::log.info "Reverse tunnel configured for $username@$host"

bashio::log.info "Setting ENV variables"

export MQTT_HOST=$(bashio::services mqtt "host")
export MQTT_USER=$(bashio::services mqtt "username")
export MQTT_PASSWORD=$(bashio::services mqtt "password")
export SH_HOST=$(bashio::config 'modbus_host')

bashio::log.info "Running app"

bun index.ts