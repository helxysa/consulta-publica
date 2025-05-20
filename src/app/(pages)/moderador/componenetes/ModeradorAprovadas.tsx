'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  diasRestantes?: number;
};

export default function ModeradorAprovadas() {
  const [consultasAprovadas, setConsultasAprovadas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchConsultasAprovadas();
  }, []);

  const fetchConsultasAprovadas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consultas');

      if (!response.ok) {
        throw new Error('Falha ao carregar consultas aprovadas');
      }

      const data = await response.json();
      // Filtrar apenas as consultas aprovadas
      const aprovadas = data.consultas.filter((consulta: Consulta) => consulta.moderacao === 'aprovada');
      setConsultasAprovadas(aprovadas || []);
    } catch (err) {
      console.error('Erro ao buscar consultas aprovadas:', err);
      setError('Não foi possível carregar as consultas aprovadas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleEncerrarConsulta = async (id: string) => {
    try {
      const response = await fetch('/api/consultas/encerrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Falha ao encerrar consulta');
      }

      const result = await response.json();

      if (result.success) {
        setFeedback({
          type: 'success',
          message: 'Consulta encerrada com sucesso!'
        });

        // Atualizar a lista de consultas aprovadas
        fetchConsultasAprovadas();

        // Limpar a mensagem de feedback após 3 segundos
        setTimeout(() => {
          setFeedback(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Erro ao encerrar consulta:', err);
      setFeedback({
        type: 'error',
        message: 'Erro ao encerrar a consulta. Tente novamente.'
      });

      // Limpar a mensagem de erro após 3 segundos
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-2xl font-bold text-[#0c2b7a]">Consultas Aprovadas</h1>
      </div>

      {/* Feedback message */}
      {feedback && (
        <div className={`mb-4 p-3 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando consultas aprovadas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : consultasAprovadas.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p>Não há consultas aprovadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {consultasAprovadas.map((consulta) => (
            <div key={consulta.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="border-l-4 border-green-500 h-full">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-bold text-[#0c2b7a]">{consulta.titulo}</h2>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      consulta.status === 'Ativa'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {consulta.status}
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
                      {consulta.diasRestantes !== undefined && (
                        <p className="text-xs text-gray-600"><span className="font-medium">Dias Restantes:</span> {consulta.diasRestantes}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-medium text-gray-800 mb-1 text-sm">Perguntas:</h3>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {consulta.perguntas.map((pergunta, index) => (
                        <li key={index} className="text-xs text-gray-700">{pergunta}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    {consulta.status === 'Ativa' && (
                      <button
                        onClick={() => handleEncerrarConsulta(consulta.id)}
                        className="bg-gray-600 text-white hover:bg-gray-700 font-medium py-1.5 px-3 rounded text-sm transition"
                      >
                        Encerrar Consulta
                      </button>
                    )}
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
