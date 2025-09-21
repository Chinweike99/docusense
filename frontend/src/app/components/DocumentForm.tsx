import React, { useState, useEffect } from 'react';
import { Document } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';

interface DocumentFormProps {
  document?: Document | null;
  onSubmit: (data: { title: string; content: string }) => void;
  onUpload: (file: File, title: string) => void;
  isUploading: boolean;
  onCancel: () => void;
}

export default function DocumentForm({ document, onSubmit, onUpload, isUploading, onCancel }: DocumentFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setIsFileUpload(!!document.fileName);
    }
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit({ title: title.trim(), content: content.trim() });
    }
  };

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && title.trim()) {
      onUpload(selectedFile, title.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
  };

  const radioVariants = {
    unchecked: { scale: 1 },
    checked: { 
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Modal */}
      <motion.div
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-700/50 shadow-2xl"
        // variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
        
        <div className="relative p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <form onSubmit={isFileUpload ? handleFileSubmit : handleSubmit}>
            {/* Header */}
            <motion.div
              className="flex justify-between items-center mb-8"
              // variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <FileText className="h-6 w-6 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {document ? 'Edit Document' : 'Add Document'}
                </h2>
              </div>
              
              <motion.button
                type="button"
                onClick={onCancel}
                className="p-3 rounded-xl bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all duration-200 border border-slate-600/50"
                // variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Mode Selection */}
            {!document && (
              <motion.div
                className="mb-8"
                // variants={itemVariants}
              >
                <p className="text-slate-300 mb-4 font-medium">Choose input method:</p>
                <div className="flex gap-4">
                  {[
                    { id: 'text', label: 'Text Input', icon: FileText, active: !isFileUpload },
                    { id: 'file', label: 'File Upload', icon: Upload, active: isFileUpload }
                  ].map((option) => (
                    <motion.label
                      key={option.id}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                        option.active
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300'
                          : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-slate-300'
                      }`}
                      // variants={radioVariants}
                      animate={option.active ? "checked" : "unchecked"}
                    >
                      <input
                        type="radio"
                        checked={option.active}
                        onChange={() => setIsFileUpload(option.id === 'file')}
                        className="sr-only"
                      />
                      <option.icon className="h-5 w-5" />
                      <span className="font-medium">{option.label}</span>
                      {option.active && (
                        <motion.div
                          className="ml-auto"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="h-4 w-4 text-cyan-400" />
                        </motion.div>
                      )}
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Title Field */}
            <motion.div
              className="mb-6"
              // variants={itemVariants}
            >
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Document Title
              </label>
              <div className="relative">
                <motion.input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter document title..."
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              {isFileUpload ? (
                <motion.div
                  key="upload"
                  className="mb-8"
                  // variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    PDF Document
                  </label>
                  
                  {/* File Upload Area */}
                  <motion.div
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                      dragActive
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : selectedFile
                          ? 'border-green-400 bg-green-500/10'
                          : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!document}
                    />
                    
                    <div className="text-center">
                      <motion.div
                        className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center"
                        animate={dragActive ? {
                          scale: [1, 1.1, 1],
                          transition: { duration: 0.5, repeat: Infinity }
                        } : selectedFile ? {
                          scale: [1, 1.05, 1],
                          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        } : {}}
                      >
                        {selectedFile ? (
                          <Check className="h-8 w-8 text-green-400" />
                        ) : (
                          <Upload className="h-8 w-8 text-cyan-400" />
                        )}
                      </motion.div>
                      
                      {selectedFile ? (
                        <div>
                          <p className="text-green-300 font-medium mb-1">{selectedFile.name}</p>
                          <p className="text-slate-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-300 font-medium mb-1">
                            {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                          </p>
                          <p className="text-slate-400 text-sm">or click to browse (max 10MB)</p>
                        </div>
                      )}
                    </div>
                    
                    {dragActive && (
                      <motion.div
                        className="absolute inset-0 bg-cyan-500/20 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                  
                  {selectedFile && (
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-sm text-slate-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>PDF will be processed by AI for content extraction</span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="text"
                  className="mb-8"
                  // variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Document Content
                  </label>
                  <div className="relative">
                    <motion.textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={12}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all duration-300 backdrop-blur-sm resize-none"
                      placeholder="Enter your document content here..."
                      required={!document}
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              className="flex justify-end gap-4"
              // variants={itemVariants}
            >
              <motion.button
                type="button"
                onClick={onCancel}
                disabled={isUploading}
                className="px-6 py-3 text-slate-400 hover:text-slate-200 transition-colors duration-200 disabled:opacity-50 font-medium"
                // variants={buttonVariants}
                initial="rest"
                whileHover={!isUploading ? "hover" : "rest"}
                whileTap={!isUploading ? "tap" : "rest"}
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={isUploading}
                className="relative group px-8 py-3 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                // variants={buttonVariants}
                initial="rest"
                whileHover={!isUploading ? "hover" : "rest"}
                whileTap={!isUploading ? "tap" : "rest"}
              >
                {/* Button background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                
                {/* Button content */}
                <div className="relative flex items-center gap-3 text-white">
                  {isUploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-5 w-5" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>{document ? 'Update Document' : 'Create Document'}</span>
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>

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