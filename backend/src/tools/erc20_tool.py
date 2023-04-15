import pickle
from tools.util_tools import SyncTool


class ERC20Tool(SyncTool):
    name = "erc20_data"
    description = (
        "A crypto token is a representation of an asset or interest that has been tokenized on an existing "
        "cryptocurrency's blockchain. Crypto tokens and cryptocurrencies share many similarities, but cryptocurrencies "
        "are intended to be used as a medium of exchange, a means of payment, and a measure and store of value.\n"
        "The tokens symbol is similar to the stock exchange symbols (usually 3-5 capital letters). Most of them are "
        "implemented as ERC20 contracts, and the purpose of this tool is to find the ERC20 contract details - address,"
        "full name, number of decimals, support & social details.\n"
        "NOTE: You use this tool ONLY on symbols.\n"
        "You call the tool with the symbol of the token, and it gives you a dictionary / JSON with information "
        "about the token. You can then parse this information and get some details you are interested in.\n"
        "Example #1: run(TUSD) = dict(symbol=TUSD, name=TrueUSD, type=ERC20, "
        "address=0x0000000000085d4780B73119b644AE5ecd22b376 ... )\n"
        "Explanation: TUSD is an ERC20 crypto token that is a stable coin and its address is "
        "0x0000000000085d4780B73119b644AE5ecd22b376. The result is a dictionary, that also contains additional "
        "details.\n"
        "Example #2: run(DAI) = dict(symbol=DAI, address=0x6B175474E89094C44Da98b954EedeAC495271d0F, "
        "decimals=18, name=Dai Stablecoin v2.0,ens_address=None, website=https://makerdao.com ... )\n"
        "Explanation: DAI is an ERC20 crypto token and its address is "
        "0x6B175474E89094C44Da98b954EedeAC495271d0F.\n"
        "Example #3: run(ETH) = Unknown token. Our database doesn't have details for the token that you specified.\n"
        "Explanation: ETH is the native Etherium blockchain token and not an ERC20 crypto token. "
        "Try calling the the get_eth tool.\n"
    )

    def _run(self, query: str) -> str:
        try:
            clean_query = query.replace("'", "")

            with open("src/data/token_data.pkl", "rb") as token_pkl:
                token_data = pickle.load(token_pkl)

            for token_dict in token_data:
                sym = token_dict.get("symbol")
                if sym == clean_query:
                    return f"The dictionary containing data about {clean_query} is {token_dict}."

            return (
                "Unknown token. "
                "Our database doesn't have details for the token that you specified. "
                "Try web searching."
            )
        except Exception as e:
            return f"Query failed with exception: {e}!"