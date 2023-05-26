#!/bin/bash

function start_crawler() {
  
  node /home/kyeou/CSUN-Catalog-And-Schedules/jobs/crawler/obj/src/run.js --semester_key 2237
}

start_crawler &