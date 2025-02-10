"use client";

import { useState, useRef, useEffect, use } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000");
  }
  return socket;
};

type Message = {
  text: string;
  sender: "me" | "other";
};

export default function Pannel() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello!", sender: "other" },
    { text: "Hey there!", sender: "me" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const word = "Hello World";
  

  useEffect(() => {
    const socket = initializeSocket();

    socket.on("chat", (data) => {
      console.log("Received stroke:", data);
      setMessages((prev) => [...prev, data]);
    });

    socket.on("score", (data) => {
      console.log("Received score:", data);
    });

    return () => {
      socket.off("getStroke");
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socket = initializeSocket();

    const score = {
      name : socket.id,
      score: 10
    }
    if(messages[messages.length - 1].text === word) {
      
      socket.emit("score", score);

    }

  

    return () => {
      socket.off("score");
    };
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { text: inputMessage.trim(), sender: "me" },
    ]);
    socket?.emit("chat", { text: inputMessage.trim(), sender: "other" });
    setInputMessage("");
  };

  return (
    <div className="fixed right-0 bottom-0 h-screen w-[30%] min-w-[300px] bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl border-l border-gray-700 flex flex-col">
      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-lg mb-4 break-words ${
              msg.sender === "me"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-700 text-gray-200 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
