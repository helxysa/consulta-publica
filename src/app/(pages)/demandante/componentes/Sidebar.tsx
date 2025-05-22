'use client';

import Link from 'next/link';

type Props = {
  activeTab: 'nova' | 'aprovadas' | 'rejeitadas' | 'pendentes';
  setActiveTab: (tab: 'nova' | 'aprovadas' | 'rejeitadas' | 'pendentes') => void;
};

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#0c2b7a]">Minhas Consultas</h2>
      </div>
      <nav className="p-4">
        <Link
          href="/inicio"
          className="flex items-center p-3 rounded-md transition-colors text-gray-700 hover:bg-gray-100 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Voltar</span>
        </Link>

        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('nova')}
            className={`w-full flex items-center p-3 rounded-md transition-colors text-sm font-medium ${
              activeTab === 'nova'
                ? 'bg-[#0c2b7a] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Nova Consulta
          </button>
          
          <button
            onClick={() => setActiveTab('aprovadas')}
            className={`w-full flex items-center p-3 rounded-md transition-colors text-sm font-medium ${
              activeTab === 'aprovadas'
                ? 'bg-[#0c2b7a] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Consultas Aprovadas
          </button>
          
          <button
            onClick={() => setActiveTab('rejeitadas')}
            className={`w-full flex items-center p-3 rounded-md transition-colors text-sm font-medium ${
              activeTab === 'rejeitadas'
                ? 'bg-[#0c2b7a] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Consultas Rejeitadas
          </button>
          
          <button
            onClick={() => setActiveTab('pendentes')}
            className={`w-full flex items-center p-3 rounded-md transition-colors text-sm font-medium ${
              activeTab === 'pendentes'
                ? 'bg-[#0c2b7a] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Consultas Pendentes
          </button>
        </div>
      </nav>
    </div>
  );
} 