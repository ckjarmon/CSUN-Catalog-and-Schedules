from flask import Flask
import json

app = Flask(__name__)

@app.route('/<string:subject>/<string:data>')
def test(**kwargs):
    return json.load(open('./json_' + kwargs["data"] +  's/' + kwargs["subject"].upper() + '_' + kwargs["data"]+ '.json'))

app.run()