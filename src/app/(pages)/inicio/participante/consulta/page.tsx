'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dadosJson from '@/app/data.json'; // Renomeado para evitar conflito

// Definindo os tipos baseados na estrutura do data.json
type Contribuicao = {
  id: string;
  consultaId: string;
  nome: string;
  email: string;
  cpfCnpj: string;
  data: string;
  contribuicao: string;
  respostas: {
    [key: string]: string;
  };
};

type ConsultaType = {
  id: string;
  titulo: string;
  descricao: string;
  unidadeResponsavel: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
  periodo: string;
  status: string;
  documentoReferencia: string | null;
  perguntas: string[];
  pgaRelacionado: string;
  origemSolicitacao: string;
  dataEnvio: string;
  moderacao: string;
  diasRestantes?: number;
};

export default function ConsultasPage() {
  const [consultasData, setConsultasData] = useState<ConsultaType[]>([]);
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    categoria: 'Todas',
    unidade: 'Todas',
    status: 'Todas'
  });

  useEffect(() => {
    try {
      setLoading(true);
      
      // Acessar corretamente os dados do JSON
      console.log('Dados brutos:', dadosJson); // Debug
      
      // Verificar se existem consultas e filtrar as aprovadas
      const todasConsultas = dadosJson.consultas || [];
      console.log('Todas consultas:', todasConsultas); // Debug
      
      const consultasAprovadas = todasConsultas.filter(
        (consulta: ConsultaType) => consulta.moderacao === 'aprovada'
      );
      
      console.log('Consultas aprovadas:', consultasAprovadas); // Debug
      setConsultasData(consultasAprovadas);
      
      // Setar contribuições
      setContribuicoes(dadosJson.contribuicoes || []);
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível carregar as consultas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Contar contribuições para cada consulta
  const contarContribuicoes = (consultaId: string) => {
    return contribuicoes.filter(c => c.consultaId === consultaId).length;
  };

  // Filtrar consultas com base nos filtros selecionados
  const consultasFiltradas = consultasData.filter(consulta => {
    console.log('Filtrando consulta:', consulta); // Debug
    return (
      (filtros.categoria === 'Todas' || consulta.categoria === filtros.categoria) &&
      (filtros.unidade === 'Todas' || consulta.unidadeResponsavel === filtros.unidade) &&
      (filtros.status === 'Todas' || consulta.status === filtros.status)
    );
  });

  console.log('Consultas filtradas:', consultasFiltradas); // Debug

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 text-sm">
        <Link href="/inicio" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Voltar para início</span>
        </Link>
      </div>
      
      <div className="flex items-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h1 className="text-2xl font-bold text-[#0c2b7a]">Consultas Públicas</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Categoria</label>
            <select 
              className="w-full border rounded p-2"
              value={filtros.categoria}
              onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
            >
              <option>Todas</option>
              <option>Proteção de Direitos</option>
              <option>Transparência Institucional</option>
              <option>Proteção de Dados</option>
              <option>Meio Ambiente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Unidade</label>
            <select 
              className="w-full border rounded p-2"
              value={filtros.unidade}
              onChange={(e) => setFiltros({...filtros, unidade: e.target.value})}
            >
              <option>Todas</option>
              <option>Promotoria de Justiça de Defesa da Mulher</option>
              <option>Corregedoria-Geral</option>
              <option>Encarregado de Dados</option>
              <option>Promotoria de Justiça de Meio Ambiente</option>
              <option>Ouvidoria</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select 
              className="w-full border rounded p-2"
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
            >
              <option>Todas</option>
              <option>Ativa</option>
              <option>Encerrada</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando consultas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : consultasFiltradas.length === 0 ? (
        <div className="text-center py-8">
          <p>Nenhuma consulta disponível com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {consultasFiltradas.map((consulta) => {
            const numContribuicoes = contarContribuicoes(consulta.id);
            
            return (
              <div key={consulta.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="border-t-4 border-green-500"></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-[#0c2b7a]">{consulta.titulo}</h2>
                    <div className="flex items-center bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="text-xs font-medium">{numContribuicoes}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">
                    {consulta.descricao.length > 100
                      ? `${consulta.descricao.substring(0, 100)}...`
                      : consulta.descricao}
                  </p>
                  
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-xs text-gray-600">{consulta.unidadeResponsavel}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">{consulta.categoria}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-600">{consulta.periodo}</span>
                  </div>
                  
                  {consulta.status === 'Ativa' && consulta.diasRestantes ? (
                    <div className="flex items-center mb-3 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs">{consulta.diasRestantes} dias restantes</span>
                    </div>
                  ) : consulta.status === 'Encerrada' ? (
                    <div className="flex items-center mb-3 text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs">Encerrada hoje</span>
                    </div>
                  ) : null}
                  
                  <div className="flex justify-center mt-4">
                    <Link 
                      href={`/inicio/participante/consulta/${consulta.id}`} 
                      className="bg-[#0c2b7a] text-white text-sm font-medium py-2 px-4 rounded hover:bg-[#0a2266] transition w-full text-center"
                    >
                      Participar
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
