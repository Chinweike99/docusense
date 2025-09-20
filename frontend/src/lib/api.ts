import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

export const documentAPI = {
    create: (data: {title: string; content: string}) => {
        return api.post('/documents', data)
    },
    getAll: () => {
        return api.get('/documents')
    },
    getById: (id: string) => {
         return api.get(`/documents/${id}`)
    },
    update: (id: string, data: {title?: string, content?: string}) => {
        return api.put(`/documents/${id}`)
    },
    delete: (id: string) => {
        return api.delete(`/documents/${id}`)
    },
    search: (query: string) => {
        return api.post('/documents/search', {query})
    }
};


// Chat API
export const chatAPI = {
  create: (data: { title?: string }) => api.post('/chats', data),
  getAll: () => api.get('/chats'),
  getById: (id: string) => api.get(`/chats/${id}`),
  delete: (id: string) => api.delete(`/chats/${id}`),
  sendMessage: (chatId: string, content: string) => 
    api.post(`/chats/${chatId}/messages`, { content }),
};