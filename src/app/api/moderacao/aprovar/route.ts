import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    
    const dataPath = path.join(process.cwd(), 'src', 'data.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    data.contribuicoes = data.contribuicoes.map((c: any) => 
      c.id === id ? { ...c, status: 'rejeitada' } : c
    );
    
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao rejeitar contribuição:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
} 