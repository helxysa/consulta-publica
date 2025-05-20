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

export default function ModeradorPendentes() {
  const [consultasPendentes, setConsultasPendentes] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [rejeicaoModal, setRejeicaoModal] = useState<{ isOpen: boolean, consultaId: string | null, motivo: string }>({
    isOpen: false,
    consultaId: null,
    motivo: ''
  });

  useEffect(() => {
    fetchConsultasPendentes();
  }, []);

  const fetchConsultasPendentes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consultas');

      if (!response.ok) {
        throw new Error('Falha ao carregar consultas pendentes');
      }

      const data = await response.json();
      setConsultasPendentes(data.consultasPendentes || []);
    } catch (err) {
      console.error('Erro ao buscar consultas pendentes:', err);
      setError('Não foi possível carregar as consultas pendentes. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: string) => {
    await handleModeracao(id, 'aprovada');
  };

  const openRejeicaoModal = (id: string) => {
    setRejeicaoModal({
      isOpen: true,
      consultaId: id,
      motivo: ''
    });
  };

  const closeRejeicaoModal = () => {
    setRejeicaoModal({
      isOpen: false,
      consultaId: null,
      motivo: ''
    });
  };

  const handleRejeicaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejeicaoModal(prev => ({
      ...prev,
      motivo: e.target.value
    }));
  };

  const handleRejeicaoSubmit = async () => {
    if (!rejeicaoModal.consultaId || !rejeicaoModal.motivo.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor, informe o motivo da rejeição.'
      });
      return;
    }

    await handleModeracao(rejeicaoModal.consultaId, 'rejeitada', rejeicaoModal.motivo);
    closeRejeicaoModal();
  };

  const handleModeracao = async (id: string, decisao: 'aprovada' | 'rejeitada', motivoRejeicao?: string) => {
    try {
      const payload = { id, decisao };

      if (decisao === 'rejeitada' && motivoRejeicao) {
        Object.assign(payload, { motivoRejeicao });
      }

      const response = await fetch('/api/consultas/moderacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar moderação');
      }

      const result = await response.json();

      if (result.success) {
        setFeedback({
          type: 'success',
          message: `Consulta ${decisao === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso!`
        });

        // Atualizar a lista de consultas pendentes
        fetchConsultasPendentes();

        // Limpar a mensagem de feedback após 3 segundos
        setTimeout(() => {
          setFeedback(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Erro ao processar moderação:', err);
      setFeedback({
        type: 'error',
        message: 'Erro ao processar a moderação. Tente novamente.'
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-[#0c2b7a]">Consultas Pendentes</h1>
      </div>

      {/* Feedback message */}
      {feedback && (
        <div className={`mb-4 p-3 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando consultas pendentes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : consultasPendentes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p>Não há consultas pendentes de moderação.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {consultasPendentes.map((consulta) => (
            <div key={consulta.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="border-l-4 border-yellow-500 h-full">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-bold text-[#0c2b7a]">{consulta.titulo}</h2>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Pendente
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

                  <div className="mb-3">
                    <h3 className="font-medium text-gray-800 mb-1 text-sm">Perguntas:</h3>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {consulta.perguntas.map((pergunta, index) => (
                        <li key={index} className="text-xs text-gray-700">{pergunta}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => openRejeicaoModal(consulta.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 font-medium py-1.5 px-3 rounded text-sm transition"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleAprovar(consulta.id)}
                      className="bg-green-600 text-white hover:bg-green-700 font-medium py-1.5 px-3 rounded text-sm transition"
                    >
                      Aprovar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Rejeição */}
      {rejeicaoModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Motivo da Rejeição</h3>
            <p className="text-sm text-gray-600 mb-4">
              Por favor, informe o motivo pelo qual esta consulta está sendo rejeitada.
              Este feedback será enviado ao demandante.
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-32"
              placeholder="Descreva o motivo da rejeição..."
              value={rejeicaoModal.motivo}
              onChange={handleRejeicaoChange}
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRejeicaoModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleRejeicaoSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

