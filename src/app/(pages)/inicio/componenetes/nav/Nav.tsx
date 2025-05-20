import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Image
            src="https://mocha-cdn.com/01969d54-984f-7da1-a509-6a81d2f2f617/image.png_6015.png"
            alt="Ministério Público do Amapá"
            width={85}
            height={62}
            className="mr-3"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl text-gray-800">Consulta MPAP</span>
            <span className="text-xs md:text-sm text-gray-600">Ministério Público do Amapá</span>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          <Link href="/" className="text-gray-700 hover:text-[#0c2b7a] font-medium text-base">
            Início
          </Link>
          <Link href="/inicio" className="text-gray-700 hover:text-[#0c2b7a] font-medium text-base">
            Consultas Públicas
          </Link>
          <Link href="/demandante" className="text-gray-700 hover:text-[#0c2b7a] font-medium text-base">
            Demandante
          </Link>
          <Link href="/moderador" className="text-gray-700 hover:text-[#0c2b7a] font-medium text-base">
            Moderador
          </Link>
          <Link href="/sobre" className="text-gray-700 hover:text-[#0c2b7a] font-medium text-base">
            Sobre
          </Link>
        </div>
      </div>
    </nav>
  );
}
