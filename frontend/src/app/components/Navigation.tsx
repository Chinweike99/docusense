'use client';

import { FileText, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Chat',
      href: '/',
      icon: MessageSquareHeart,
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
    },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">RAG Chatbot</h1>
          </div>
          
          <div className="flex space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}