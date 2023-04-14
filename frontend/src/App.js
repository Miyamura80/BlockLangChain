import React, { useState, useRef, useEffect } from "react";
import "./styles/Chat.css";
// import ScrollToBottom from "react-scroll-to-bottom";
import { BsFillPersonFill } from "react-icons/bs";

const Hexagon = () => (
  <div className="hexagon">
    <div className="hexagon-before" />
    <div className="hexagon-after" />
  </div>
);

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { type: "other", text: "Hello! How can I help you?" },
    { type: "self", text: "I need help with my project." },
    { type: "other", text: "Sure! What do you need help with?" },
  ]);

  const messagesRef = useRef();

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setMessages([...messages, { type: "self", text: inputValue }]);
      setInputValue("");
      console.log(inputValue);
    }
  };

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div key={index} className={`message flex ${message.type === "self" ? "justify-end" : ""}`}>
        {message.type === "other" && <Hexagon />}
        <div
          className={`message-text ${
            message.type === "self" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
          } ml-2 py-2 px-4 rounded-md max-w-[70%]`}
        >
          {message.text}
        </div>
      </div>
    ));
  };

  return (
    <div className="chat-container h-screen flex flex-col justify-end">
      <div className="chat-messages flex-1 overflow-y-auto p-4" ref={messagesRef}>
        {renderMessages()}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full p-2 border-none"
        placeholder="Type your message..."
      />
    </div>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await axios.get('http://127.0.0.1:5000/api/data');
//       setMessage(result.data.message);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//       <h1>React and Flask App</h1>
//       <p>Message from the backend: {message}</p>
//     </div>
//   );
// }

// export default App;


