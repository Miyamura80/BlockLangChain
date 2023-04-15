export const Message = ({
  message,
}: {
  message: { text: string; sender: string };
}) => {
  return (
    <div
      className={`flex mb-4 ${
        message.sender === "self"
          ? "justify-end items-end"
          : "justify-start items-start"
      }`}
    >
      <div
        className={`rounded-lg px-4 py-2 mx-2 ${
          message.sender === "self"
            ? "bg-blue-500 text-white"
            : "bg-slate-300 text-black"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};
