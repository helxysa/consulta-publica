import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data.json');

export async function POST(request: NextRequest) {
  try {
    const { id, decisao, motivoRejeicao } = await request.json();

    if (!id || !decisao || (decisao !== 'aprovada' && decisao !== 'rejeitada')) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    // Ler o arquivo de dados atual
    const fileData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);

    // Encontrar a consulta pelo ID no array principal de consultas
    const consultaIndex = data.consultas.findIndex((c: any) => c.id === id);

    if (consultaIndex === -1) {
      return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    }

    // Obter a consulta
    const consulta = data.consultas[consultaIndex];

    // Atualizar o status de moderação
    consulta.moderacao = decisao;

    // Se rejeitada, adicionar o motivo da rejeição
    if (decisao === 'rejeitada' && motivoRejeicao) {
      consulta.motivoRejeicao = motivoRejeicao;
    }

    if (decisao === 'aprovada') {
      // Se aprovada, atualizar o status
      consulta.status = 'Ativa';

      // Calcular dias restantes
      if (consulta.dataFim) {
        const hoje = new Date();
        const dataFim = new Date(consulta.dataFim);
        const diffTime = Math.abs(dataFim.getTime() - hoje.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        consulta.diasRestantes = diffDays;
      }

      // Atualizar a consulta no array principal
      data.consultas[consultaIndex] = consulta;
    } else if (decisao === 'rejeitada') {
      // Se rejeitada, atualizar o status
      consulta.status = 'Rejeitada';
      
      // Atualizar a consulta no array principal
      data.consultas[consultaIndex] = consulta;
    }

    // Salvar o arquivo atualizado
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: `Consulta ${decisao === 'aprovada' ? 'aprovada' : 'rejeitada'} com sucesso`
    });

  } catch (error) {
    console.error('Erro ao processar moderação:', error);
    return NextResponse.json({ error: 'Erro ao processar moderação' }, { status: 500 });
  }
}
