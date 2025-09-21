
'use client';

import { useState, useEffect } from 'react';
import { Document } from '@/types';
import { documentAPI } from '@/lib/api';
import DocumentList from '../components/DocumentList';
import DocumentForm from '../components/DocumentForm';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Sparkles, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [documentSummaries, setDocumentSummaries] = useState<{[key: string]: {summary: string, length: string}}>({});

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await documentAPI.getAll();
      setDocuments(response.data.document);
      console.log("Response data ....", response.data)
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDocument(null);
    setShowForm(true);
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await documentAPI.delete(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      // Also remove any summary for this document
      setDocumentSummaries(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleTextSubmit = async (data: { title: string; content: string }) => {
    try {
      if (editingDocument) {
        await documentAPI.update(editingDocument.id, data);
      } else {
        await documentAPI.create(data);
      }
      setShowForm(false);
      setEditingDocument(null);
      loadDocuments();
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  const handleFileUpload = async (file: File, title: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('document', file);
      formData.append("title", title);

      const response = await documentAPI.upload(formData);
      setDocuments(prev => [response.data, ...prev]);
      setShowForm(false)

    } catch (error) {
      console.log("Failed to upload Document: ", error)
    } finally {
      setIsUploading(false)
    }
  };

  const handleSummarize = async (id: string, length: string = 'medium') => {
    try {
      const response = await documentAPI.summerize(id, length);
      // Store the summary for this specific document
      setDocumentSummaries(prev => ({
        ...prev,
        [id]: {
          summary: response.data.summary,
          length: length
        }
      }));
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };

  const handleDismissSummary = (documentId: string) => {
    setDocumentSummaries(prev => {
      const updated = { ...prev };
      delete updated[documentId];
      return updated;
    });
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
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

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.div
            className="relative mx-auto w-20 h-20 mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-400" />
          </motion.div>
          
          <motion.div
            className="flex items-center gap-3 text-slate-300"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-lg font-medium">Loading documents...</span>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          // variants={headerVariants}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <FileText className="h-8 w-8 text-white" />
            </motion.div>
            
            <div>
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Documents
              </motion.h1>
              <p className="text-slate-400 mt-2">Manage and analyze your documents with AI</p>
            </div>
          </div>

          <motion.button
            onClick={handleCreate}
            className="relative group"
            // variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            {/* Button background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            
            {/* Button content */}
            <div className="relative flex items-center gap-3 px-8 py-4 text-white font-semibold">
              <motion.div
                animate={{ rotate: showForm ? 45 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus className="h-5 w-5" />
              </motion.div>
              <span>Add Document</span>
              <Sparkles className="h-4 w-4 opacity-70" />
            </div>
          </motion.button>
        </motion.div>

        {/* Document Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              <DocumentForm
                document={editingDocument}
                onSubmit={handleTextSubmit}
                onUpload={handleFileUpload}
                onCancel={() => {
                  setShowForm(false);
                  setEditingDocument(null);
                }}
                isUploading={isUploading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <DocumentList
            documents={documents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSummarize={handleSummarize}
            documentSummaries={documentSummaries}
            onDismissSummary={handleDismissSummary}
          />
        </motion.div>

        {/* Empty state */}
        {documents.length === 0 && !showForm && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              className="mx-auto w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-8 border border-slate-600"
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
              <FileText className="h-12 w-12 text-slate-400" />
            </motion.div>
            
            <h3 className="text-2xl font-semibold text-slate-200 mb-4">No documents yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Upload your first document or create a new one to get started with AI-powered document analysis.
            </p>
            
            <motion.button
              onClick={handleCreate}
              className="relative group"
              // variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2 px-6 py-3 text-white font-medium">
                <Plus className="h-4 w-4" />
                <span>Create Your First Document</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}