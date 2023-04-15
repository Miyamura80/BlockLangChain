from tools.util_tools import SyncTool
import requests


class AirstackAITool(SyncTool):
    name = "AIRSTACK_TOOL"
    description = (
        "The Airstack AI Assistant is powered by GPT4 and trained on the Airstack GraphQL. It is capable of turning "
        "natural language prompts into Airstack queries. This works well when you have CONCRETE information. This "
        "means that you should try to deduce the concrete information first, and then run a query.\n"
        "We first create the GraphQL query, and then execute it.\n"
        "Example GOOD input: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 MATIC balance\n"
        "Example BAD input: Fetch all the token holders of Moonbirds NFT Collection\n"
        "Example GOOD input: Get the sales history, royalties, and platform fees for the "
        "0x60e4d786628fea6478f785a6d7e704777c86a7c6 NFT collection on Ethereum\n"
        "Example BAD input: Get the token transfer history of the Mutant Apes NFT Collection on Ethereum\n"
    )

    def _run(self, query: str) -> str:
        try:
            response = requests.post("https://ai.airstack.xyz/api/web/generate-graphql",
                                 data={"question": query})
        except Exception as e:
            return f"Query failed with exception: {e}!"

        if response.status_code == 200:
            # We got a GraphQL example query
            try:
                print("query:", response.text)

                response_gql = requests.post(
                    "https://api.airstack.xyz/gql",
                    data={"query": response.text}
                )
            except Exception as e:
                return f"Query failed with exception: {e}!"

            if response_gql.status_code == 200:
                print(response_gql.content)
                return response_gql.text
            else:
                f"Query execution failed: {response_gql.status_code}, {response_gql.reason}"
        else:
            return f"Query graph GQL generation failed: {response.status_code}, {response.reason}"