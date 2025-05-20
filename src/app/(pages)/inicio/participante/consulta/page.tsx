'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConsultaType } from '@/app/types/consulta';

export default function ConsultasPage() {
  const [consultasData, setConsultasData] = useState<ConsultaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    categoria: 'Todas',
    unidade: 'Todas',
    status: 'Todas'
  });

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/consultas');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar consultas');
        }
        
        const data = await response.json();
        
        // Filtrar apenas consultas aprovadas
        const consultasAprovadas = data.consultas.filter(
          (consulta: ConsultaType) => consulta.moderacao === 'aprovada'
        );
        
        setConsultasData(consultasAprovadas);
      } catch (err) {
        console.error('Erro ao buscar consultas:', err);
        setError('Não foi possível carregar as consultas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();
  }, []);

  // Filtrar consultas com base nos filtros selecionados
  const consultasFiltradas = consultasData.filter(consulta => 
    (filtros.categoria === 'Todas' || consulta.categoria === filtros.categoria) &&
    (filtros.unidade === 'Todas' || consulta.unidadeResponsavel === filtros.unidade) &&
    (filtros.status === 'Todas' || consulta.status === filtros.status)
  );

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
          {consultasFiltradas.map((consulta) => (
            <div key={consulta.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="border-t-4 border-green-500"></div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 text-[#0c2b7a]">{consulta.titulo}</h2>
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
          ))}
        </div>
      )}
    </div>
  );
}
