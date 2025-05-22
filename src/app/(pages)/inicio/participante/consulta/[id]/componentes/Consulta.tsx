'use client';

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ConsultaType } from '@/app/types/consulta';
import fs from 'fs/promises';
import path from 'path';

// Tipo para as props do componente
type ConsultaProps = {
  consultasData: {
    consultas: ConsultaType[],
    consultasPendentes: ConsultaType[],
    consultasRejeitadas: ConsultaType[],
    usuarios?: Array<{
      nome: string,
      email: string,
      cpfCnpj: string
    }>,
    contribuicoes?: Array<{
      id: string,
      consultaId: string,
      nome: string,
      email: string,
      cpfCnpj: string,
      data: string,
      contribuicao: string,
      respostas: {[key: string]: string}
    }>
  };
};

// Interface para o Toast
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function Consulta({ consultasData }: ConsultaProps) {
  const params = useParams();
  const id = params.id as string;

  console.log('ID da consulta:', id); // Debug
  console.log('Dados disponíveis:', consultasData); // Debug

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [contribuicao, setContribuicao] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [respostas, setRespostas] = useState<{[key: string]: string}>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ message: '', type: 'success', visible: false });
  
  // Dados de contribuições - agora carregados do consultasData
  const [contribuicoes, setContribuicoes] = useState(() => {
    // Inicializar com dados do arquivo, filtrados pela consulta atual
    return (consultasData.contribuicoes || []).filter(contrib => contrib.consultaId === id);
  });

  // Função para mostrar o toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    
    // Esconder o toast após 5 segundos
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Função para salvar dados no arquivo data.json
  const salvarDados = async (dadosAtualizados: any) => {
    try {
      // No ambiente cliente não podemos escrever diretamente no arquivo,
      // então precisamos fazer uma chamada API para um endpoint do servidor
      const response = await fetch('/api/salvar-dados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar os dados');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      throw error;
    }
  };

  // Buscar consulta em todas as categorias
  const consulta = consultasData.consultas.find(c => c.id === id);

  console.log('Consulta encontrada:', consulta); // Debug

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
        data: new Date().toLocaleDateString('pt-BR'),
        contribuicao,
        respostas
      };

      // Atualizar os dados em memória
      const novasContribuicoes = [...contribuicoes, novaContribuicao];
      setContribuicoes(novasContribuicoes);

      // Preparar dados atualizados para salvar
      const dadosAtualizados = {
        ...consultasData,
        contribuicoes: [
          ...(consultasData.contribuicoes || []).filter(c => c.consultaId !== id || c.id !== novaContribuicao.id),
          novaContribuicao
        ]
      };

      // Salvar no arquivo data.json
      await salvarDados(dadosAtualizados);

      // Mostrar toast de sucesso
      showToast('Contribuição enviada com sucesso!', 'success');
      
      // Limpar o formulário
      setContribuicao('');
      setRespostas({});
      
    } catch (error) {
      console.error('Erro ao enviar contribuição:', error);
      showToast('Houve um erro ao enviar sua contribuição. Por favor, tente novamente.', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (nome && email && cpfCnpj) {
        // Verificar se o usuário já existe
        const usuarioExistente = (consultasData.usuarios || []).find(u => 
          u.email === email && u.cpfCnpj === cpfCnpj
        );
        
        if (!usuarioExistente) {
          // Registrar novo usuário
          const novoUsuario = { nome, email, cpfCnpj };
          
          // Preparar dados atualizados para salvar
          const dadosAtualizados = {
            ...consultasData,
            usuarios: [
              ...(consultasData.usuarios || []),
              novoUsuario
            ]
          };
          
          // Salvar no arquivo data.json
          await salvarDados(dadosAtualizados);
        }
        
        setIsLoggedIn(true);
        showToast('Login realizado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      showToast('Houve um erro ao processar seu login. Por favor, tente novamente.', 'error');
    }
  };

  const handleRespostaChange = (pergunta: string, resposta: string) => {
    setRespostas(prev => ({
      ...prev,
      [pergunta]: resposta
    }));
  };

  if (enviado) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 bg-white">
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
    <div className="max-w-screen-2xl mx-auto py-8 px-6 bg-white relative">
      {/* Toast de notificação */}
      {toast.visible && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white transition-opacity duration-300 ease-in-out`}
        >
          {toast.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(prev => ({ ...prev, visible: false }))}
            className="ml-4 text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="mb-6 max-w-6xl mx-auto">
        <Link href="/inicio/participante/consulta" className="text-blue-600 hover:underline flex items-center">
          <span>← Voltar para consultas</span>
        </Link>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden max-w-6xl mx-auto">
        <div className="border-t-4 border-green-500"></div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">{consulta.titulo}</h1>
          <p className="text-gray-600 mb-8">{consulta.descricao}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {!isLoggedIn ? (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Acesso à Participação</h2>
              <p className="mb-4 text-gray-700">Para contribuir com esta consulta pública ou visualizar as contribuições da comunidade, por favor identifique-se abaixo:</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="login-nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="login-nome"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="login-email"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-cpfCnpj" className="block text-sm font-medium text-gray-700 mb-1">
                    CPF ou CNPJ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="login-cpfCnpj"
                    placeholder="000.000.000-00"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#0c2b7a] text-white font-medium py-2 px-6 rounded-md hover:bg-[#0a2468] transition text-base"
                  >
                    Acessar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna da esquerda - Enviar contribuição */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-4">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Enviar Contribuição</h2>
                  </div>
                  <div className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div className="font-medium">{nome}</div>
                      </div>
                      
                      <textarea
                        id="contribuicao"
                        placeholder="O que você pensa sobre esta consulta pública?"
                        value={contribuicao}
                        onChange={(e) => setContribuicao(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      ></textarea>
                      
                      {/* Perguntas específicas da consulta */}
                      {consulta.perguntas && consulta.perguntas.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-md font-medium text-gray-800">Perguntas específicas</h3>
                          {consulta.perguntas.map((pergunta: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                            <div key={index} className="bg-blue-50 p-4 rounded-lg">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {pergunta} <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                placeholder={`Sua resposta...`}
                                value={respostas[String(pergunta)] || ''}
                                onChange={(e) => handleRespostaChange(String(pergunta), e.target.value)}
                                required
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              ></textarea>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div>
                        <button
                          type="submit"
                          className="w-full bg-[#0c2b7a] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#0a2468] transition text-base flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                          Publicar Contribuição
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Coluna da direita - Contribuições da comunidade */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Contribuições da Comunidade</h2>
                    <div className="text-sm text-blue-600">{contribuicoes.length} contribuições</div>
                  </div>
                  
                  {contribuicoes.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {contribuicoes.map((item) => (
                        <div key={item.id} className="p-5 hover:bg-gray-50 transition">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                              {item.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{item.nome}</h3>
                              <p className="text-xs text-gray-500">{item.data}</p>
                            </div>
                          </div>
                          
                          <div className="ml-13 pl-13">
                            <p className="text-gray-700 mb-4 whitespace-pre-line">{item.contribuicao}</p>
                            
                            {Object.keys(item.respostas).length > 0 && (
                              <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Respostas às perguntas:</p>
                                {Object.entries(item.respostas).map(([pergunta, resposta]) => (
                                  <div key={pergunta} className="mb-2 border-l-2 border-blue-300 pl-3">
                                    <p className="text-sm font-medium text-gray-600">{pergunta}</p>
                                    <p className="text-sm text-gray-700">{resposta}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                              <button className="flex items-center hover:text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                Concordo
                              </button>
                              <button className="flex items-center hover:text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                </svg>
                                Ver mais
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">Ainda não há contribuições para esta consulta.</p>
                      <p className="text-sm text-gray-400 mt-1">Seja o primeiro a contribuir!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
