// // frontend/src/components/DocumentList.tsx
// import { Document } from '@/types';
// import { PencilIcon, TrashIcon } from 'lucide-react';
// import DocumentContent from './DocumentContent';


// interface DocumentListProps {
//   documents: Document[];
//   onEdit: (document: Document) => void;
//   onDelete: (id: string) => void;
//   onSummarize: (id: string, length: string) => void;
// }

// export default function DocumentList({ documents, onEdit, onDelete }: DocumentListProps) {
//   if (documents.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-500">No documents found. Create your first document to get started.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-4">
//       {Array.isArray(documents) && documents.map(document => (
//         <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-6">
//           <div className="flex justify-between items-start mb-3">
//             <h3 className="text-xl font-semibold text-gray-900">{document.title}</h3>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => onEdit(document)}
//                 className="text-gray-400 hover:text-blue-500"
//               >
//                 <PencilIcon className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => onDelete(document.id)}
//                 className="text-gray-400 hover:text-red-500"
//               >
//                 <TrashIcon className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
          
//           <div className="text-gray-600 mb-4 whitespace-pre-wrap">
//             <DocumentContent content = {document.content} />
//           </div>
          
//           <div className="text-sm text-gray-500">
//             Created: {new Date(document.createdAt).toLocaleDateString()}
//             {document.updatedAt !== document.createdAt && (
//               <span> • Updated: {new Date(document.updatedAt).toLocaleDateString()}</span>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// frontend/src/components/DocumentList.tsx
import { Document } from '@/types';
import { BookAIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
  onSummarize: (id: string, length: string) => void;
}

export default function DocumentList({ documents, onEdit, onDelete, onSummarize }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No documents found. Create your first document to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map(document => (
        <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start">
              {document.fileName && (
                <BookAIcon className="h-5 w-5 text-blue-500 mt-1 mr-2" />
              )}
              <h3 className="text-xl font-semibold text-gray-900">{document.title}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(document)}
                className="text-gray-400 hover:text-blue-500"
                title="Edit"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(document.id)}
                className="text-gray-400 hover:text-red-500"
                title="Delete"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 whitespace-pre-wrap line-clamp-3">
            {document.content}
          </p>
          
          {document.fileName && (
            <div className="text-sm text-gray-500 mb-2">
              File: {document.fileName} ({Math.round((document.fileSize || 0) / 1024)} KB)
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Created: {new Date(document.createdAt).toLocaleDateString()}
              {document.updatedAt !== document.createdAt && (
                <span> • Updated: {new Date(document.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
            
            {document.fileName && (
              <div className="flex gap-2">
                <button
                  onClick={() => onSummarize(document.id, 'short')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Short Summary
                </button>
                <button
                  onClick={() => onSummarize(document.id, 'medium')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Medium Summary
                </button>
                <button
                  onClick={() => onSummarize(document.id, 'long')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Long Summary
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}