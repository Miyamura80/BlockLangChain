from web3_config import w3
from langchain.agents import initialize_agent
from langchain.chat_models import ChatOpenAI
from tools import *
from langchain.agents import load_tools


if __name__ == '__main__':
    print(f"Connected to web3: {w3.is_connected()}")

    try:

        agent = initialize_agent(
            [
                UserInputTool(),
                ENSToOwnerAddressTool(),
                ERC20Tool(),
                EtherscanABIQuery(),
                ExecuteReadTool(),
                # AirstackAITool(), # Slow as it uses GPT4 for generation
                *load_tools(["serpapi"])
            ],
            ChatOpenAI(max_tokens=1000, model_name="gpt-3.5-turbo"),
            agent="zero-shot-react-description",
            verbose=True,
        )
        agent.run(
            "What is the MATIC/ETH uniswap price?"
        )
    except ValueError as e:
        print(e)