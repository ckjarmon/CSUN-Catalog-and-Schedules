#!/bin/bash

function start_crawler() {
  tsc -p ~/CSUN-Catalog-And-Schedules && node ~/CSUN-Catalog-And-Schedules/run/jobs/crawler/src/run.js --semester_key 2237
}

# if [[ "$1" == "stop" ]]; then
#   pkill -f "/usr/bin/python3 ~/CSUN-Catalog-And-Schedules/jobs/crawler/crawler.py --semester Fall --year 2023 --semester_key 2237"
#   echo "Crawler stopped"
# else
# fi

start_crawler &