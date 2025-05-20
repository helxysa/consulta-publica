'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ConsultaType } from '@/app/types/consulta';

// Tipo para as props do componente
type ConsultaProps = {
  consultasData: Record<string, ConsultaType>;
};

export default function Consulta({ consultasData }: ConsultaProps) {
  const params = useParams();
  const id = params.id as string;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [contribuicao, setContribuicao] = useState('');
  const [enviado, setEnviado] = useState(false);

  const consulta = consultasData[id as keyof typeof consultasData];

  if (!consulta) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 bg-white">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Consulta não encontrada</h1>
        <p>A consulta que você está procurando não existe ou foi removida.</p>
        <Link href="/inicio" className="inline-block mt-4 bg-[#0c2b7a] text-white font-medium py-3 px-8 rounded-md hover:bg-[#0a2468] transition text-base">
          Voltar para consultas
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui você implementaria a lógica para enviar os dados para o backend
    console.log({
      id,
      nome,
      email,
      cpfCnpj,
      contribuicao
    });

    // Simula o envio bem-sucedido
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 bg-white">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Contribuição enviada com sucesso!</h2>
          <p className="mb-6">Obrigado por participar da consulta pública. Sua contribuição é muito importante para o aprimoramento das políticas públicas.</p>
          <Link href="/inicio/participante/consulta" className="inline-block bg-[#0c2b7a] text-white font-medium py-3 px-8 rounded-md hover:bg-[#0a2468] transition text-base">
            Voltar para consultas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-white">
      <div className="mb-6">
        <Link href="/inicio/participante/consulta" className="text-blue-600 hover:underline flex items-center">
          <span>← Voltar para consultas</span>
        </Link>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-t-4 border-green-500"></div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">{consulta.titulo}</h1>
          <p className="text-gray-600 mb-8">{consulta.descricao}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start">
              <div className="text-gray-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Unidade Responsável</p>
                <p className="text-sm text-gray-700">{consulta.unidadeResponsavel}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-gray-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Categoria</p>
                <p className="text-sm text-gray-700">{consulta.categoria}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-gray-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Período</p>
                <p className="text-sm text-gray-700">{consulta.periodo}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-gray-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-sm text-gray-700">{consulta.status} • {consulta.diasRestantes} dias restantes</p>
              </div>
            </div>
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

          <h2 className="text-xl font-bold mb-6 text-gray-800">Enviar Contribuição</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF ou CNPJ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cpfCnpj"
                  placeholder="000.000.000-00"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="anexos" className="block text-sm font-medium text-gray-700 mb-1">
                  Anexos (opcional)
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                  <button type="button" className="flex items-center justify-center w-full text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Selecionar arquivos
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)</p>
              </div>
            </div>

            <div>
              <label htmlFor="contribuicao" className="block text-sm font-medium text-gray-700 mb-1">
                Sua Contribuição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contribuicao"
                placeholder="Descreva sua contribuição para esta consulta pública..."
                value={contribuicao}
                onChange={(e) => setContribuicao(e.target.value)}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#0c2b7a] text-white font-medium py-3 px-8 rounded-md hover:bg-[#0a2468] transition text-base"
              >
                Enviar Contribuição
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
