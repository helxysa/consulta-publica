'use client';

import { useState, useEffect } from 'react';
import SolicitantePage from "./componentes/Solicitante";
import ConsultasAprovadas from "./componentes/ConsultasAprovadas";
import ConsultasRejeitadas from "./componentes/ConsultasRejeitadas";
import ConsultasPendentes from "./componentes/ConsultasPendentes";
import Sidebar from './componentes/Sidebar';

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

export default function DemandantePage() {
  const [activeTab, setActiveTab] = useState<'nova' | 'aprovadas' | 'rejeitadas' | 'pendentes'>('nova');
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== 'nova') {
      fetchConsultas();
    }
  }, [activeTab]);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      
      // Usar apenas a rota existente
      const response = await fetch('/api/consultas');
      
      if (!response.ok) {
        throw new Error('Falha ao carregar consultas');
      }
      
      const data = await response.json();
      
      // Combinar todas as consultas
      const todasConsultas = [
        ...(data.consultas || []),
        ...(data.consultasPendentes || []),
        ...(data.consultasRejeitadas || [])
      ];
      
      setConsultas(todasConsultas);
    } catch (err) {
      console.error('Erro ao buscar consultas:', err);
      setError('Não foi possível carregar suas consultas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
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

  // Filtrar consultas por status
  const aprovadas = consultas.filter(c => c.moderacao === 'aprovada');
  const rejeitadas = consultas.filter(c => c.moderacao === 'rejeitada');
  const pendentes = consultas.filter(c => c.moderacao === 'pendente');

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'nova' ? (
            <>
              <h1 className="text-2xl font-bold text-[#0c2b7a] mb-6">Nova Consulta</h1>
              <SolicitantePage />
            </>
          ) : activeTab === 'aprovadas' ? (
            <>
              <h1 className="text-2xl font-bold text-[#0c2b7a] mb-6">Consultas Aprovadas</h1>
              {loading ? (
                <div className="text-center py-8">
                  <p>Carregando consultas...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                </div>
              ) : (
                <ConsultasAprovadas consultas={aprovadas} formatarData={formatarData} />
              )}
            </>
          ) : activeTab === 'rejeitadas' ? (
            <>
              <h1 className="text-2xl font-bold text-[#0c2b7a] mb-6">Consultas Rejeitadas</h1>
              {loading ? (
                <div className="text-center py-8">
                  <p>Carregando consultas...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                </div>
              ) : (
                <ConsultasRejeitadas consultas={rejeitadas} formatarData={formatarData} />
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#0c2b7a] mb-6">Consultas Pendentes</h1>
              {loading ? (
                <div className="text-center py-8">
                  <p>Carregando consultas...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                </div>
              ) : (
                <ConsultasPendentes consultas={pendentes} formatarData={formatarData} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}