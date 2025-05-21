import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Caminho para o arquivo data.json
    const filePath = path.join(process.cwd(), 'src', 'data.json');
    
    // Escrever os dados atualizados no arquivo
    await fs.writeFile(filePath, JSON.stringify(body, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return NextResponse.json(
      { error: 'Falha ao salvar os dados' },
      { status: 500 }
    );
  }
} 