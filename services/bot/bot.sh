#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/bot/obj/src/bot.js --config /home/kyeou/CSUN-Catalog-And-Schedules/bot/config.json; done"
    pkill -f "node /home/kyeou/CSUN-Catalog-And-Schedules/bot/obj/src/server.js"
    exit 0
fi

cd /home/kyeou/CSUN-Catalog-And-Schedules/bot/ && pnpm install
tsc -p /home/kyeou/CSUN-Catalog-And-Schedules/bot/
while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/bot/obj/src/bot.js --config /home/kyeou/CSUN-Catalog-And-Schedules/bot/config.json; done &
node /home/kyeou/CSUN-Catalog-And-Schedules/bot/obj/src/server.js &


