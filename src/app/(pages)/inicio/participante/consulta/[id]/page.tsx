'use client';

import { useParams } from 'next/navigation';
import Consulta from './componentes/Consulta';
import { consultasMock } from '@/app/(pages)/inicio/componenetes/home/HeroSection';

export default function ConsultaPage() {
  const params = useParams();
  const id = params?.id as string;
  const consulta = consultasMock.find(c => c.id === id);
  return <Consulta consulta={consulta} id={id} />;
}