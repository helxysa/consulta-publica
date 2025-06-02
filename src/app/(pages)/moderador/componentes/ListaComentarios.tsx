'use client';

import { useState } from 'react';
import { Contribuicao } from '@/app/types/consulta';

type ListaComentariosProps = {
  contribuicoes: Contribuicao[];
  tipo: 'pendentes' | 'aprovadas' | 'rejeitadas';
  onAprovar: (id: string) => void;
  onRejeitar: (id: string) => void;
};

const TITULOS: Record<'pendentes' | 'aprovadas' | 'rejeitadas', string> = {
  pendentes: 'Comentários Pendentes',
  aprovadas: 'Comentários Aprovados',
  rejeitadas: 'Comentários Rejeitados',
};

export default function ListaComentarios({ contribuicoes, tipo, onAprovar, onRejeitar }: ListaComentariosProps) {
  const [notificacaoEmail, setNotificacaoEmail] = useState('');

  const handleNotificar = async (email: string) => {
    setNotificacaoEmail(email);
    setTimeout(() => setNotificacaoEmail(''), 3000);
  };

  // Definir cor da borda por status
  const borderColor = tipo === 'pendentes'
    ? 'border-yellow-500'
    : tipo === 'aprovadas'
    ? 'border-green-500'
    : 'border-red-500';

  return (
    <div className="w-full py-4 px-6">
      <div className="flex items-center mb-4">
        {tipo === 'pendentes' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
          </svg>
        )}
        {tipo === 'aprovadas' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {tipo === 'rejeitadas' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <h1 className={`text-2xl font-bold text-[#0c2b7a]`}>
          {TITULOS[tipo]}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 px-2">
        {contribuicoes.map((contribuicao, idx) => (
          <div
            key={contribuicao.id}
            className={`bg-white rounded-lg overflow-hidden shadow-sm  border-gray-200 border-l-4 ${borderColor}`}
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-[#0c2b7a]">{contribuicao.nome}</h2>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded
                  ${tipo === 'pendentes' ? 'bg-yellow-100 text-yellow-800'
                    : tipo === 'aprovadas' ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'}`}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{contribuicao.email}</p>
              <p className="text-xs text-gray-400 mb-3">Data: {contribuicao.data}</p>
              <div className="mb-2">
                <h4 className="font-medium mb-1 text-sm">Contribuição:</h4>
                <p className="text-gray-700 text-sm">{contribuicao.contribuicao}</p>
              </div>
              <div className="mb-3">
                <h4 className="font-medium mb-1 text-sm">Respostas:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {Object.entries(contribuicao.respostas).map(([pergunta, resposta]) => (
                    <li key={pergunta}>
                      <span className="font-semibold">{pergunta}:</span> {resposta}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                {tipo === 'pendentes' && (
                  <>
                    <button
                      onClick={() => onAprovar(contribuicao.id)}
                      className="bg-green-600 text-white hover:bg-green-700 font-medium py-1.5 px-3 rounded text-sm transition"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => onRejeitar(contribuicao.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 font-medium py-1.5 px-3 rounded text-sm transition"
                    >
                      Rejeitar
                    </button>
                  </>
                )}
                {tipo === 'rejeitadas' && (
                  <button
                    onClick={() => handleNotificar(contribuicao.email)}
                    className="bg-blue-500 text-white font-medium py-1.5 px-3 rounded text-sm hover:bg-blue-600 transition"
                  >
                    {notificacaoEmail === contribuicao.email ? 'Notificado!' : 'Notificar Usuário'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 