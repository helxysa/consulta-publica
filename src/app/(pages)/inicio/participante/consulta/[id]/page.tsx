'use client';

import { useEffect, useState } from 'react';
import Consulta from './componentes/Consulta';

export default function ConsultaPage() {
  const [consultasData, setConsultasData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/consultas');
        const data = await response.json();
        setConsultasData(data);
      } catch (error) {
        console.error("Erro ao carregar consultas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!consultasData) return <div className="p-8 text-center">Erro ao carregar dados</div>;

  return <Consulta consultasData={consultasData} />;
}