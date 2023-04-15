from tools.util_tools import SyncTool
from web3_config import w3


class ENSToOwnerAddressTool(SyncTool):
    name = "ENS_OWNER"
    description = (
        "The Ethereum Name Service (ENS) is analogous to the Domain Name Service. It enables users and developers to "
        "use human-friendly names in place of error-prone hexadecimal addresses, content hashes, and more.\n"
        "This tool is given an ENS, and then queries the blockchain to get the address of the owner.\n"
        "Example #1: run(vitalik.eth) = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'\n"
        "Explanation: Vitalik Buterin's ENS is vitalik.eth, and the contract address is "
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045.\n"
        "Example #2: run(eitomiyamura.eth) = '0xB4A65eb99011C749cac3368E4bC8896d4178274c'\n"
        "Explanation: Eito's ENS is eitomiyamura.eth, and the contract address is "
        "0xB4A65eb99011C749cac3368E4bC8896d4178274c.\n"
    )

    def _run(self, query: str) -> str:
        try:
            clean_query = query.replace("'", "")
            address = w3.ens.address(clean_query)
            return address
        except Exception as e:
            return f"Query failed with exception: {e}!"