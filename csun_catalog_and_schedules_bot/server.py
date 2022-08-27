from flask import Flask
import json

app = Flask(__name__)

@app.route('/<string:subject>/<string:data>')
def get(**kwargs):
    return json.load(open('./json_' + kwargs["data"] +  '/' + kwargs["subject"].upper() + '_' + kwargs["data"] + '.json'))

app.run()