'use client';

import { chatAPI } from "@/lib/api";
import { Chat } from "@/types";
import { useEffect, useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";


export default function Home() {

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isloading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []) ;
  const loadChats = async()=>{
    try {
      const response = await chatAPI.getAll();
      setChats(response.data.chat)
    } catch (error) {
      console.error("Failed to load chats: ", error)
    }finally{
      setLoading(false)
    }
  };

  const createNewChat = async()=>{
    try {
      const response = await chatAPI.create({});
      const newChat = response.data.chat;
      setChats(prev => Array.isArray(prev) ?  [...prev, newChat] : newChat);
      setSelectedChat(newChat)
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const deleteChat = async(chatId: string) => {
    try {
      await chatAPI.delete(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }

  const sendMessage = async(content: string) => {
    if(!selectedChat) return;

    try {
      const response = await chatAPI.sendMessage(selectedChat.id, content);
      const {userMessage, assistantmessage} = response.data;
      const updatedChat = {
        ...selectedChat,
        messages: [
          ...selectedChat.messages,
          userMessage,
          assistantmessage
        ]
      }

      setSelectedChat(updatedChat);
      setChats(prev => 
        prev.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
      )

    } catch (error) {
      console.error('Failed to send message:', error);
    }

  }


  if (isloading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onCreateChat={createNewChat}
        onDeleteChat={deleteChat}
      />
      
      <ChatWindow
        chat={selectedChat}
        onSendMessage={sendMessage}
      />
    </div>
  );

}
