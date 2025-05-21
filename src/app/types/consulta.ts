// Tipo para as consultas
export type ConsultaType = {
  dataEnvio: string | number | Date;
  perguntas: any;
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


