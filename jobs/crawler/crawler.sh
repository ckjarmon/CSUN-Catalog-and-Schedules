#!/bin/bash

function start_crawler() {
  /usr/bin/python3 /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler/crawler.py --semester Fall --year 2023 --semester_key 2237
}

if [[ "$1" == "stop" ]]; then
  pkill -f "/usr/bin/python3 /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler/crawler.py --semester Fall --year 2023 --semester_key 2237"
  echo "Crawler stopped"
else
  start_crawler
fi
