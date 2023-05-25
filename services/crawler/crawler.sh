#!/bin/bash

function start_crawler() {
  cd /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler
  mkdir obj
  pnpm install && tsc 
  node /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler/obj/src/run.js --semester_key 2237
}

start_crawler &