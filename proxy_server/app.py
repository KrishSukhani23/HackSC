from flask import Flask,request,redirect,Response
from flask_pymongo import PyMongo
import requests
app = Flask(__name__, static_folder=None)
SITE_NAME = "http://localhost:8000"

with open('../HackSC/volunteer/sitemap.txt') as f:
    lines = f.read().splitlines()

dict_val = {}
for i in range(len(lines)):
    dict_val[lines[i]] = i 

print(dict_val)



app.config["MONGO_URI"] = "mongodb://localhost:27017/message_db"
mongo = PyMongo(app)
db = mongo.db

@app.route("/add_one")
def add_one():
    db.messages.insert_one({'message_string': "testing"})
    return flask.jsonify(message="success")



@app.route('/', defaults={'path': ''}, methods=["GET","POST","DELETE"])
@app.route("/<string:path>",methods=["GET","POST","DELETE"]) 
@app.route("/<path:path>",methods=["GET","POST","DELETE"])
def proxy(path):
    print('path:', path)
    
    global SITE_NAME
    print(SITE_NAME+"/"+path, dict_val.get(SITE_NAME+"/"+path, None))

    if request.method=="GET":
        resp = requests.get(f"{SITE_NAME}/{path}")
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in  resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = Response(resp.content, resp.status_code, headers)
        return response
    elif request.method=="POST":
        resp = requests.post(f"{SITE_NAME}/{path}",json=request.get_json())
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = Response(resp.content, resp.status_code, headers)
        return response
    elif request.method=="DELETE":
        resp = requests.delete(f"{SITE_NAME}/{path}").content
        response = Response(resp.content, resp.status_code, headers)
        return response
if __name__ == "__main__":
    app.run(debug = False,port=80)


