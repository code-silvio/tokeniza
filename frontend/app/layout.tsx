import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Tokenization Dashboard",
  description: "Crédito de Carbono Global · Tokenização On-Chain · Grãos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-screen bg-[#0a0f1e] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
