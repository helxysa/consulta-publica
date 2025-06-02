'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ConsultaType } from '@/app/types/consulta';
import consultasData from '@/app/data.json'; // Importar diretamente o JSON

// MOCK: Consultas públicas
export const consultasMock = [
  {
    id: '1',
    titulo: 'Plano Municipal de Mobilidade Urbana',
    descricao: 'Participe da construção do novo plano de mobilidade urbana para tornar a cidade mais acessível e sustentável.',
    unidadeResponsavel: 'Secretaria de Mobilidade Urbana',
    categoria: 'Transporte',
    periodo: '01/07/2024 a 31/07/2024',
  },
  {
    id: '2',
    titulo: 'Consulta sobre Coleta Seletiva de Lixo',
    descricao: 'Queremos ouvir a população sobre melhorias e expansão da coleta seletiva em todos os bairros.',
    unidadeResponsavel: 'Secretaria de Meio Ambiente',
    categoria: 'Meio Ambiente',
    periodo: '10/07/2024 a 10/08/2024',
  },
  {
    id: '3',
    titulo: 'Revisão do Plano Diretor Urbano',
    descricao: 'Dê sua opinião sobre o futuro do desenvolvimento urbano e zoneamento da cidade.',
    unidadeResponsavel: 'Departamento de Planejamento Urbano',
    categoria: 'Urbanismo',
    periodo: '15/06/2024 a 15/07/2024',
  },
  {
    id: '4',
    titulo: 'Consulta Pública sobre Saúde Mental nas Escolas',
    descricao: 'Ajude a definir políticas de apoio psicológico e prevenção nas escolas municipais.',
    unidadeResponsavel: 'Secretaria de Educação',
    categoria: 'Saúde',
    periodo: '20/06/2024 a 20/07/2024',
  },
  {
    id: '5',
    titulo: 'Participação Social no Orçamento 2025',
    descricao: 'Contribua com sugestões para a elaboração do orçamento municipal do próximo ano.',
    unidadeResponsavel: 'Secretaria de Finanças',
    categoria: 'Finanças Públicas',
    periodo: '01/08/2024 a 31/08/2024',
  },
];

export default function Home() {
  const [consultas, setConsultas] = useState<Record<string, ConsultaType>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      // Converter o array de consultas para o formato desejado
      const consultasObj: Record<string, ConsultaType> = {};
      
      if (consultasData && consultasData.consultas) {
        consultasData.consultas.forEach((consulta: ConsultaType) => {
          if (consulta.id) {
            consultasObj[consulta.id] = consulta;
          }
        });
      }
      
      console.log('Dados carregados:', consultasObj);
      setConsultas(consultasObj);
    } catch (err) {
      console.error('Erro ao carregar consultas:', err);
      setError('Não foi possível carregar as consultas.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen font-poppins">
      {/* Hero Section */}
      <section className="bg-[#0c2b7a] text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto">
          Plataforma de Consulta Pública do Ministério Público do Amapá
        </h1>
        <p className="mb-8 max-w-2xl mx-auto">
          Contribua para o fortalecimento da democracia participativa e
          ajude a construir políticas públicas mais eficientes
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Link href="/inicio/participante/consulta" className="bg-white text-[#0c2b7a] font-medium py-2 px-6 rounded hover:bg-gray-100 transition">
            Participar das Consultas
          </Link>
          <Link href="/sobre" className="bg-transparent border border-white text-white font-medium py-2 px-6 rounded hover:bg-white/10 transition">
            Saiba Mais
          </Link>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-bold text-center mb-10 text-[#0c2b7a]">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-[#f0f2f5] p-6 rounded-lg text-center">
            <div className="bg-[#dde1e7] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2 text-[#0c2b7a]">Consultas Públicas</h3>
            <p className="text-sm text-gray-700">
              Acesse as consultas públicas abertas pelo Ministério Público do Amapá.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f0f2f5] p-6 rounded-lg text-center">
            <div className="bg-[#dde1e7] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2 text-[#0c2b7a]">Participação Social</h3>
            <p className="text-sm text-gray-700">
              Envie suas contribuições para os temas de interesse público em discussão.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f0f2f5] p-6 rounded-lg text-center">
            <div className="bg-[#dde1e7] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2 text-[#0c2b7a]">Transparência</h3>
            <p className="text-sm text-gray-700">
              Acompanhe os resultados e as decisões tomadas a partir das consultas realizadas.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#f0f2f5] p-6 rounded-lg text-center">
            <div className="bg-[#dde1e7] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0c2b7a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2 text-[#0c2b7a]">Eficiência</h3>
            <p className="text-sm text-gray-700">
              Contribua para a eficiência das ações do Ministério Público em favor da sociedade.
            </p>
          </div>
        </div>
      </section>

      {/* Consultas Recentes Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#0c2b7a]">Consultas Recentes</h2>
            <Link href="/inicio/participante/consulta" className="text-[#0c2b7a] hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consultasMock.map((consulta) => (
              <div key={consulta.id} className="bg-[#f0f2f5] rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-[#0c2b7a]">{consulta.titulo}</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {consulta.descricao.length > 100
                      ? `${consulta.descricao.substring(0, 100)}...`
                      : consulta.descricao}
                  </p>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Unidade:</span> {consulta.unidadeResponsavel}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Categoria:</span> {consulta.categoria}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Período:</span> {consulta.periodo}
                  </div>
                  <Link href={`/inicio/participante/consulta/${consulta.id}`} className="text-[#0c2b7a] font-medium hover:underline">
                    Participar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#0c2b7a] text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Sua participação é fundamental</h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Junte-se a outros cidadãos engajados na construção de um Ministério Público mais transparente e eficiente
        </p>
        <Link href="/inicio/participante/consulta" className="inline-block bg-white text-[#0c2b7a] font-medium py-2 px-6 rounded hover:bg-gray-100 transition">
          Participar Agora
        </Link>
      </section>
    </main>
  );
}