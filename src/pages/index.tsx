import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ethers } from 'ethers';

const inter = Inter({ subsets: ['latin'] })

type MessageType = {
  sender: 'self' | 'other';
  text: string;
};


export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request user to connect MetaMask wallet
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
        // You can now use the connected account for further actions, e.g., getting the account balance
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const balance = await provider.getBalance(accounts[0]);
        // console.log("Account balance:", ethers.utils.formatEther(balance));
        
        // Display connected account address in the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'other', text: `Connected to ${accounts[0]}` },
        ]);
      } catch (error) {
        // Handle errors that occurred during the connection process
        console.error('Error connecting MetaMask wallet:', error.message);
      }
    } else {
      console.error('MetaMask not detected in the browser');
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      // Add your own message to the chat
      setMessages([...messages, { sender: 'self', text: input.trim() }]);
  
      // Make API call to Flask backend
      const response = await fetch('http://localhost:5000/api/message', {  // Update the URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input.trim() }),
      });
  
      if (response.ok) {
        const data = await response.json();

        // Connect to MetaMask Wallet
        if(data.text.toLowerCase() === 'connect'){
          connectMetaMask();
        }        

        // Add Flask backend response to the chat as 'other'
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'other', text: data.text },
        ]);
      } else {
        console.error('Error while sending message to the backend');
      }
  
      setInput('');
    }
  };


  
  return (
    <>
      <Head>
        <title>BlockLangChain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h1 className="text-4xl font-bold text-center mb-4">
              Chat Interface
            </h1>

            {/* Messages */}
            <div className="overflow-y-auto h-72 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    message.sender === 'self'
                      ? 'justify-end items-end'
                      : 'justify-start items-start'
                  }`}
                >


                  <div
                    className={`rounded-lg px-4 py-2 mx-2 ${
                      message.sender === 'self'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-300 text-black'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Chat area */}
            <div className="border-t border-gray-300 pt-4">
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-gray-500"
                placeholder="Type your message here"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="mt-8 text-center">
          </div>
        </div>
      </div>
    </>
  );
  
}
