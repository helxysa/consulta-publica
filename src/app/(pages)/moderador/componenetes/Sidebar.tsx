'use client';

import Link from 'next/link';

type SidebarProps = {
  activeSection: 'consultas' | 'comentarios';
  activeTabConsultas: 'pendentes' | 'aprovadas' | 'rejeitadas';
  activeTabComentarios: 'pendentes' | 'aprovadas' | 'rejeitadas';
  countConsultas: { pendentes: number; aprovadas: number; rejeitadas: number };
  countComentarios: { pendentes: number; aprovadas: number; rejeitadas: number };
};

export default function Sidebar({
  activeSection,
  activeTabConsultas,
  activeTabComentarios,
  countConsultas,
  countComentarios
}: SidebarProps) {
  // SVG padrão
  const icons = {
    pendentes: (
      <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
      </svg>
    ),
    aprovadas: (
      <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    rejeitadas: (
      <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full shadow-md">
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

        {/* Seção de Consultas */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Consultas
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/moderador?section=consultas&tab=pendentes"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  activeSection === 'consultas' && activeTabConsultas === 'pendentes'
                    ? 'bg-[#0c2b7a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons.pendentes}
                <span>Pendentes</span>
                <span className="ml-auto text-xs font-bold">{countConsultas.pendentes}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/moderador?section=consultas&tab=aprovadas"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  activeSection === 'consultas' && activeTabConsultas === 'aprovadas'
                    ? 'bg-[#0c2b7a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons.aprovadas}
                <span>Aprovadas</span>
                <span className="ml-auto text-xs font-bold">{countConsultas.aprovadas}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/moderador?section=consultas&tab=rejeitadas"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  activeSection === 'consultas' && activeTabConsultas === 'rejeitadas'
                    ? 'bg-[#0c2b7a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons.rejeitadas}
                <span>Rejeitadas</span>
                <span className="ml-auto text-xs font-bold">{countConsultas.rejeitadas}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Seção de Comentários */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Comentários
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/moderador?section=comentarios&tab=pendentes"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  activeSection === 'comentarios' && activeTabComentarios === 'pendentes'
                    ? 'bg-[#0c2b7a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons.pendentes}
                <span>Pendentes</span>
                <span className="ml-auto text-xs font-bold">{countComentarios.pendentes}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/moderador?section=comentarios&tab=aprovadas"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  activeSection === 'comentarios' && activeTabComentarios === 'aprovadas'
                    ? 'bg-[#0c2b7a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons.aprovadas}
                <span>Aprovados</span>
                <span className="ml-auto text-xs font-bold">{countComentarios.aprovadas}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/moderador?section=comentarios&tab=rejeitadas"
                className={`flex items-center p-3 rounded-md transition-colors ${
                  activeSection === 'comentarios' && activeTabComentarios === 'rejeitadas'
                    ? 'bg-[#0c2b7a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {icons.rejeitadas}
                <span>Rejeitados</span>
                <span className="ml-auto text-xs font-bold">{countComentarios.rejeitadas}</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}