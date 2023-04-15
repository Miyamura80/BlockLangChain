from flask import Flask, request, jsonify, send_from_directory, session
from web3 import Web3
from flask_cors import CORS
from web3 import Web3, exceptions
import configparser
import os

# Secrets
# INFURA_API_TOKEN = ""
# env_config = configparser.ConfigParser()
# env_config.read("config.ini")
# if env_config["DEFAULT"]["INFURA_API_TOKEN"]:
#     INFURA_API_TOKEN = env_config["DEFAULT"]["INFURA_API_TOKEN"]

INFURA_API_TOKEN = os.getenv("INFURA_API_TOKEN")

app = Flask(__name__)
CORS(app)

# Connect to the Ethereum testnet (e.g., Rinkeby)
w3 = Web3(Web3.HTTPProvider(f"https://goerli.infura.io/v3/{INFURA_API_TOKEN}"))


# create session on startup
@app.before_first_request
def create_session():
    session["conversation"] = []


@app.route("/api/message", methods=["POST"])
def handle_chat():
    data = request.get_json()
    print(data)
    text = data["text"]
    session["conversation"] += [text]

    # console log the session
    print(session["conversation"])

    # return jsonify(text=text)
    return jsonify(text=" ".join(session["conversation"]))


# @app.route('/api/get_nonce', methods=['POST'])
# def get_nonce():
#     data = request.get_json()
#     address = data.get('address')
#     if not address:
#         return jsonify({"error": "Address not provided"}), 400
#         print("error")
#     print(f"address successfully received. {address}")
#     address = Web3.toChecksumAddress(address)
#     try:
#         nonce = w3.eth.getTransactionCount(address)
#         return jsonify({"nonce": nonce})
#     except Exception as e:
#         print(e)
#         return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
