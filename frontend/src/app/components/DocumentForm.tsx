import React, { useState, useEffect } from 'react';
import { Document } from '@/types';

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
  const [isFileUpload, setIsFileUpload] = useState(false)

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setIsFileUpload(!!document.fileName)
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
    if(selectedFile && title.trim()){
      onUpload(selectedFile, title.trim())
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]){
      setSelectedFile(e.target.files[0]);
      if(!title){
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={isFileUpload ? handleFileSubmit : handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {document ? 'Edit Document' : 'Add Document'}
          </h2>

       {!document && (
            <div className="mb-4">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  checked={!isFileUpload}
                  onChange={() => setIsFileUpload(false)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Text Input</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={isFileUpload}
                  onChange={() => setIsFileUpload(true)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">File Upload</span>
              </label>
            </div>
          )}


          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

           {isFileUpload ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!document}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a PDF file (max 10MB)
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!document}
              />
            </div>
          )}

          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div> */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Processing...' : document ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}