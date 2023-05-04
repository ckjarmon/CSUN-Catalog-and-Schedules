#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "while :; do tsc -p /home/kyeou/CSUN-Catalog-And-Schedules/ && node /home/kyeou/CSUN-Catalog-And-Schedules/run/bot.js --project_location /home/kyeou/CSUN-Catalog-And-Schedules/run/; done"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/bot.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/run/"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/server.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/run/"
    exit 0
fi


while :; do tsc -p /home/kyeou/CSUN-Catalog-And-Schedules/ && node /home/kyeou/CSUN-Catalog-And-Schedules/run/bot.js --project_location /home/kyeou/CSUN-Catalog-And-Schedules/run/; done &
python /home/kyeou/CSUN-Catalog-And-Schedules/run/bot.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/run/ &
python /home/kyeou/CSUN-Catalog-And-Schedules/run/server.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/run/ &


