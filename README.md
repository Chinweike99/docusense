# Docusense MVP

A **Retrieval-Augmented Generation (RAG)** chatbot built with **Node.js**, **TypeScript**, **Express**, **Next.js 15**, **PostgreSQL**, **Prisma ORM**, and **Ollama** for local LLM processing.

---

## ✨ Features
- **Document Management**: Upload PDF documents or create text documents  
- **Automatic Summarization**: Ollama generates summaries of uploaded documents  
- **Semantic Search**: Find relevant documents using vector embeddings  
- **Chat Interface**: Natural language conversations with context from your documents  
- **RAG Architecture**: Responses are enhanced with relevant document content  
- **File Upload**: Support for PDF documents with text extraction  

---

## 🛠 Tech Stack

### Backend
- Node.js with Express and TypeScript  
- PostgreSQL with Prisma ORM  
- Ollama for local LLM processing  
- Multer for file uploads  
- pdf-parse for PDF text extraction  

### Frontend
- Next.js 15 with TypeScript  
- Tailwind CSS for styling  
- Axios for API communication  

---

## 📋 Prerequisites
Before running this application, ensure you have the following installed:

- Node.js (v18 or higher)  
- PostgreSQL (v12 or higher)  
- Ollama (latest version)  

Required Ollama models:
```bash
ollama pull llama2
ollama pull mxbai-embed-large
OLLAMA_MODEL='llama3.2'
```
##  Installation
### Clone the repository
```bash
git clone git@github.com:Chinweike99/docusense.git
cd docusense
```
## Install backend dependencies
```bash
pnpm install
```

## Install frontend dependencies
```bash
cd frontend
pnpm install
cd ..
```

## Set up the database
```bash
npx prisma db push
```

## Start Ollama service (in a separate terminal)
```bash
ollama serve
```

## Running the Application
### Start the backend server
```bash
npm run dev
```

### Start the frontend development server (in a new terminal)
```bash
cd frontend
npm run dev
```

### Open your browser and navigate to:
```bash
http://localhost:3000
```




