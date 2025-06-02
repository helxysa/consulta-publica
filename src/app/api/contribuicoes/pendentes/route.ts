import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data.json');
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Filtrar apenas contribuições pendentes
    const contribuicoesPendentes = data.contribuicoes.filter(
      (c: any) => c.status === 'pendente'
    );
    
    return NextResponse.json({ contribuicoes: contribuicoesPendentes });
  } catch (error) {
    console.error('Erro ao ler contribuições pendentes:', error);
    return NextResponse.json(
      { error: 'Erro ao ler as contribuições' },
      { status: 500 }
    );
  }
} 