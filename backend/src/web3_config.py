import os
import openai
from web3 import Web3, EthereumTesterProvider


def setup_web3(mode="infura"):
    if mode == "infura":
        infura_key = os.environ["INFURA_API_KEY"]
        w3 = Web3(Web3.HTTPProvider(f"https://mainnet.infura.io/v3/{infura_key}"))
    elif mode == "test":
        w3 = Web3(EthereumTesterProvider())
    elif mode == "quicknode":
        quicknode_key = os.environ["QUICKNODE_API_KEY"]
        w3 = Web3(Web3.HTTPProvider(f"https://proportionate-quick-leaf.discover.quiknode.pro/{quicknode_key}/"))
    else:
        raise ValueError(f"Invalid web3 setup mode '{mode}'.")

    assert w3.is_connected()
    return w3



os.environ["LANGCHAIN_HANDLER"] = "langchain"

openai.api_key = os.environ["OPENAI_API_KEY"]
w3 = setup_web3(mode="quicknode")