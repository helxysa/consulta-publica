import type { Metadata } from "next";
import Navbar from "./componenetes/nav/Nav";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Consulta Publica",
  description: "",
};

export default function InicioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {children}
      </main>
    </>
  );
}
