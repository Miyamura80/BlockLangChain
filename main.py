from flask import Flask, request, jsonify, session
from web3 import Web3
from flask_cors import CORS
from web3 import Web3
import os

INFURA_API_TOKEN = os.getenv("INFURA_API_TOKEN")

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("GARBAGE_POINTER") or os.urandom(24)
w3 = Web3(Web3.HTTPProvider(f"https://goerli.infura.io/v3/{INFURA_API_TOKEN}"))
session["conversation"] = []

# @app.before_first_request
# def create_session():
#     if "conversation" not in session:
#         session["conversation"] = []


@app.route("/api/message", methods=["POST"])
def handle_chat():
    data = request.get_json()
    print(data)
    text = data["text"]
    session["conversation"].append(text)
    print(session["conversation"])
    return jsonify(text=" ".join(session["conversation"]))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
