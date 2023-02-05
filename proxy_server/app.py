from flask import Flask,request,redirect,Response
from flask_pymongo import PyMongo
import requests
import datetime

app = Flask(__name__, static_folder=None)
SITE_NAME = "http://localhost:8000"

with open('../volunteer/templates/sitemap.txt') as f:
    lines = f.read().splitlines()

dict_val = {}
for i in range(len(lines)):
    dict_val[lines[i]] = i

print(dict_val)



app.config["MONGO_URI"] = "mongodb://localhost:27017/message_db"
mongo = PyMongo(app)
db = mongo.db


msg_ip = {}

@app.route('/sitemap.txt')
def sitemap():
    return '\n'.join([line.replace(':8000', ':80') for line in lines])

@app.route('/', defaults={'path': ''}, methods=["GET","POST","DELETE"])
@app.route("/<string:path>",methods=["GET","POST","DELETE"]) 
@app.route("/<path:path>",methods=["GET","POST","DELETE"])
def proxy(path):
    print('path:', path)
    
    global SITE_NAME
    val = dict_val.get(SITE_NAME+"/"+path, None)
    print(SITE_NAME+"/"+path, val)
    print(val)

    if val != None:
        
        print(msg_ip)
        ip_add = request.remote_addr
        print(ip_add)
        if ip_add in msg_ip and val<=15:
            print(msg_ip)
            msg_ip[ip_add] += hex(val)[2:]
        elif ip_add in msg_ip and val>15:
            print(msg_ip)
            db.messages.insert_one({'message_string': msg_ip[ip_add], "ip-add": ip_add, "updated_at":datetime.datetime.now()})
            del msg_ip[ip_add]
        elif ip_add not in msg_ip and val<=15:
            msg_ip[ip_add] = hex(val)[2:]
            print(msg_ip)
        elif ip_add not in msg_ip and val>15:
            msg_ip[ip_add] = ""
            print(msg_ip)

    replaced_image = None
    if path[-4:] == '.png':
        imagename = path.split('/')[-1]
        with open('encoded/'+imagename,  'rb') as f:
            replaced_image = f.read()
            print('REPLACED!')

    
    # db.messages.insert_one({'message_string': val, "ip-add": "127.0.0.0", "updated_at":"date"})

    if request.method=="GET":
        resp = requests.get(f"{SITE_NAME}/{path}")
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in  resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = Response(replaced_image if replaced_image else resp.content, resp.status_code, headers)
        return response
    elif request.method=="POST":
        resp = requests.post(f"{SITE_NAME}/{path}",json=request.get_json())
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
        response = Response(replaced_image if replaced_image else resp.content, resp.status_code, headers)
        return response
    elif request.method=="DELETE":
        resp = requests.delete(f"{SITE_NAME}/{path}").content
        response = Response(replaced_image if replaced_image else resp.content, resp.status_code, headers)
        return response
if __name__ == "__main__":
    app.run(debug = False,port=80)


