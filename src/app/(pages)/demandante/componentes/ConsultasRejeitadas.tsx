'use client';

import Link from 'next/link';
import type { Consulta } from './MinhasConsultas';

export default function ConsultasRejeitadas({ consultas, formatarData }: { 
  consultas: Consulta[];
  formatarData: (dataString: string) => string;
}) {
  if (consultas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <p>Não há consultas rejeitadas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {consultas.map((consulta) => (
        <div key={consulta.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="border-t-4 border-red-500"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[#0c2b7a]">{consulta.titulo}</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Rejeitada
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{consulta.descricao}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600"><span className="font-medium">Unidade Responsável:</span> {consulta.unidadeResponsavel}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Categoria:</span> {consulta.categoria}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Período:</span> {consulta.periodo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600"><span className="font-medium">Data de Envio:</span> {formatarData(consulta.dataEnvio)}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Status:</span> {consulta.status}</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-800">
                <span className="font-medium">Feedback da moderação:</span> {consulta.motivoRejeicao || 'Esta consulta foi rejeitada. Você pode criar uma nova consulta corrigindo os problemas identificados.'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}