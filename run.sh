#!/bin/bash

if [ "$1" == "stop" ]; then
    # stop background processes if stop command is passed
    echo "Stopping background processes"
    pkill -f "node /home/kyeou/CSUN-Catalog-And-Schedules/bot.js"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/bot.py"
    pkill -f "python /home/kyeou/CSUN-Catalog-And-Schedules/server.py"
    exit 0
fi

# start background processes and record their PIDs
while :; do node bot.js; done &
pid1=$!

python bot.py &
pid2=$!

python server.py &
pid3=$!

# set up trap to kill all background processes
trap 'kill $pid1 $pid2 $pid3' SIGTERM

echo "Background processes started with PIDs: $pid1 $pid2 $pid3"

# wait for kill switch to be triggered
while true; do
  sleep 1
done
