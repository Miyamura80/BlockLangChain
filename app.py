from flask import Flask, request, jsonify, session
from web3 import Web3
from flask_cors import CORS
from web3 import Web3
import os
import configparser
from datetime import datetime as dt
import openai


# Secrets
INFURA_API_TOKEN = ""
OPENAI_API_TOKEN = ""
env_config = configparser.ConfigParser()
env_config.read("config.ini")
if env_config["DEFAULT"]["INFURA_API_TOKEN"]:
    INFURA_API_TOKEN = env_config["DEFAULT"]["INFURA_API_TOKEN"]

if env_config["DEFAULT"]["OPENAI_API_TOKEN"]:
    OPENAI_API_TOKEN = env_config["DEFAULT"]["OPENAI_API_TOKEN"]

openai.api_key = OPENAI_API_TOKEN

app = Flask(__name__)
CORS(app)

LANGUAGE = 'ENGLISH'
def translate_to_japanese(ai_output):
    prompt = f"Translate the following to ${LANGUAGE} \n {ai_output}" if LANGUAGE != 'english' else f"{ai_output}"
    response = openai.Completion.create(
        engine="text-davinci-003",  # Replace this with the appropriate engine name for ChatGPT
        prompt=prompt,
        max_tokens=100,  # Adjust the number of tokens based on the desired length of the response
        n=1,  # Number of responses you want to generate
        stop=None,  # List of stop sequences, or None if you want the model to decide
        temperature=0.8,  # Higher values (e.g., 1) make the output more random, lower values (e.g., 0) make it more focused
    )

    return response.choices[0].text.strip()

# Connect to the Ethereum testnet (e.g., Rinkeby)
w3 = Web3(Web3.HTTPProvider(f"https://goerli.infura.io/v3/{INFURA_API_TOKEN}"))


@app.route('/api/message', methods=['POST'])
def handle_chat():
    data = request.get_json()
    chatSession = data['chatSession']
    full_chat_list = chatSession.split(',')
    if len(chatSession) > 0:
        print("calling openai API")
        text_output = full_chat_list[0] if LANGUAGE == "english" else translate_to_japanese(full_chat_list[0])
        return jsonify(text=text_output, session=chatSession)
    else:
        return jsonify(text="", session=chatSession)

# This API is used when you sent a message when const USE_AI = true; in `index.tsx`
@app.route("/api/bot_interaction/<address>", methods=["POST"])
def handle_api_bot_interaction(address):
    return jsonify(text="Constant AI")


@app.route("/api/reinitialise/<address>", methods=["POST"])
def handle_api_reinitialise(address):
    return jsonify(text="reset")


@app.route("/api/set_language/<lang>", methods=["POST"])
def set_language(lang):
    global LANGUAGE
    LANGUAGE = lang
    print("langaugusdauh",lang)
    return jsonify(text="reset")

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

if __name__ == '__main__':
    app.run(debug=True)