'use client';
import { useState, useEffect } from 'react';

type Consulta = {
  id: string;
  titulo: string;
  descricao: string;
  unidadeResponsavel: string;
  categoria: string;
  periodo: string;
  status: string;
  dataEnvio: string;
  moderacao: string;
  perguntas: string[];
  pgaRelacionado?: string;
  motivoRejeicao?: string;
};

export default function ModeradorRejeitadas() {
  const [consultasRejeitadas, setConsultasRejeitadas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultasRejeitadas();
  }, []);

  const fetchConsultasRejeitadas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consultas');

      if (!response.ok) {
        throw new Error('Falha ao carregar consultas rejeitadas');
      }

      const data = await response.json();

      // Verificar se há uma propriedade para consultas rejeitadas
      // Se não houver, precisamos criar uma lógica para armazenar consultas rejeitadas
      const rejeitadas = data.consultasRejeitadas || [];
      setConsultasRejeitadas(rejeitadas);
    } catch (err) {
      console.error('Erro ao buscar consultas rejeitadas:', err);
      setError('Não foi possível carregar as consultas rejeitadas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full py-4 px-6">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <h1 className="text-2xl font-bold text-[#0c2b7a]">Consultas Rejeitadas</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando consultas rejeitadas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : consultasRejeitadas.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p>Não há consultas rejeitadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {consultasRejeitadas.map((consulta) => (
            <div key={consulta.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="border-l-4 border-red-500 h-full">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-bold text-[#0c2b7a]">{consulta.titulo}</h2>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Rejeitada
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3 text-sm">{consulta.descricao}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600"><span className="font-medium">Unidade:</span> {consulta.unidadeResponsavel}</p>
                      <p className="text-xs text-gray-600"><span className="font-medium">Categoria:</span> {consulta.categoria}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600"><span className="font-medium">Período:</span> {consulta.periodo}</p>
                      {consulta.pgaRelacionado && (
                        <p className="text-xs text-gray-600"><span className="font-medium">PGA:</span> {consulta.pgaRelacionado}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600"><span className="font-medium">Data de Envio:</span> {formatarData(consulta.dataEnvio)}</p>
                    </div>
                  </div>

                  {consulta.motivoRejeicao && (
                    <div className="mb-3 p-3 bg-red-50 rounded-md">
                      <h3 className="font-medium text-red-800 mb-1 text-sm">Motivo da Rejeição:</h3>
                      <p className="text-xs text-red-700">{consulta.motivoRejeicao}</p>
                    </div>
                  )}

                  <div className="mb-3">
                    <h3 className="font-medium text-gray-800 mb-1 text-sm">Perguntas:</h3>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {consulta.perguntas.map((pergunta, index) => (
                        <li key={index} className="text-xs text-gray-700">{pergunta}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
