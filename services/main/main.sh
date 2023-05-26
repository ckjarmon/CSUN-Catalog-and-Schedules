#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/main/obj/src/bot.js --config /home/kyeou/CSUN-Catalog-And-Schedules/main/src/config.json; done"
    pkill -f "node /home/kyeou/CSUN-Catalog-And-Schedules/main/obj/src/server.js &"
    exit 0
fi

cd /home/kyeou/CSUN-Catalog-And-Schedules/main/ && pnpm install
while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/main/obj/src/bot.js --config /home/kyeou/CSUN-Catalog-And-Schedules/main/src/config.json; done &
node /home/kyeou/CSUN-Catalog-And-Schedules/main/obj/src/server.js &


