'use client';

import Link from 'next/link';

type SidebarProps = {
  activeTab: 'pendentes' | 'aprovadas' | 'rejeitadas';
};

export default function Sidebar({ activeTab }: SidebarProps) {
  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#0c2b7a]">Painel do Moderador</h2>
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

        <ul className="space-y-2">
          <li>
            <Link
              href="/moderador?tab=pendentes"
              className={`flex items-center p-3 rounded-md transition-colors ${
                activeTab === 'pendentes'
                  ? 'bg-[#0c2b7a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Pendentes</span>
            </Link>
          </li>
          <li>
            <Link
              href="/moderador?tab=aprovadas"
              className={`flex items-center p-3 rounded-md transition-colors ${
                activeTab === 'aprovadas'
                  ? 'bg-[#0c2b7a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Aprovadas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/moderador?tab=rejeitadas"
              className={`flex items-center p-3 rounded-md transition-colors ${
                activeTab === 'rejeitadas'
                  ? 'bg-[#0c2b7a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Rejeitadas</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}