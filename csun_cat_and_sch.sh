#!/bin/bash

case "$1" in
  start)
    echo "Starting csun_cat_and_sch"
    start-stop-daemon --start --background --name csun_cat_and_sch --exec  ~/CSUN-Catalog-and-Schedules/run.sh
    ;;
  stop)
    echo "Stopping csun_cat_and_sch"
    start-stop-daemon --stop --name csun_cat_and_sch
    ;;
  restart)
    echo "Restarting csun_cat_and_sch"
    start-stop-daemon --stop --name csun_cat_and_sch
    sleep 1
    start-stop-daemon --start --background --name csun_cat_and_sch --exec  ~/CSUN-Catalog-and-Schedules/run.sh
    ;;
  *)
    echo "Usage: /etc/init.d/csun_cat_and_sch {start|stop|restart}"
    exit 1
    ;;
esac

exit 0
