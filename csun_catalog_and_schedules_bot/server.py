# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
from flask import Flask
import json

app = Flask(__name__)

@app.route('/<string:subject>')
def test(**kwargs):
    return json.load(open('./storedschedules/' + kwargs["subject"] + '_schedule.json'))

app.run()