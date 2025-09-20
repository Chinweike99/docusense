"use client";

import { Chat, Message } from "@/types";
import { SendIcon } from "lucide-react";
import { useState } from "react";
// import { PaperAirplaneIcon } from '@heroicons/react/24/outline';


interface ChatWindowProps {
    chat: Chat | null;
    onSendMessage: (content: string) => void;
};


export default function ChatWindow({chat, onSendMessage}: ChatWindowProps){

    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(message.trim() && chat) {
            onSendMessage(message.trim());
            setMessage('')
        }
    }

      if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Docusense</h2>
          <p>Select a chat or create a new one to start conversation</p>
        </div>
      </div>
    );
  }

    return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {Array.isArray(chat.messages) && chat.messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2/3 rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}