'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export default function SolicitantePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    unidadeResponsavel: '',
    categoria: '',
    dataInicio: '',
    dataFim: '',
    documentoReferencia: null as File | null,
    pgaRelacionado: '',
    origemSolicitacao: ''
  });
  
  const [pergunta, setPergunta] = useState('');
  const [perguntas, setPerguntas] = useState<string[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Remover o estado pgaOptions que não será mais necessário

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        documentoReferencia: e.target.files![0]
      }));
    }
  };

  const adicionarPergunta = () => {
    if (pergunta.trim()) {
      setPerguntas([...perguntas, pergunta]);
      setPergunta('');
    }
  };

  const removerPergunta = (index: number) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas.splice(index, 1);
    setPerguntas(novasPerguntas);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) newErrors.titulo = "O título é obrigatório";
    if (!formData.descricao.trim()) newErrors.descricao = "A descrição é obrigatória";
    if (!formData.unidadeResponsavel.trim()) newErrors.unidadeResponsavel = "A unidade responsável é obrigatória";
    if (!formData.categoria.trim()) newErrors.categoria = "A categoria é obrigatória";
    if (!formData.dataInicio) newErrors.dataInicio = "A data de início é obrigatória";
    if (!formData.dataFim) newErrors.dataFim = "A data de fim é obrigatória";
    if (perguntas.length === 0) newErrors.perguntas = "Adicione pelo menos uma pergunta";
    if (!formData.origemSolicitacao.trim()) newErrors.origemSolicitacao = "A origem da solicitação é obrigatória";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  };

  const enviarConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Formatar as datas para exibição
      const dataInicioFormatada = formatarData(formData.dataInicio);
      const dataFimFormatada = formatarData(formData.dataFim);
      const periodo = `${dataInicioFormatada} - ${dataFimFormatada}`;
      
      // Preparar o objeto da consulta
      const novaConsulta = {
        id: Date.now().toString(), // Gerar ID único baseado no timestamp
        titulo: formData.titulo,
        descricao: formData.descricao,
        unidadeResponsavel: formData.unidadeResponsavel,
        categoria: formData.categoria,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        periodo,
        status: 'Pendente de Moderação',
        documentoReferencia: formData.documentoReferencia ? formData.documentoReferencia.name : null,
        perguntas,
        pgaRelacionado: formData.pgaRelacionado,
        origemSolicitacao: formData.origemSolicitacao,
        dataEnvio: new Date().toISOString(),
        moderacao: 'pendente'
      };
      
      // Enviar para a API
      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConsulta)
      });
      
      if (response.ok) {
        setEnviado(true);
      } else {
        throw new Error('Falha ao enviar consulta');
      }
    } catch (error) {
      console.error('Erro ao enviar consulta:', error);
      alert('Ocorreu um erro ao enviar a consulta. Por favor, tente novamente.');
    }
  };

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Consulta enviada com sucesso!</h2>
        <p className="text-green-700 mb-6">Sua solicitação de consulta pública foi enviada para moderação e será publicada após aprovação.</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => {
              setEnviado(false);
              setFormData({
                titulo: '',
                descricao: '',
                unidadeResponsavel: '',
                categoria: '',
                dataInicio: '',
                dataFim: '',
                documentoReferencia: null,
                pgaRelacionado: '',
                origemSolicitacao: ''
              });
              setPerguntas([]);
            }} 
            className="bg-[#0c2b7a] text-white px-6 py-2 rounded-md hover:bg-[#0a2266] transition-colors"
          >
            Criar nova consulta
          </button>
          <Link 
            href="/inicio/demandante/consultas"
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Ver minhas consultas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0c2b7a] mb-4">Criar Nova Consulta Pública</h2>
        <p className="text-gray-600 mb-6">Preencha os campos abaixo para solicitar a criação de uma nova consulta pública. Após o envio, sua solicitação será analisada pela equipe de moderação.</p>

        <form onSubmit={enviarConsulta} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título da Consulta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.titulo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]`}
              placeholder="Ex: Política de Atendimento às Vítimas de Violência Doméstica"
            />
            {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border ${errors.descricao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]`}
              placeholder="Descreva o objetivo e a importância desta consulta pública..."
            ></textarea>
            {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="unidadeResponsavel" className="block text-sm font-medium text-gray-700 mb-1">
                Unidade Responsável <span className="text-red-500">*</span>
              </label>
              <select
                id="unidadeResponsavel"
                name="unidadeResponsavel"
                value={formData.unidadeResponsavel}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.unidadeResponsavel ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]`}
              >
                <option value="">Selecione a unidade responsável</option>
                <option value="Promotoria de Justiça de Defesa da Mulher">Promotoria de Justiça de Defesa da Mulher</option>
                <option value="Promotoria de Justiça de Meio Ambiente">Promotoria de Justiça de Meio Ambiente</option>
                <option value="Promotoria de Justiça de Defesa do Consumidor">Promotoria de Justiça de Defesa do Consumidor</option>
                <option value="Promotoria de Justiça de Defesa da Saúde">Promotoria de Justiça de Defesa da Saúde</option>
                <option value="Promotoria de Justiça de Defesa da Educação">Promotoria de Justiça de Defesa da Educação</option>
                <option value="Corregedoria-Geral">Corregedoria-Geral</option>
                <option value="Encarregado de Dados">Encarregado de Dados</option>
              </select>
              {errors.unidadeResponsavel && <p className="text-red-500 text-xs mt-1">{errors.unidadeResponsavel}</p>}
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.categoria ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]`}
              >
                <option value="">Selecione a categoria</option>
                <option value="Proteção de Direitos">Proteção de Direitos</option>
                <option value="Meio Ambiente">Meio Ambiente</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Transparência Institucional">Transparência Institucional</option>
                <option value="Proteção de Dados">Proteção de Dados</option>
                <option value="Direitos do Consumidor">Direitos do Consumidor</option>
              </select>
              {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.dataInicio ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]`}
              />
              {errors.dataInicio && <p className="text-red-500 text-xs mt-1">{errors.dataInicio}</p>}
            </div>

            <div>
              <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Término <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                value={formData.dataFim}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.dataFim ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]`}
              />
              {errors.dataFim && <p className="text-red-500 text-xs mt-1">{errors.dataFim}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pgaRelacionado" className="block text-sm font-medium text-gray-700 mb-1">
                PGA Relacionado
              </label>
              <input
                type="text"
                id="pgaRelacionado"
                name="pgaRelacionado"
                value={formData.pgaRelacionado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]"
                placeholder="Ex: PGA 2025 - Combate à Violência Doméstica"
              />
            </div>

            <div>
              <label htmlFor="origemSolicitacao" className="block text-sm font-medium text-gray-700 mb-1">
                Origem da Solicitação <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="origemSolicitacao"
                name="origemSolicitacao"
                value={formData.origemSolicitacao}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.origemSolicitacao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]`}
                placeholder="Ex: Gabinete do Procurador-Geral, Ofício nº 123/2025"
              />
              {errors.origemSolicitacao && <p className="text-red-500 text-xs mt-1">{errors.origemSolicitacao}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="documentoReferencia" className="block text-sm font-medium text-gray-700 mb-1">
              Documento de Referência
            </label>
            <input
              type="file"
              id="documentoReferencia"
              name="documentoReferencia"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-xs text-gray-500 mt-1">Formatos aceitos: PDF, DOC, DOCX (máx. 10MB)</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Perguntas da Consulta</h3>
            <p className="text-sm text-gray-600 mb-4">Adicione as perguntas que serão apresentadas aos participantes da consulta pública.</p>
            
            <div className="mb-4">
              <label htmlFor="pergunta" className="block text-sm font-medium text-gray-700 mb-1">
                Adicionar Pergunta <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="pergunta"
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#0c2b7a]"
                  placeholder="Digite uma pergunta para a consulta pública..."
                />
                <button
                  type="button"
                  onClick={adicionarPergunta}
                  className="bg-[#0c2b7a] text-white px-4 py-2 rounded-r-md hover:bg-[#0a2266] transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {perguntas.length > 0 ? (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Perguntas Adicionadas</h4>
                <ul className="bg-gray-50 rounded-md border border-gray-200 divide-y divide-gray-200">
                  {perguntas.map((p, index) => (
                    <li key={index} className="p-3 flex justify-between items-center">
                      <span>{p}</span>
                      <button
                        type="button"
                        onClick={() => removerPergunta(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              errors.perguntas && <p className="text-red-500 text-xs mb-4">{errors.perguntas}</p>
            )}
          </div>

          <div className="flex items-start mb-6">
            <input
              type="checkbox"
              id="termos"
              name="termos"
              required
              className="mt-1 mr-2"
            />
            <label htmlFor="termos" className="text-sm text-gray-700">
              Confirmo que esta consulta pública está de acordo com os termos de uso e política de privacidade da plataforma
            </label>
          </div>

          <div className="flex justify-end">
            <Link 
              href="/inicio"
              className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white bg-[#0c2b7a] hover:bg-[#0a2266] transition-colors"
            >
              Enviar para Moderação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
