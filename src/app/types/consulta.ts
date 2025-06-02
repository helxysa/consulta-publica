import { ReactNode } from 'react';

// Tipo para as consultas
export interface ConsultaType {
  periodo: ReactNode;
  diasRestantes: ReactNode;
  id?: string;
  titulo: string;
  descricao: string;
  unidadeResponsavel: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
  pgaRelacionado?: string;
  origemSolicitacao: string;
  perguntas: string[];
  documentoReferencia?: string | null;
  status: string;
  dataEnvio: string;
  moderacao: string;
}

// Adicionar este tipo
export type ContribuicaoStatus = 'pendente' | 'aprovada' | 'rejeitada';

export type Contribuicao = {
  id: string;
  consultaId: string;
  nome: string;
  email: string;
  cpfCnpj: string;
  data: string;
  contribuicao: string;
  respostas: {
    [key: string]: string;
  };
  status: 'pendente' | 'aprovada' | 'rejeitada';
};


