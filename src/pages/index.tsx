import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ethers } from 'ethers';
import { IDKitWidget } from '@worldcoin/idkit'
import type { ISuccessResult } from "@worldcoin/idkit";
import dynamic from 'next/dynamic';
import { Message } from '@/components/Message';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected'

const inter = Inter({ subsets: ['latin'] })

type MessageType = {
  sender: 'self' | 'other';
  text: string;
};

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>('');
  const { address, isConnected } = useAccount()
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log("ADDRESS", address)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const connectMetaMask = async () => {
    console.log("connect")
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request user to connect MetaMask wallet
        await connect();
  
        // You can now use the connected account for further actions, e.g., getting the account balance
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const balance = await provider.getBalance(accounts[0]);
        // console.log("Account balance:", ethers.utils.formatEther(balance));
        
        // Display connected account address in the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'other', text: `Connected wallet` },
        ]);
      } catch (error:any) {
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
      const response = await fetch('https://backend-python-production.up.railway.app/api/message', {  // Update the URL
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
                <Message message={message} key={index}/>
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
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* MetaMask Address */}
            <div className="border-t border-gray-300 pt-4 text-black"> 
                  {address}
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