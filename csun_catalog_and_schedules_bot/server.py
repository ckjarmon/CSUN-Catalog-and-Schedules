# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

"""
hostName = "localhost"
serverPort = 8080
class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/json")
        self.end_headers()
        self.wfile.write(bytes(open("storedschedules/" +  + "_schedule.json").read(), "utf-8"))
        #self.wfile.write(bytes("<p>This is an example web server.</p>", "utf-8"))
        
if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))
    
    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass
    
    
    webServer.server_close()
    print("Server stopped.")

"""

app = Flask(__name__)

@app.route('/<string:subject>')
def test(**kwargs):
    return json.load(open('./storedschedules/' + kwargs["subject"] + '_schedule.json'))
   

app.run()