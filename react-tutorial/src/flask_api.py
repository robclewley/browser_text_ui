from flask import Flask
from flask_jsonpify import jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

global messages
messages = ["This is message number {}".format(i) for i in range(50)]

@app.route('/<query>')
def test(query):
    if len(query) < 5:
        return jsonify({"value": query})
    else:
        return jsonify({"value": query[:5]})

@app.route('/post/<msg>')
def post(msg):
    messages.append(msg)
    return jsonify({})


@app.route('/all_messages')
def all_messages():
    return jsonify(messages)
