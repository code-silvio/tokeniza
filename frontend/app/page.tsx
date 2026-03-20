import { Navbar } from "@/components/Navbar";
import { CarbonSection } from "@/components/carbon/CarbonSection";
import { TokensSection } from "@/components/tokenization/TokensSection";
import { GrainsSection } from "@/components/grains/GrainsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Asset Tokenization Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Crédito de Carbono Global · Tokenização On-Chain · Grãos — dados em tempo real com fallback mock
          </p>
        </div>
        <CarbonSection />
        <TokensSection />
        <GrainsSection />
      </main>
    </>
  );
}
