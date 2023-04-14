from flask import Flask, request, jsonify, send_from_directory
from web3 import Web3
from flask_cors import CORS
from web3 import Web3, exceptions

app = Flask(__name__)
CORS(app)

# Connect to the Ethereum testnet (e.g., Rinkeby)
w3 = Web3(Web3.HTTPProvider('https://goerli.infura.io/v3/29ac942b8a18431c8c981c713a0a424a'))

# @app.route('/')
# def serve_index():
#     return send_from_directory('.', 'index.html')

@app.route('/')
def index():
    return "Hello, Flask!"

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from Flask!"})


@app.route('/api/get_nonce', methods=['POST'])
def get_nonce():
    data = request.get_json()
    address = data.get('address')
    if not address:
        return jsonify({"error": "Address not provided"}), 400
        print("error")
    print(f"address successfully received. {address}")
    address = Web3.toChecksumAddress(address)
    try:
        nonce = w3.eth.getTransactionCount(address)
        return jsonify({"nonce": nonce})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
