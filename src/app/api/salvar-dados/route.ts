import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Consulta {
  id: string;
  titulo: FormDataEntryValue | null;
  descricao: FormDataEntryValue | null;
  unidadeResponsavel: FormDataEntryValue | null;
  categoria: FormDataEntryValue | null;
  dataInicio: FormDataEntryValue | null;
  dataFim: FormDataEntryValue | null;
  pgaRelacionado: FormDataEntryValue | null;
  origemSolicitacao: FormDataEntryValue | null;
  perguntas: any[];
  status: string;
  moderacao: string;
  dataEnvio: string;
  documentoReferencia: null;
}

interface Contribuicao {
  id: string;
  consultaId: string;
  nome: string;
  email: string;
  cpfCnpj: string;
  data: string;
  contribuicao: string;
  respostas: { [key: string]: string };
}

interface DataStructure {
  consultas: any[];
  contribuicoes: Contribuicao[];
  usuarios: any[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const dataFilePath = path.join(process.cwd(), 'src', 'data.json');
    let existingData: DataStructure = { 
      consultas: [],
      contribuicoes: [],
      usuarios: []
    };
    
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.log('Criando novo arquivo de dados');
    }

    // Mesclar dados
    const updatedData = {
      consultas: body.consultas || existingData.consultas,
      contribuicoes: body.contribuicoes || existingData.contribuicoes,
      usuarios: body.usuarios || existingData.usuarios
    };

    await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ success: true, message: 'Dados salvos com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar os dados' },
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