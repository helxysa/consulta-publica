import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data.json');

export async function POST(request: NextRequest) {
  try {
    // Obter os dados da requisição
    const { id, decisao, motivoRejeicao } = await request.json();

    if (!id || !decisao || (decisao !== 'aprovada' && decisao !== 'rejeitada')) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    // Ler o arquivo de dados atual
    const fileData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);

    // Encontrar a consulta pendente pelo ID
    const consultaIndex = data.consultasPendentes.findIndex((c: any) => c.id === id);

    if (consultaIndex === -1) {
      return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    }

    // Obter a consulta
    const consulta = data.consultasPendentes[consultaIndex];

    // Atualizar o status de moderação
    consulta.moderacao = decisao;

    // Se rejeitada, adicionar o motivo da rejeição
    if (decisao === 'rejeitada' && motivoRejeicao) {
      consulta.motivoRejeicao = motivoRejeicao;
    }

    if (decisao === 'aprovada') {
      // Se aprovada, mover para a lista de consultas ativas
      consulta.status = 'Ativa';

      // Calcular dias restantes com base na data de fim
      if (consulta.dataFim) {
        const hoje = new Date();
        const dataFim = new Date(consulta.dataFim);
        const diffTime = Math.abs(dataFim.getTime() - hoje.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        consulta.diasRestantes = diffDays;
      } else {
        consulta.diasRestantes = 30; // Valor padrão se não houver data de fim
      }

      // Adicionar à lista de consultas ativas
      data.consultas.push(consulta);
    } else if (decisao === 'rejeitada') {
      // Se rejeitada, mover para a lista de consultas rejeitadas
      // Criar a lista se não existir
      if (!data.consultasRejeitadas) {
        data.consultasRejeitadas = [];
      }

      // Adicionar à lista de consultas rejeitadas
      data.consultasRejeitadas.push(consulta);
    }

    // Remover da lista de pendentes
    data.consultasPendentes.splice(consultaIndex, 1);

    // Salvar o arquivo atualizado
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: `Consulta ${decisao === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso`
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar moderação:', error);
    return NextResponse.json({ error: 'Erro ao processar moderação' }, { status: 500 });
  }
}
