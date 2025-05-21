'use client';

type Props = {
  activeTab: 'nova' | 'aprovadas' | 'rejeitadas' | 'pendentes';
  setActiveTab: (tab: 'nova' | 'aprovadas' | 'rejeitadas' | 'pendentes') => void;
};

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
        <button
          onClick={() => setActiveTab('nova')}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'nova'
              ? 'bg-blue-50 text-[#0c2b7a]'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Nova Consulta
        </button>
        
        <div className="pt-2">
          <div className="px-3 py-1 text-xs font-semibold text-gray-500">
            Minhas Consultas
          </div>
          
          <button
            onClick={() => setActiveTab('aprovadas')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'aprovadas'
                ? 'bg-blue-50 text-[#0c2b7a]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Consultas Aprovadas
          </button>
          
          <button
            onClick={() => setActiveTab('rejeitadas')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'rejeitadas'
                ? 'bg-blue-50 text-[#0c2b7a]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Consultas Rejeitadas
          </button>
          
          <button
            onClick={() => setActiveTab('pendentes')}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'pendentes'
                ? 'bg-blue-50 text-[#0c2b7a]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Consultas Pendentes
          </button>
        </div>
      </nav>
    </div>
  );
} 