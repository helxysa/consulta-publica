import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const dataFilePath = path.join(process.cwd(), 'src', 'data.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Erro ao ler arquivo de dados:', error);
    return NextResponse.json({ error: 'Erro ao buscar consultas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Criar objeto de consulta
    const novaConsulta = {
      id: nanoid(),
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      unidadeResponsavel: formData.get('unidadeResponsavel'),
      categoria: formData.get('categoria'),
      dataInicio: formData.get('dataInicio'),
      dataFim: formData.get('dataFim'),
      pgaRelacionado: formData.get('pgaRelacionado'),
      origemSolicitacao: formData.get('origemSolicitacao'),
      perguntas: JSON.parse(formData.get('perguntas') as string),
      documentoReferencia: (formData.get('documento') as File)?.name || null,
      status: 'Pendente de Moderação',
      dataEnvio: new Date().toISOString(),
      moderacao: 'pendente'
    };

    // Ler e atualizar dados
    const data = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
    data.consultasPendentes = data.consultasPendentes || [];
    data.consultasPendentes.push(novaConsulta);
    
    // Salvar arquivo
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, consulta: novaConsulta }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar consulta:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar a consulta' },
      { status: 500 }
    );
  }
}


