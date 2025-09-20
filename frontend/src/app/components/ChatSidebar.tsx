import { Chat } from "@/types";
import { PlusIcon, TrashIcon } from "lucide-react";


interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: () => void;
  onDeleteChat: (chatId: string) => void;
}


export default function ChatSidebar({
  chats,
  selectedChat,
  onSelectChat,
  onCreateChat,
  onDeleteChat
}: ChatSidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCreateChat}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Array.isArray(chats) && chats.map((chat, index) => (
          <div
            key={chat.id ?? `chat-${index}`}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              selectedChat?.id === chat.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">
                {/* {chat.title && chat.title.trim().length > 0
                  ? chat.title
                  : Array.isArray(chat.messages) && chat.messages.length > 0
                    ? chat.messages[0].content.split(/\s+/).slice(0, 5).join(" ")
                    : chat.messages[0].content.split(/\s+/).slice(0, 5).join(" ")} */}
                    {Array.isArray(chat.messages) && chat.messages.length > 0
                ? chat.messages[0].content
                : "No messages yet"}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            {/* <p className="text-sm text-gray-500 truncate">
              {chat.messages[0]?.content || 'No messages yet'}
            </p> */}

            {/* <p className="text-sm text-gray-500 truncate">
              {Array.isArray(chat.messages) && chat.messages.length > 0
                ? chat.messages[0].content
                : "No messages yet"}
            </p> */}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(chat.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}