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
    // Ler o arquivo de dados atual
    const fileData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);
    
    // Obter a nova consulta do corpo da requisição
    const novaConsulta = await request.json();
    
    // Garantir que o ID seja único
    if (!novaConsulta.id) {
      novaConsulta.id = nanoid();
    }
    
    // Adicionar a data de envio
    if (!novaConsulta.dataEnvio) {
      novaConsulta.dataEnvio = new Date().toISOString();
    }
    
    // Definir status e moderação como pendentes
    novaConsulta.status = 'Pendente de Moderação';
    novaConsulta.moderacao = 'pendente';
    
    // Adicionar a nova consulta à lista de consultas pendentes
    data.consultasPendentes.push(novaConsulta);
    
    // Salvar o arquivo atualizado
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, consulta: novaConsulta }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar consulta:', error);
    return NextResponse.json({ error: 'Erro ao salvar consulta' }, { status: 500 });
  }
}


