
import { Document } from '@/types';
import { FileText, PencilIcon, TrashIcon, Calendar, Sparkles, Zap, Clock, File, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import DocumentContent from './DocumentContent';

interface DocumentListProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
  onSummarize: (id: string, length: string) => void;
  documentSummaries: {[key: string]: {summary: string, length: string}};
  onDismissSummary: (documentId: string) => void;
}

export default function DocumentList({ 
  documents, 
  onEdit, 
  onDelete, 
  onSummarize, 
  documentSummaries,
  onDismissSummary 
}: DocumentListProps) {
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);
  const [summarizingDocument, setSummarizingDocument] = useState<string | null>(null);

  const handleSummarize = async (id: string, length: string) => {
    setSummarizingDocument(id);
    await onSummarize(id, length);
    setSummarizingDocument(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1, opacity: 0.7 },
    hover: {
      scale: 1.1,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.9 }
  };

  const summaryButtonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
  };

  const summaryVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
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

  if (documents.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mx-auto w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-600"
          animate={{
            scale: [1, 1.05, 1],
            borderColor: ['rgba(71, 85, 105, 0.5)', 'rgba(34, 211, 238, 0.3)', 'rgba(71, 85, 105, 0.5)']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FileText className="h-10 w-10 text-slate-400" />
        </motion.div>
        <p className="text-slate-400 text-lg">No documents found. Create your first document to get started.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence mode="popLayout">
        {documents.map((document, index) => {
          const isHovered = hoveredDocument === document.id;
          const isSummarizing = summarizingDocument === document.id;
          const hasSummary = documentSummaries[document.id];
          
          return (
            <motion.div
              key={document.id}
              className="relative group"
              // variants={itemVariants}
              layout
              onHoverStart={() => setHoveredDocument(document.id)}
              onHoverEnd={() => setHoveredDocument(null)}
            >
              {/* Background with gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div
                className={`relative bg-slate-800/90 backdrop-blur-sm border rounded-xl p-8 transition-all duration-300 ${
                  isHovered 
                    ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                    : 'border-slate-700/50'
                }`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Document Icon */}
                    <motion.div
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        document.fileName
                          ? isHovered
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
                            : 'bg-slate-700/50 border-slate-600/50'
                          : isHovered
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
                            : 'bg-slate-700/50 border-slate-600/50'
                      }`}
                      animate={isHovered ? {
                        scale: [1, 1.05, 1],
                        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      } : {}}
                    >
                      <FileText className={`h-6 w-6 transition-colors duration-300 ${
                        isHovered 
                          ? document.fileName ? 'text-cyan-400' : 'text-purple-400'
                          : 'text-slate-400'
                      }`} />
                    </motion.div>

                    {/* Title and metadata */}
                    <div className="flex-1 min-w-0">
                      <motion.h3
                        className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                          isHovered ? 'text-white' : 'text-slate-200'
                        }`}
                        layoutId={`title-${document.id}`}
                      >
                        {document.title}
                      </motion.h3>
                      
                      {/* File info */}
                      {document.fileName && (
                        <motion.div
                          className="flex items-center gap-4 text-sm text-slate-400 mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-1">
                            <File className="h-4 w-4" />
                            <span>{document.fileName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>•</span>
                            <span>{formatFileSize(document.fileSize || 0)}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.button
                      onClick={() => onEdit(document)}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        isHovered 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10'
                      }`}
                      // variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      title="Edit document"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => onDelete(document.id)}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        isHovered 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      // variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      title="Delete document"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Content Preview */}
                <motion.div
                  className="mb-6"
                  layoutId={`content-${document.id}`}
                >
                  <p className="text-slate-300 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                    {document.content}
                  </p>
                  <DocumentContent content={document.content}/>
                </motion.div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  {/* Date info */}
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(document.createdAt)}</span>
                    </div>
                    {document.updatedAt !== document.createdAt && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Updated {formatDate(document.updatedAt)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Summary buttons */}
                  {document.fileName && (
                    <motion.div
                      className="flex gap-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {['short', 'medium', 'long'].map((length) => (
                        <motion.button
                          key={length}
                          onClick={() => handleSummarize(document.id, length)}
                          disabled={isSummarizing}
                          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isSummarizing
                              ? 'opacity-50 cursor-not-allowed'
                              : isHovered
                                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-slate-600/50 hover:border-cyan-500/30'
                          }`}
                          // variants={summaryButtonVariants}
                          initial="rest"
                          whileHover={!isSummarizing ? "hover" : "rest"}
                          whileTap={!isSummarizing ? "tap" : "rest"}
                        >
                          {isSummarizing ? (
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <span>AI Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Zap className="h-3 w-3" />
                              <span className="capitalize">{length} Summary</span>
                            </div>
                          )}
                          
                          {/* Button glow effect */}
                          <AnimatePresence>
                            {isHovered && !isSummarizing && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Hover glow effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Summary Display - Shows beneath the main document */}
              <AnimatePresence>
                {hasSummary && (
                  <motion.div
                    className="mt-4 relative group/summary"
                    // variants={summaryVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Background with gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl blur-sm" />
                    <div className="relative bg-gradient-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <motion.div
                            className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <CheckCircle className="h-5 w-5 text-amber-400" />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-amber-200 font-semibold">AI Summary</h4>
                              <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-300 rounded-full capitalize">
                                {hasSummary.length}
                              </span>
                            </div>
                            <p className="text-amber-100/90 leading-relaxed">
                              {hasSummary.summary}
                            </p>
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={() => onDismissSummary(document.id)}
                          className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors flex-shrink-0"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Dismiss summary"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}