'use client';

import { useState, useEffect } from 'react';
import { Document } from '@/types';
import { documentAPI } from '@/lib/api';
import DocumentList from '../components/DocumentList';
import DocumentForm from '../components/DocumentForm';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false)

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
      alert(`Summary (${response.data.length}):\n\n${response.data.summary}`);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };




  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Document
        </button>
      </div>

      {showForm && (
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
      )}

      <DocumentList
        documents={documents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSummarize={handleSummarize}
      />
    </div>
  );
}