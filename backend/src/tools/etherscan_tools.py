import os
import requests
from tools.util_tools import SyncTool
from langchain.chat_models import ChatOpenAI


class EtherscanABIQuery(SyncTool):
    name = "etherscan_abi_query"
    description = (
        "This is a tool that queries etherscan to get the abi of a blockchain smart contract. "
        "This is used to simplify the interactions with the chain using natural language.\n"
        "The abi is used for directing the search space, not for finding addresses.\n"
        "Example #1: We have an ERC20 token address and a user wallet address. We then query etherscan to find the "
        "abi of ERC20 to deduce the needed function.\n"
        "Example #2: We now know that the address for the MATIC token is 0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0 and "
        "the address we are interested in is 0xcC227A599c10A39265Fda98beC977aee99adA5d1. We use this tool to find the "
        "abi of 0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0 in a natural language format.\n"
        "Example #3: We call this tool on a SINGLE contract address. Otherwise we fail."
    )

    def _run(self, query: str) -> str:
        try:
            chat = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
            clean_query = chat.call_as_llm(f"Extract only the contract address from {query}")
        except Exception as e:
            return f"Query failed with exception: {e}!"

        try:
            etherscan_key = os.environ["ETHERSCAN_API_KEY"]
            response = requests.get(
                f"https://api.etherscan.io/api?module=contract&action=getabi&address={clean_query}"
                f"&apikey={etherscan_key}"
            )

            abi = eval(response.text)['result']
        except Exception as e:
            return f"Query failed with exception: {e}!"

        if response.status_code == 200:
            try:
                nlp_abi = chat.call_as_llm(
                    f"Given the below abi, summarize the functions (with their arguments) of the contract.\n "
                    f"Also extract the relevant function signatures in a list.\n {abi}"
                )
            except Exception as e:
                return f"Query failed on LLM after getting abi with exception: {e}! The returned abi was {abi}..."

            return (
                f"We might want to call some of the functions of the contract?\n"
                f"Natural abi: {nlp_abi}\n"
            )
        else:
            return f"Etherscan query failed: {response.status_code}, {response.reason}"