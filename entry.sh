#!/bin/bash

tsc -p /app/main/
while :; do node /app/main/obj/src/bot.js --config /app/main/config.json; done &
node /app/main/obj/src/server.js 
