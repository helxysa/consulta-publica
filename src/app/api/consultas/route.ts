import { NextRequest, NextResponse } from 'next/server';

// Configuração temporária para armazenamento em memória
const consultations = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    const novaConsulta = {
      id: Date.now().toString(),
      ...formData,
      status: 'Pendente de Moderação',
      dataEnvio: new Date().toISOString(),
      moderacao: 'pendente'
    };

    // Armazenar em memória (substituir por banco de dados real posteriormente)
    consultations.set(novaConsulta.id, novaConsulta);

    return NextResponse.json(
      { success: true, consulta: novaConsulta }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao salvar consulta:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a consulta' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    Array.from(consultations.values())
  );
}


