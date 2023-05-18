#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "while :; do tsc -p /app/ && node /app/run/bot.js --project_location /app/run/; done"
    pkill -f "python /app/server.py --project_location /app/run/"
    exit 0
fi


while :; do tsc -p /app/ && node /app/run/bot.js --project_location /app/run/; done &
python /app/run/server.py --project_location /app/run/ &