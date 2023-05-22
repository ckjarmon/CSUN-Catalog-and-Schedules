git pull
sudo cp -f csun_cat_and_sch.service /etc/systemd/system
sudo cp -f jobs/crawler/crawler.service /etc/systemd/system

sudo systemctl daemon-reload

sudo systemctl restart csun_cat_and_sch
sudo systemctl restart crawler

