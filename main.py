from flask import Flask, request, jsonify, session
from web3 import Web3
from flask_cors import CORS
from web3 import Web3
import os
from backend.src.backend_server import get_agent
from datetime import datetime as dt

INFURA_API_TOKEN = os.getenv("INFURA_API_TOKEN")

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("GARBAGE_POINTER") or os.urandom(24)
w3 = Web3(Web3.HTTPProvider(f"https://goerli.infura.io/v3/{INFURA_API_TOKEN}"))


@app.route("/api/message", methods=["POST"])
def handle_chat():
    data = request.get_json()
    text = data["text"]
    return jsonify(text=text)


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
        query = data["text"]
        response = self.bot(query)
        return jsonify(text=response)


personal_routers = {}


@app.route("/api/bot_interaction/<address>", methods=["POST"])
def handle_api_bot_interaction(address):
    if address not in personal_routers:
        personal_routers[address] = AddressRouter(address)
    return personal_routers[address].handle_bot_interaction()


@app.route("/api/reinitialise/<address>", methods=["POST"])
def handle_api_reinitialise(address):
    if address not in personal_routers:
        return jsonify(text="No such address")
    personal_routers[address].reinitialise()
    return jsonify(text="Reinitialised")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
