from flask import Flask, request, jsonify, session
from web3 import Web3
from flask_cors import CORS
import os
from backend_server import get_agent
from datetime import datetime as dt
from web3_config import w3
import openai

INFURA_API_TOKEN = os.getenv("INFURA_API_TOKEN")
OPENAI_API_TOKEN = os.getenv("OPENAI_API_TOKEN")

openai.api_key = OPENAI_API_TOKEN

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("GARBAGE_POINTER") or os.urandom(24)

LANGUAGE = "ENGLISH"


def translate_to_japanese(ai_output):
    prompt = (
        f"Translate the following to ${LANGUAGE} \n {ai_output}"
        if LANGUAGE != "english"
        else f"{ai_output}"
    )
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


@app.route("/api/message", methods=["POST"])
def handle_chat():
    data = request.get_json()
    chatSession = data["chatSession"]
    full_chat_list = chatSession.split(",")
    if len(chatSession) > 0:
        print("calling openai API")
        text_output = (
            full_chat_list[0]
            if LANGUAGE == "english"
            else translate_to_japanese(full_chat_list[0])
        )
        return jsonify(text=text_output, session=chatSession)
    else:
        return jsonify(text="", session=chatSession)


class AddressRouter:
    def __init__(self) -> None:
        self.agent, self.memory = get_agent()

    def reinitialise(self):
        self.agent, self.memory = get_agent()

    def bot(self, prompt):
        res = self.agent(
            {
                "input": prompt,
                "current_time": dt.now().strftime("%Y-%m-%d %H:%M:%S"),
                "language": "English",
            }
        )

        if len(self.memory.buffer) > 2000:
            self.memory.chat_memory.messages.pop(0)
        return res["output"]

    def handle_bot_interaction(self):
        data = request.get_json()
        chatSession = data["chatSession"]
        full_chat_list = chatSession.split(",")
        if len(chatSession) > 0:
            query = full_chat_list[0]
        else:
            query = ""
        response = self.bot(query)
        return jsonify(text=response, session=chatSession)


personal_routers = {}


@app.route("/api/bot_interaction/<address>", methods=["POST"])
def handle_api_bot_interaction(address):
    if address not in personal_routers:
        personal_routers[address] = AddressRouter()
    return personal_routers[address].handle_bot_interaction()


@app.route("/api/reinitialise/<address>", methods=["POST"])
def handle_api_reinitialise(address):
    if address not in personal_routers:
        return jsonify(text="No such address")
    personal_routers[address].reinitialise()
    return jsonify(text="Reinitialised")


@app.route("/api/set_language/<lang>", methods=["POST"])
def set_language(lang):
    global LANGUAGE
    LANGUAGE = lang
    print("langaugusdauh", lang)
    return jsonify(text="reset")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
