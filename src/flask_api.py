from flask import Flask
from flask_jsonpify import jsonify
from flask_cors import CORS
from simplerandom import random
from hashids import Hashids
from hashlib import md5
import base64
import uuid

hashids = Hashids(salt='test test',
                  alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
                  min_length=6)

def my_hash(s):
    # [:-2] removes the superfluous '==' at end
    return base64.urlsafe_b64encode(md5(s).digest())[:-2].decode('utf-8')


app = Flask(__name__)
CORS(app)

global messages
messages = ["BOT: This is test message number {}".format(i) for i in range(50)]

all_ids = []

@app.route('/new_session')
def new():
    while True:
        new_id = uuid.uuid4().hex.upper()[:5]
        if new_id not in all_ids:
            all_ids.append(new_id)
            break
    return jsonify({"session_id": new_id})

@app.route('/query/<query>')
def check(query):
    if len(query) < 10:
        return jsonify({"value": query})
    else:
        return jsonify({"value": query[:5]})

@app.route('/post/<sid>/<msg>')
def post(sid, msg):
    if sid in all_ids:
        messages.append("{}: {}".format(sid, msg))
        res = "True"
    else:
        res = "False"
    return jsonify({"success": res})


@app.route('/all_messages')
def all_messages():
    return jsonify(messages)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="8080", debug=True)
