import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const consulta = {
      id: Date.now().toString(),
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      unidadeResponsavel: formData.get('unidadeResponsavel'),
      categoria: formData.get('categoria'),
      dataInicio: formData.get('dataInicio'),
      dataFim: formData.get('dataFim'),
      pgaRelacionado: formData.get('pgaRelacionado'),
      origemSolicitacao: formData.get('origemSolicitacao'),
      perguntas: JSON.parse(formData.get('perguntas') as string),
      status: 'Pendente de Moderação',
      moderacao: 'pendente',
      dataEnvio: new Date().toISOString(),
      documentoReferencia: null
    };

    // Read existing data
    const dataFilePath = path.join(process.cwd(), 'src', 'data.json');
    let existingData = { consultas: [] };
    
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist, we'll create it
      console.log('Creating new data file');
    }

    // Add new consulta
    existingData.consultas = existingData.consultas || [];
    existingData.consultas.push(consulta as never);

    // Save back to file
    await fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ success: true, message: 'Consulta criada com sucesso' });
  } catch (error) {
    console.error('Error saving consulta:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar a consulta' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data.json');
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading consultas:', error);
    return NextResponse.json(
      { error: 'Erro ao ler as consultas' },
      { status: 500 }
    );
  }
}