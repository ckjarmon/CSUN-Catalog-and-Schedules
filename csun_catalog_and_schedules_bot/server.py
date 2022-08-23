from flask import Flask
import json

app = Flask(__name__)

@app.route('/<string:subject>')
def test(**kwargs):
    if kwargs["subject"].__contains__("1"):
        return json.load(open('./json_catalogs/' + kwargs["subject"].upper()[0:len(kwargs["subject"])-1] + '_catalog.json'))
    else:
        return json.load(open('./storedschedules/' + kwargs["subject"].upper() + '_schedule.json'))

app.run()