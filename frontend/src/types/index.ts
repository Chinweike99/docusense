export interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    fileName: string;
    fileSize: number;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}