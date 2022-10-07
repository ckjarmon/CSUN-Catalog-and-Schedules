from flask import Flask
import json
import time

app = Flask(__name__)

@app.route('/<string:subject>/<string:data>')
def get(**kwargs):
    return json.load(open(f'./json_{kwargs["data"]}/{kwargs["subject"].upper()}_{kwargs["data"]}.json'))

@app.route('/time')
def stime():
    curr_time = time.asctime(time.localtime(time.time())).split()
    return (f" - As of {curr_time[0]} {curr_time[2]} {curr_time[1]} {curr_time[4]} {curr_time[3]}")
   

app.run(port=2222)