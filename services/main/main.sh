#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "while :; do tsc -p /home/kyeou/CSUN-Catalog-And-Schedules/ && node /home/kyeou/CSUN-Catalog-And-Schedules/run/main/src/bot.js; done"
    pkill -f "tsc -p /home/kyeou/CSUN-Catalog-And-Schedules && node /home/kyeou/CSUN-Catalog-And-Schedules/run/main/src/server.js"
    exit 0
fi

cd /home/kyeou/CSUN-Catalog-And-Schedules/main
mkdir obj
pnpm install && tsc
while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/main/obj/src/bot.js --config /home/kyeou/CSUN-Catalog-And-Schedules/main/src/config.json; done &
node /home/kyeou/CSUN-Catalog-And-Schedules/run/main/src/server.js &


