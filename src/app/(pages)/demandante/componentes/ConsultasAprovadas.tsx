'use client';

import Link from 'next/link';
import type { Consulta } from './MinhasConsultas';

export default function ConsultasAprovadas({ consultas, formatarData }: { 
  consultas: Consulta[];
  formatarData: (dataString: string) => string;
}) {
  if (consultas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <p>Não há consultas aprovadas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {consultas.map((consulta) => (
        <div key={consulta.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="border-t-4 border-green-500"></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[#0c2b7a]">{consulta.titulo}</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Aprovada
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
            
            <div className="mt-4 flex justify-end">
              <Link 
                href={`/consulta/${consulta.id}`}
                className="bg-[#0c2b7a] text-white hover:bg-[#0a2266] font-medium py-2 px-4 rounded transition"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}