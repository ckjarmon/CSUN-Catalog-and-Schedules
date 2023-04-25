#!/bin/bash

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
