'use client';

import { useEffect, useState } from 'react';
import Consulta from './componentes/Consulta';
import consultasData from '@/app/data.json'; // Importar diretamente o data.json

export default function ConsultaPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return <Consulta consultasData={consultasData} />;
}