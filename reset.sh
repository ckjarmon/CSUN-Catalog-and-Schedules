git pull

tsc -p bot &
tsc -p jobs/crawler &

sudo cp -f services/bot/csun_catalog_and_schedules.service /etc/systemd/system &
sudo cp -f services/crawler/crawler.service /etc/systemd/system &
wait

sudo systemctl daemon-reload

sudo systemctl restart csun_catalog_and_schedules &
sudo systemctl restart crawler &

