import Consulta from './componentes/Consulta';
import { consultasData } from '@/app/types/consulta';

export default function ConsultaPage() {
  return <Consulta consultasData={consultasData} />;
}