import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';


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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      setMessages([...messages, { sender: 'self', text: input.trim() }]);
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
