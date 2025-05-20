import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data.json');

export async function POST(request: NextRequest) {
  try {
    // Obter os dados da requisição
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID da consulta não fornecido' }, { status: 400 });
    }
    
    // Ler o arquivo de dados atual
    const fileData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);
    
    // Encontrar a consulta pelo ID
    const consultaIndex = data.consultas.findIndex((c: any) => c.id === id);
    
    if (consultaIndex === -1) {
      return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    }
    
    // Atualizar o status da consulta para "Encerrada"
    data.consultas[consultaIndex].status = 'Encerrada';
    
    // Salvar o arquivo atualizado
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Consulta encerrada com sucesso' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Erro ao encerrar consulta:', error);
    return NextResponse.json({ error: 'Erro ao encerrar consulta' }, { status: 500 });
  }
}
