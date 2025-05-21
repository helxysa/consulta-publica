'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConsultasAprovadas from './ConsultasAprovadas';
import ConsultasRejeitadas from './ConsultasRejeitadas';
import ConsultasPendentes from './ConsultasPendentes';

export type Consulta = {
  motivoRejeicao: string;
  id: string;
  titulo: string;
  descricao: string;
  unidadeResponsavel: string;
  categoria: string;
  periodo: string;
  status: string;
  moderacao: string;
  dataEnvio: string;
  perguntas?: string[];
};

type Props = {
  defaultTab?: 'aprovadas' | 'rejeitadas' | 'pendentes';
};

export default function MinhasConsultas({ defaultTab = 'aprovadas' }: Props) {
  const [minhasConsultas, setMinhasConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab] = useState<'aprovadas' | 'rejeitadas' | 'pendentes'>(defaultTab);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/consultas');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar consultas');
        }
        
        const data = await response.json();
        
        // Combinar consultas ativas e pendentes
        const todasConsultas = [
          ...(data.consultas || []),
          ...(data.consultasPendentes || [])
        ];
        
        // Aqui você poderia filtrar apenas as consultas do usuário atual
        // Por enquanto, vamos mostrar todas para demonstração
        setMinhasConsultas(todasConsultas);
      } catch (err) {
        console.error('Erro ao buscar consultas:', err);
        setError('Não foi possível carregar suas consultas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();
  }, []);

  const getStatusBadge = (consulta: Consulta) => {
    if (consulta.moderacao === 'pendente') {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Pendente de Moderação
        </span>
      );
    } else if (consulta.moderacao === 'aprovada') {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Aprovada
        </span>
      );
    } else if (consulta.moderacao === 'rejeitada') {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Rejeitada
        </span>
      );
    }
    return null;
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return 'Data não disponível';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtra as consultas
  const aprovadas = minhasConsultas.filter(c => c.moderacao === 'aprovada');
  const rejeitadas = minhasConsultas.filter(c => c.moderacao === 'rejeitada');
  const pendentes = minhasConsultas.filter(c => c.moderacao === 'pendente');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 text-sm">
        <Link href="/inicio" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Voltar para início</span>
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h1 className="text-2xl font-bold text-[#0c2b7a]">
            {activeTab === 'aprovadas' && 'Consultas Aprovadas'}
            {activeTab === 'rejeitadas' && 'Consultas Rejeitadas'}
            {activeTab === 'pendentes' && 'Consultas Pendentes'}
          </h1>
        </div>
        <Link 
          href="/demandante/nova-consulta" 
          className="bg-[#0c2b7a] text-white hover:bg-[#0a2266] font-medium py-2 px-4 rounded transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Consulta
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando suas consultas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : minhasConsultas.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p>Você ainda não possui consultas cadastradas.</p>
          <Link 
            href="/demandante/nova-consulta" 
            className="mt-4 inline-block bg-[#0c2b7a] text-white hover:bg-[#0a2266] font-medium py-2 px-4 rounded transition"
          >
            Criar Primeira Consulta
          </Link>
        </div>
      ) : (
        <>
          {activeTab === 'aprovadas' && <ConsultasAprovadas consultas={aprovadas} formatarData={formatarData} />}
          {activeTab === 'rejeitadas' && <ConsultasRejeitadas consultas={rejeitadas} formatarData={formatarData} />}
          {activeTab === 'pendentes' && <ConsultasPendentes consultas={pendentes} formatarData={formatarData} />}
        </>
      )}
    </div>
  );
}


