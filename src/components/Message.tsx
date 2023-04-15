import clsx from "clsx";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import { erc20ABI, useSigner } from "wagmi";

const AddressMessage = ({ address }: { address: string }) => {
  const { data: signer } = useSigner();
  const [isErc20, setIsErc20] = useState(false);

  const checkIsErc20 = async () => {
    if (!signer) return;
    const contract = new Contract(address, erc20ABI, signer);

    try {
      console.log("fetching");
      await contract.symbol();
      await contract.decimals();

      console.log("RESULT");

      setIsErc20(true);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    checkIsErc20();
  }, []);

  return <div className={clsx("mr-2", isErc20 && "text-blue")}>{address}</div>;
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
      {text.map(({ isAddress, text }) =>
        isAddress ? (
          <AddressMessage address={text} />
        ) : (
          <div className={"mr-2"}>{text}</div>
        )
      )}
    </div>
  );
};
