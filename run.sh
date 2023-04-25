#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/bot.js --project_location /home/kyeou/CSUN-Catalog-And-Schedules/; done"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/bot.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/server.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/"
    exit 0
fi


while :; do node /home/kyeou/CSUN-Catalog-And-Schedules/bot.js --project_location /home/kyeou/CSUN-Catalog-And-Schedules/; done &
python /home/kyeou/CSUN-Catalog-And-Schedules/bot.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/ &
python /home/kyeou/CSUN-Catalog-And-Schedules/server.py --project_location /home/kyeou/CSUN-Catalog-And-Schedules/&


