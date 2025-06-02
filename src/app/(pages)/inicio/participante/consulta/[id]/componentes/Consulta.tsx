'use client';

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ConsultaType, ContribuicaoStatus } from '@/app/types/consulta';
import fs from 'fs/promises';
import path from 'path';

// Tipo para as props do componente
type ConsultaProps = {
  consulta: {
    id: string;
    titulo: string;
    descricao: string;
    unidadeResponsavel: string;
    categoria: string;
    periodo: string;
  } | undefined;
  id: string;
};

// Interface para o Toast
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

// MOCK: perguntas relacionadas à consulta pública
const perguntasConsulta = [
  "O que você acha desta proposta?",
  "Como podemos melhorar?",
  "Você tem sugestões adicionais?"
];

// MOCK: respostas agrupadas por pergunta
type RespostaPorPergunta = {
  [key: string]: { id: string; nome: string; resposta: string }[];
};
const respostasMock: RespostaPorPergunta = {
  "O que você acha desta proposta?": [
    { id: "1", nome: "Maria Silva", resposta: "É uma boa iniciativa." },
    { id: "2", nome: "João Souza", resposta: "Tenho dúvidas." }
  ],
  "Como podemos melhorar?": [
    { id: "1", nome: "Maria Silva", resposta: "Mais divulgação." }
  ],
  "Você tem sugestões adicionais?": [
    { id: "2", nome: "João Souza", resposta: "Fazer reuniões abertas." }
  ]
};

// MOCK: contribuições da comunidade
const contribuicoesMock = [
  {
    id: "1",
    nome: "Maria Silva",
    data: "2024-06-01T10:00:00Z",
    status: "aprovada",
    contribuicao: "Achei a proposta interessante.",
    respostas: {
      "O que você acha desta proposta?": "É uma boa iniciativa.",
      "Como podemos melhorar?": "Mais divulgação.",
      "Você tem sugestões adicionais?": ""
    }
  },
  {
    id: "2",
    nome: "João Souza",
    data: "2024-06-02T14:30:00Z",
    status: "aprovada",
    contribuicao: "Tenho algumas dúvidas.",
    respostas: {
      "O que você acha desta proposta?": "",
      "Como podemos melhorar?": "",
      "Você tem sugestões adicionais?": "Fazer reuniões abertas."
    }
  }
];

export default function Consulta({ consulta, id }: ConsultaProps) {
  console.log('ID da consulta:', id); // Debug
  console.log('Consulta recebida:', consulta); // Debug

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [contribuicao, setContribuicao] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [respostas, setRespostas] = useState<{[key: string]: string}>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ message: '', type: 'success', visible: false });
  const [editing, setEditing] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [novaResposta, setNovaResposta] = useState('');
  const [respostasPorPergunta, setRespostasPorPergunta] = useState<RespostaPorPergunta>(respostasMock);
  
  // Não há mais contribuições reais, só mockadas ou vazias
  const [contribuicoes, setContribuicoes] = useState<any[]>([]);

  if (!consulta) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 bg-white">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Consulta não encontrada</h1>
        <p>A consulta que você está procurando não existe ou foi removida.</p>
        <Link 
          href="/inicio/participante/consulta" 
          className="inline-block mt-4 bg-[#0c2b7a] text-white font-medium py-3 px-8 rounded-md hover:bg-[#0a2468] transition text-base"
        >
          Voltar para consultas
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const novaContribuicao = {
        id: `${Date.now()}`,
        consultaId: id,
        nome,
        email,
        cpfCnpj,
        data: new Date().toISOString(),
        contribuicao,
        respostas,
        status: 'pendente' as ContribuicaoStatus
      };

      // Atualizar os dados em memória
      const novasContribuicoes = [...contribuicoes, novaContribuicao];
      setContribuicoes(novasContribuicoes);

      // Redirecionar para a página de contribuições pendentes
      window.location.href = '/inicio/participante/consulta/pendentes';
      
    } catch (error) {
      console.error('Erro ao enviar contribuição:', error);
    }
  };

  const handleRespostaChange = (pergunta: string, resposta: string) => {
    setRespostas(prev => ({
      ...prev,
      [pergunta]: resposta
    }));
  };

  function adicionarResposta(pergunta: string) {
    if (!novoNome.trim() || !novaResposta.trim()) return;
    setRespostasPorPergunta(prev => ({
      ...prev,
      [pergunta]: [
        ...(prev[pergunta] || []),
        { nome: novoNome, resposta: novaResposta, id: Date.now().toString() }
      ]
    }));
    setNovoNome('');
    setNovaResposta('');
    setEditing(null);
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-8 bg-white relative">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-900">{consulta.titulo}</h1>
      <p className="mb-6 text-lg text-gray-700">{consulta.descricao}</p>
      <div className="mb-8 flex flex-wrap gap-6 text-sm text-gray-700">
        <div><span className="font-semibold">Unidade Responsável:</span> {consulta.unidadeResponsavel}</div>
        <div><span className="font-semibold">Categoria:</span> {consulta.categoria}</div>
        <div><span className="font-semibold">Período:</span> {consulta.periodo}</div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="flex items-start">
          <div className="text-gray-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Documento de Referência</p>
            <p className="text-xs text-gray-500 mb-2">Acesse o documento completo para obter mais informações sobre esta consulta pública.</p>
            <button className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition">
              Baixar Documento
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 text-blue-900">Perguntas da Consulta Pública</h2>
      <div className="divide-y divide-gray-200">
        {perguntasConsulta.map((pergunta, idx) => (
          <section key={pergunta} className="py-8">
            <div className="border-l-4 border-blue-800 pl-4 mb-6">
              <div className="text-sm font-medium text-blue-800 mb-1">Pergunta {idx + 1}</div>
              <div className="text-lg font-semibold text-gray-900">{pergunta}</div>
            </div>
            <div className="space-y-4 ml-4 sm:ml-16">
              {respostasPorPergunta[pergunta] && respostasPorPergunta[pergunta].length > 0 ? (
                respostasPorPergunta[pergunta].map((respostaObj: { nome: string; resposta: string; id: string }) => (
                  <div key={respostaObj.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium text-sm mt-1">
                      {respostaObj.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-700 text-sm">{respostaObj.nome}</div>
                      <div className="bg-gray-50 rounded px-4 py-2 mt-1 text-gray-900 text-base border border-gray-200 max-w-2xl break-words">
                        {respostaObj.resposta}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="italic text-gray-400 mb-4">Nenhuma resposta ainda.</div>
              )}
            </div>
            {editing === pergunta ? (
              <form className="mt-6 flex flex-col gap-2 ml-4 sm:ml-16" onSubmit={e => { e.preventDefault(); adicionarResposta(pergunta); }}>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <textarea
                  placeholder="Sua resposta"
                  value={novaResposta}
                  onChange={e => setNovaResposta(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  rows={3}
                />
                <div className="flex gap-2 mt-1">
                  <button type="submit" className="text-white bg-blue-800 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-900">Enviar</button>
                  <button type="button" className="text-gray-600 px-4 py-1.5 rounded text-sm hover:bg-gray-100 font-medium" onClick={() => setEditing(null)}>Cancelar</button>
                </div>
              </form>
            ) : (
              <button
                className="mt-4 ml-4 sm:ml-16 text-blue-800 hover:text-blue-900 text-sm font-medium"
                onClick={() => setEditing(pergunta)}
              >
                Responder
              </button>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
