// frontend/src/components/DocumentList.tsx
import { Document } from '@/types';
import { PencilIcon, TrashIcon } from 'lucide-react';
import DocumentContent from './DocumentContent';


interface DocumentListProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
}

export default function DocumentList({ documents, onEdit, onDelete }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No documents found. Create your first document to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {Array.isArray(documents) && documents.map(document => (
        <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900">{document.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(document)}
                className="text-gray-400 hover:text-blue-500"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(document.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 whitespace-pre-wrap">
            {/* {document.content} */}
            <DocumentContent content = {document.content} />
          </p>
          
          <div className="text-sm text-gray-500">
            Created: {new Date(document.createdAt).toLocaleDateString()}
            {document.updatedAt !== document.createdAt && (
              <span> • Updated: {new Date(document.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}