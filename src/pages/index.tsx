import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ethers } from 'ethers';
import { IDKitWidget } from '@worldcoin/idkit'
import type { ISuccessResult } from "@worldcoin/idkit";
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] })

type MessageType = {
  sender: 'self' | 'other';
  text: string;
};

type ChatSession = string[]

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>('');
  const [metamaskAddr, setMetamaskAddr] = useState<string>('Not connected to wallet');
  const [chatSession, setChatSession] = useState<ChatSession>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const resetMemory = async () => {
    // Make API call to Flask backend
    const response = await fetch('https://backend-python-production.up.railway.app/api/reinitialise/69420', {  // Update the URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: "",
    });

    if (response.ok) {
      setChatSession([]);
    } else {
      console.error('Error while sending message to the backend');
    }
    setInput('');
  }

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
        setMetamaskAddr(`Connected to: ${accounts[0]}`);
      } catch (error:any) {
        // Handle errors that occurred during the connection process
        console.error('Error connecting MetaMask wallet:', error.message);
      }
    } else {
      console.error('MetaMask not detected in the browser');
    }
  };

  
  const USE_AI = false;

  const sendChatSession = async (chatSessionString: string, recentString: string) => {
    if (recentString.toLowerCase() === 'reset') {
      console.log("Reset");
      resetMemory();
      return;
    }


    const api_sign = !USE_AI ? 'https://backend-python-production.up.railway.app/api/message': 'https://backend-python-production.up.railway.app/api/bot_interaction/69420';
    // Make API call to Flask backend
    const response = await fetch(api_sign, {  // Update the URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatSession: chatSessionString}),
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
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      // Add your own message to the chat
      setMessages([...messages, { sender: 'self', text: input.trim() }]);
      setChatSession([input.trim(), ...chatSession]);  
    }
  };
  
  // Triggers after handleKeyDown() updates chatSessionString
  useEffect(() => {
    const chatSessionString: string = chatSession.join(', ');
    // Call the API with the chatSessionString
    if(chatSessionString.length > 0){
      sendChatSession(chatSessionString, chatSession[0]);
    }
  }, [chatSession]);

  const IDKitWidget = dynamic(() => import('@worldcoin/idkit').then(mod => mod.IDKitWidget), { ssr: false })

  const handleProof = useCallback((result: ISuccessResult) => {
		return new Promise<void>((resolve) => {
			setTimeout(() => resolve(), 3000);
			// NOTE: Example of how to decline the verification request and show an error message to the user
		});
	}, []);

	const onSuccess = (result: ISuccessResult) => {
		console.log(result);
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

            {/* MetaMask Address */}
            <div className="border-t border-gray-300 pt-4 text-black"> 
                  {metamaskAddr}
            </div>
            <IDKitWidget
              action="test-action-eito"
              onSuccess={onSuccess}
              handleVerify={handleProof}
              app_id="app_staging_7dceb87587ebc8f52332d91f9a6e5280"
              // walletConnectProjectId="get_this_from_walletconnect_portal"
            >
              {({ open }) => 
                <button onClick={open} 
                        type="button" 
                        className="rounded-lg border border-gray-700 bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-gray-900 hover:bg-gray-900 focus:ring focus:ring-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300">Verify Humanity</button>

              }
            </IDKitWidget>
            
          </div>
          <div className="mt-8 text-center">
          </div>
        </div>
      </div>
    </>
  );
  
}
