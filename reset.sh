git pull
sudo rm -rf node_modules
pnpm install
sudo cp -f services/main/csun_catalog_and_schedules.service /etc/systemd/system
sudo cp -f services/crawler/crawler.service /etc/systemd/system

sudo systemctl daemon-reload

sudo systemctl restart csun_catalog_and_schedules
sudo systemctl restart crawler

