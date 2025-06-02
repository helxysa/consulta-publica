'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from './componenetes/Sidebar';
import ModeradorTodas from './componenetes/ModeradorTodas';
import ModeradorAprovadas from './componenetes/ModeradorAprovadas';
import ModeradorRejeitadas from './componenetes/ModeradorRejeitadas';
import ListaComentarios from './componentes/ListaComentarios';
import dadosJson from '@/app/data.json';
import { Contribuicao } from '@/app/types/consulta';

const statusMap = {
  pendentes: 'pendente',
  aprovadas: 'aprovada',
  rejeitadas: 'rejeitada'
} as const;

function ModeradorContent() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section') as 'consultas' | 'comentarios' || 'consultas';
  const tabParam = searchParams.get('tab') as 'pendentes' | 'aprovadas' | 'rejeitadas' || 'pendentes';

  // Estados separados para cada seção
  const [activeSection, setActiveSection] = useState<'consultas' | 'comentarios'>(sectionParam);
  const [activeTabConsultas, setActiveTabConsultas] = useState<'pendentes' | 'aprovadas' | 'rejeitadas'>('pendentes');
  const [activeTabComentarios, setActiveTabComentarios] = useState<'pendentes' | 'aprovadas' | 'rejeitadas'>('pendentes');
  const [contribuicoes, setContribuicoes] = useState<Contribuicao[]>([]);

  useEffect(() => {
    setActiveSection(sectionParam);
    if (sectionParam === 'consultas') {
      setActiveTabConsultas(tabParam);
    } else {
      setActiveTabComentarios(tabParam);
    }
  }, [sectionParam, tabParam]);

  // Carregar as contribuições do data.json apenas uma vez
  useEffect(() => {
    setContribuicoes((dadosJson.contribuicoes || []).map((c: any) => ({
      ...c,
      status: c.status || 'pendente'
    })));
  }, []);

  // Funções de aprovação e rejeição
  const handleAprovar = (id: string) => {
    setContribuicoes(prev =>
      prev.map(c => c.id === id ? { ...c, status: 'aprovada' } : c)
    );
  };

  const handleRejeitar = (id: string) => {
    setContribuicoes(prev =>
      prev.map(c => c.id === id ? { ...c, status: 'rejeitada' } : c)
    );
  };

  const countConsultas = {
    pendentes: contribuicoes.filter(c => c.status === 'pendente').length,
    aprovadas: contribuicoes.filter(c => c.status === 'aprovada').length,
    rejeitadas: contribuicoes.filter(c => c.status === 'rejeitada').length,
  };

  const countComentarios = {
    pendentes: contribuicoes.filter(c => c.status === 'pendente').length,
    aprovadas: contribuicoes.filter(c => c.status === 'aprovada').length,
    rejeitadas: contribuicoes.filter(c => c.status === 'rejeitada').length,
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar
        activeSection={activeSection}
        activeTabConsultas={activeTabConsultas}
        activeTabComentarios={activeTabComentarios}
        countConsultas={countConsultas}
        countComentarios={countComentarios}
      />
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'consultas' && (
          <>
            {activeTabConsultas === 'pendentes' && <ModeradorTodas />}
            {activeTabConsultas === 'aprovadas' && <ModeradorAprovadas />}
            {activeTabConsultas === 'rejeitadas' && <ModeradorRejeitadas />}
          </>
        )}
        {activeSection === 'comentarios' && (
          <ListaComentarios
            contribuicoes={contribuicoes.filter(c => c.status === statusMap[activeTabComentarios])}
            tipo={activeTabComentarios}
            onAprovar={handleAprovar}
            onRejeitar={handleRejeitar}
          />
        )}
      </div>
    </div>
  );
}

export default function ModeradorPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Suspense fallback={<div>Carregando...</div>}>
        <ModeradorContent />
      </Suspense>
    </div>
  );
}
