import os
from web3 import Web3, EthereumTesterProvider
import configparser

# Secrets
INFURA_API_TOKEN = ""
env_config = configparser.ConfigParser()
env_config.read("config.ini")
if env_config["DEFAULT"]["INFURA_API_TOKEN"]:
    INFURA_API_TOKEN = env_config["DEFAULT"]["INFURA_API_TOKEN"]

def setup_web3(mode="infura"):
    if mode == "infura":
        infura_key = os.environ["INFURA_API_KEY"]
        w3 = Web3(Web3.HTTPProvider(f"https://mainnet.infura.io/v3/{INFURA_API_TOKEN}"))
    elif mode == "test":
        w3 = Web3(EthereumTesterProvider())
    else:
        raise ValueError(f"Invalid web3 setup mode '{mode}'.")

    assert w3.isConnected()
    return w3


w3 = setup_web3(mode="infura")
