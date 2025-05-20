// Tipo para as consultas
export type ConsultaType = {
  moderacao: string;
  id: string;
  titulo: string;
  descricao: string;
  unidadeResponsavel: string;
  categoria: string;
  periodo: string;
  status: string;
  diasRestantes: number;
  documentoReferencia: string;
};

// Dados simulados das consultas
export const consultasData: Record<string, ConsultaType> = {
  '1': {
    id: '1',
    titulo: 'Política de Atendimento às Vítimas de Violência Doméstica',
    descricao: 'Consulta pública para colher sugestões sobre a nova política de atendimento às vítimas de violência doméstica no estado do Amapá.',
    unidadeResponsavel: 'Promotoria de Justiça de Defesa da Mulher',
    categoria: 'Proteção de Direitos',
    periodo: '31/01/2025 - 31/05/2025',
    status: 'Ativa',
    diasRestantes: 12,
    documentoReferencia: 'documento-referencia-violencia-domestica.pdf'
  },
  '2': {
    id: '2',
    titulo: 'Diretrizes para Correições Ordinárias',
    descricao: 'Consulta para receber contribuições da sociedade civil sobre as diretrizes que nortearão as correições ordinárias realizadas pela Corregedoria-Geral do Ministério Público.',
    unidadeResponsavel: 'Corregedoria-Geral',
    categoria: 'Transparência Institucional',
    periodo: '15/02/2025 - 15/04/2025',
    status: 'Ativa',
    diasRestantes: 45,
    documentoReferencia: 'documento-referencia-correicoes.pdf'
  },
  '3': {
    id: '3',
    titulo: 'Proteção de Dados Pessoais em Serviços Públicos',
    descricao: 'Consulta sobre as práticas de proteção de dados pessoais nos serviços públicos do estado do Amapá, visando adequação à LGPD.',
    unidadeResponsavel: 'Encarregado de Dados',
    categoria: 'Proteção de Dados',
    periodo: '01/03/2025 - 30/04/2025',
    status: 'Ativa',
    diasRestantes: 60,
    documentoReferencia: 'documento-referencia-lgpd.pdf'
  }
};
