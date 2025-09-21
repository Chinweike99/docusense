"use client";

import { Chat, Message } from "@/types";
import { SendIcon, Bot, User, Sparkles, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWindowProps {
    chat: Chat | null;
    onSendMessage: (content: string) => void;
}

export default function ChatWindow({ chat, onSendMessage }: ChatWindowProps) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && chat) {
            onSendMessage(message.trim());
            setMessage('');
            setIsTyping(true);
            
            // Simulate AI response delay
            setTimeout(() => setIsTyping(false), 2000);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    const inputVariants = {
        focus: {
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeInOut" }
        },
        blur: {
            scale: 1,
            transition: { duration: 0.2, ease: "easeInOut" }
        }
    };

    const buttonVariants = {
        rest: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2, ease: "easeInOut" }
        },
        tap: { scale: 0.95 },
        disabled: {
            scale: 1,
            opacity: 0.5
        }
    };

    const welcomeVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    if (!chat) {
        return (
            <motion.div
                className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.6, 0.3, 0.6],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />
                </div>

                <motion.div
                    className="text-center text-slate-200 relative z-10"
                    // variants={welcomeVariants}
                >
                    <motion.div
                        className="mx-auto w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-8"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    >
                        <Sparkles className="h-12 w-12 text-white" />
                    </motion.div>
                    
                    <motion.h2
                        className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        Welcome to Docusense
                    </motion.h2>
                    
                    <motion.p
                        className="text-slate-400 text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Select a chat or create a new one to start your AI conversation
                    </motion.p>
                    
                    <motion.div
                        className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <Zap className="h-4 w-4" />
                        <span>Powered by advanced AI technology</span>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="flex-1 flex  flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <AnimatePresence>
                    {Array.isArray(chat.messages) && chat.messages.map((msg: Message, index: number) => (
                        <motion.div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            // variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className={`flex items-start gap-3 max-w-[80%] ${
                                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}>
                                {/* Avatar */}
                                <motion.div
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                    }`}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.2
                                    }}
                                >
                                    {msg.role === 'user' ? (
                                        <User className="h-5 w-5 text-white" />
                                    ) : (
                                        <Bot className="h-5 w-5 text-white" />
                                    )}
                                </motion.div>

                                {/* Message bubble */}
                                <motion.div
                                    className={`relative rounded-2xl px-6 py-4 backdrop-blur-sm border ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white border-blue-400/30'
                                            : 'bg-slate-800/90 text-slate-200 border-slate-600/50'
                                    }`}
                                    whileHover={{
                                        scale: 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {/* Glow effect */}
                                    <div className={`absolute inset-0 rounded-2xl blur-lg opacity-20 ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                    }`} />
                                    
                                    <div className="relative z-10">
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                                            {msg.content}
                                        </p>
                                        <span className={`text-xs mt-2 block opacity-70 ${
                                            msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                                        }`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            className="flex justify-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-start gap-3 max-w-[80%]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="bg-slate-800/90 rounded-2xl px-6 py-4 border border-slate-600/50">
                                    <div className="flex space-x-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 bg-cyan-400 rounded-full"
                                                animate={{
                                                    opacity: [0.4, 1, 0.4],
                                                    scale: [1, 1.2, 1],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.2,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <div className="w-full">
            <motion.div
                className="p-6 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-xl"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <form onSubmit={handleSubmit} className="relative w-full ">
                    <div className="flex gap-4 items-end ">
                        <motion.div
                            className="flex-1 relative"
                            // variants={inputVariants}
                            whileFocus="focus"
                            initial="blur"
                        >
                            {/* Input glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
                            
                            <input
                                ref={inputRef}
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="relative w-full bg-slate-800/90 border border-slate-600/50 rounded-xl px-6 py-4 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                            />
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={!message.trim()}
                            className="relative p-4 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed group"
                            // variants={buttonVariants}
                            initial="rest"
                            whileHover={message.trim() ? "hover" : "disabled"}
                            whileTap={message.trim() ? "tap" : "disabled"}
                        >
                            {/* Button background */}
                            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                                message.trim()
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-400'
                                    : 'bg-slate-700'
                            }`} />
                            
                            {/* Button glow */}
                            <div className={`absolute inset-0 rounded-xl blur-lg transition-all duration-300 ${
                                message.trim()
                                    ? 'bg-gradient-to-r from-cyan-500/50 to-blue-500/50 group-hover:opacity-100 opacity-50'
                                    : 'opacity-0'
                            }`} />
                            
                            {/* Icon */}
                            <motion.div
                                className="relative z-10"
                                animate={message.trim() ? {
                                    rotate: [0, 15, -15, 0],
                                    transition: { duration: 0.5, ease: "easeInOut" }
                                } : {}}
                            >
                                <SendIcon className={`h-5 w-5 transition-colors duration-300 ${
                                    message.trim() ? 'text-white' : 'text-slate-400'
                                }`} />
                            </motion.div>
                        </motion.button>
                    </div>
                </form>
            </motion.div>
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