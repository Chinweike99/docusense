import { Chat } from "@/types";
import { PlusIcon, TrashIcon, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const sidebarVariants = {
    hidden: { x: -320, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const chatItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: {
      x: -20,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.98 }
  };

  const deleteButtonVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.9, rotate: -5 }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      className="w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col backdrop-blur-xl"
      initial="hidden"
      animate="visible"
      // variants={sidebarVariants}
    >
      {/* Header with New Chat Button */}
      <motion.div
        className="p-6 border-b border-slate-700/50 bg-slate-800/30"
        // variants={headerVariants}
      >
        <motion.button
          onClick={onCreateChat}
          className="w-full relative group"
          // variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
          
          {/* Button content */}
          <div className="relative flex items-center justify-center gap-3 py-3 px-6 text-white font-semibold tracking-wide">
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PlusIcon className="h-5 w-5" />
            </motion.div>
            <span>New Chat</span>
            <Sparkles className="h-4 w-4 opacity-70" />
          </div>
        </motion.button>
      </motion.div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {Array.isArray(chats) && chats.map((chat, index) => {
            const isSelected = selectedChat?.id === chat.id;
            const isHovered = hoveredChatId === chat.id;
            
            return (
              <motion.div
                key={chat.id ?? `chat-${index}`}
                className="relative"
                // variants={chatItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredChatId(chat.id)}
                onHoverEnd={() => setHoveredChatId(null)}
              >
                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  className={`relative p-4 border-b border-slate-700/30 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-sm' 
                      : 'hover:bg-slate-800/50'
                  }`}
                  onClick={() => onSelectChat(chat)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Hover glow effect */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Chat icon */}
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          className={`p-2 rounded-lg ${
                            isSelected 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' 
                              : 'bg-slate-700/50 border border-slate-600/50'
                          }`}
                          animate={isSelected ? {
                            scale: [1, 1.05, 1],
                            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          } : {}}
                        >
                          <MessageSquare className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        </motion.div>
                        
                        <h3 className={`font-semibold text-sm leading-tight ${
                          isSelected ? 'text-white' : 'text-slate-200'
                        }`}>
                          {truncateText(
                            Array.isArray(chat.messages) && chat.messages.length > 0
                              ? chat.messages[0].content
                              : "New conversation"
                          )}
                        </h3>
                      </div>

                      {/* Date */}
                      <p className={`text-xs ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {new Date(chat.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: new Date(chat.updatedAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </p>
                    </div>

                    {/* Delete button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isHovered 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      variants={deleteButtonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {(!chats || chats.length === 0) && (
          <motion.div
            className="p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </motion.div>
            <p className="text-slate-400 text-sm">No conversations yet</p>
            <p className="text-slate-500 text-xs mt-1">Start a new chat to begin</p>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </motion.div>
  );
}