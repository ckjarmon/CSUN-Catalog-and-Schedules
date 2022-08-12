# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time

# hostName = "localhost"
# serverPort = 8080

# class MyServer(BaseHTTPRequestHandler):
#     def do_GET(self):
#         self.send_response(200)
#         self.send_header("Content-type", "text/json")
#         self.end_headers()
#         self.wfile.write(bytes(open("storedschedules/COMP_schedule.json").read(), "utf-8"))


# if __name__ == "__main__":        
#     webServer = HTTPServer((hostName, serverPort), MyServer)
#     print("Server started http://%s:%s" % (hostName, serverPort))

#     try:
#         webServer.serve_forever()
#     except KeyboardInterrupt:
#         pass

#     webServer.server_close()
#     print("Server stopped.")


from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        title = str(request.json["title"])
        body = str(request.json["body"])
        return jsonify("Sended")


CORS(app)

if __name__ == '__main__':
    app.run()