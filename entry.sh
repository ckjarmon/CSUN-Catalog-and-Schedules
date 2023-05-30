#!/bin/bash


while :; do node /app/bot/obj/src/bot.js --config /app/bot/config.json; done &
node /app/bot/obj/src/server.js 
