#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/bot.js; done"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/bot.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/config.json"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/server.py"
    exit 0
fi


while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/bot.js; done &
python /home/kyeou/CSUN-Catalog-And-Schedules/bot.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/config.json &
python /home/kyeou/CSUN-Catalog-And-Schedules/server.py &


