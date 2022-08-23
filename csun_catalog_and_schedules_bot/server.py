from flask import Flask
import json

app = Flask(__name__)

@app.route('/<string:subject>')
def test(**args):
    return json.load(open('./storedschedules/' + args["subject"].upper() + '_schedule.json'))

app.run()