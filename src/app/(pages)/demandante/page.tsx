'use client';

import { useState } from 'react';
import SolicitantePage from "./componentes/Solicitante";
import MinhasConsultas from "./componentes/MinhasConsultas";

export default function DemandantePage() {
  const [activeTab, setActiveTab] = useState<'nova' | 'minhas'>('nova');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0c2b7a] mb-6">Área do Demandante</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'nova'
              ? 'text-[#0c2b7a] border-b-2 border-[#0c2b7a]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('nova')}
        >
          Nova Consulta
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'minhas'
              ? 'text-[#0c2b7a] border-b-2 border-[#0c2b7a]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('minhas')}
        >
          Minhas Consultas
        </button>
      </div>
      
      {/* Content */}
      <div>
        {activeTab === 'nova' ? (
          <SolicitantePage />
        ) : (
          <MinhasConsultas />
        )}
      </div>
    </div>
  );
}
