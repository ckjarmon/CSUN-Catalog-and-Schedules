#!/bin/bash

function start_crawler() {
  node /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler/obj/src/run.js -k 2237 &
  node /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler/obj/src/run.js -k 2235 &
}

tsc -p /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler
start_crawler &