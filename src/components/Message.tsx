import {
  FusionSDK,
  PrivateKeyProviderConnector,
  Web3ProviderConnector,
} from "@1inch/fusion-sdk";
import clsx from "clsx";
import { Contract, utils } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { erc20ABI, useAccount, useSigner } from "wagmi";

const TOKENS = [
  { label: "DAI", value: "0x6b175474e89094c44da98b954eedeac495271d0f" },
  { label: "WETH", value: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" },
];

const AddressMessage = ({ address }: { address: string }) => {
  const { data: signer } = useSigner();
  const { address: acctAddress } = useAccount();
  const [isErc20, setIsErc20] = useState(false);
  const [show, setShow] = useState(false);
  const [erc20Name, setErc20Name] = useState("");
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(TOKENS[0].value);

  const checkIsErc20 = async () => {
    if (!signer) return;
    const contract = new Contract(address, erc20ABI, signer);

    try {
      console.log("fetching");
      await contract.symbol();
      const decimals = await contract.decimals();

      console.log("decimals,", decimals);

      setErc20Name(await contract.name());
      setBalance(formatUnits(await contract.balanceOf(acctAddress), decimals));

      setIsErc20(true);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  useEffect(() => {
    checkIsErc20();
  }, []);

  const swap = async () => {
    console.log("SWAPPING", amount, token);
    if (!signer) return;

    const sdk = new FusionSDK({
      url: "https://fusion.1inch.io",
      network: 1,
      blockchainProvider: new Web3ProviderConnector(signer),
    });

    sdk
      .placeOrder({
        fromTokenAddress: address,
        toTokenAddress: token,
        amount: amount,
        walletAddress: acctAddress as any,
      })
      .then(console.log);
  };

  return (
    <>
      <div
        className={clsx(
          "mr-2",
          isErc20 && "bg-gray-200 rounded-lg px-1 text-black cursor-pointer"
        )}
        onClick={() => isErc20 && setShow(true)}
      >
        {address} {isErc20 ? "(token)" : ""}
      </div>

      {show && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-white">
          <div className="bg-blue-500 p-12 rounded-lg grid height-fit-content gap-2">
            <div className="cursor-pointer" onClick={() => setShow(false)}>
              close
            </div>

            <div className="grid gap-2">
              <div className="text-2xl">Token Info</div>
              <div>Name: {erc20Name}</div>
              <div>Your balance: {balance}</div>

              <div>Input amount of {erc20Name}</div>
              <input
                className="text-black"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />

              <div>Output token</div>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="text-black"
              >
                {TOKENS.map(({ label, value }) => (
                  <option value={value}>{label}</option>
                ))}
              </select>

              <div
                className="bg-red-600 p-2 rounded-lg cursor-pointer"
                onClick={() => swap()}
              >
                Swap using 1Inch Fusion
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const Message = ({
  message,
}: {
  message: { text: string; sender: string };
}) => {
  // split text by addresses
  const splitText = () => {
    const text = message.text.split(/(0x[a-fA-F0-9]{40})/g);

    return text.map((section) => {
      return { isAddress: utils.isAddress(section), text: section };
    });
  };

  const text = splitText();

  return (
    <div
      className={`rounded-lg px-4 py-2 mx-2 flex flex-wrap mt-2 ${
        message.sender === "self"
          ? "bg-blue-500 text-white"
          : "bg-slate-300 text-black"
      }`}
    >
      {text.map(({ isAddress, text }, index) =>
        isAddress ? (
          <AddressMessage address={text} key={index} />
        ) : (
          <div className={"mr-2"} key={index}>
            {text}
          </div>
        )
      )}
    </div>
  );
};
