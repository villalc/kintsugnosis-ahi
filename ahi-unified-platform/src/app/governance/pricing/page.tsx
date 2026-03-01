import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';

export default function PricingPage() {
  const navItems = [
    { label: 'Home', href: '/', active: false },
    { label: 'Governance', href: '/governance' },
    { label: 'Pricing', href: '/governance/pricing', active: true },
    { label: 'API', href: '/governance/api-docs' },
    { label: 'EU AI Act', href: '/governance/eu-ai-act' },
    { label: 'Symbiosis', href: '/symbiosis' },
    { label: 'Observatory', href: '/symbiosis/observatory' },
  ];

  return (
    <div className="min-h-screen bg-governance-bg text-[#e0e2e5] font-body selection:bg-governance-cyan selection:text-black">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#101525_0%,var(--governance-bg)_80%)]" />

      {/* Navigation */}
      <Navigation
        items={navItems}
        variant="sovereign" // Using sovereign variant as base
        accentColor="cyan"
        logoText="AHI"
      />

      {/* Header */}
      <header className="relative z-10 pt-32 pb-10 text-center border-b border-white/10 bg-governance-bg/80 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 max-w-7xl">
          <Link href="/governance" className="inline-block mb-4 text-governance-cyan hover:text-white transition-colors text-sm font-mono tracking-wider">
            ← VOLVER A GOVERNANCE
          </Link>
          <h1 className="font-grotesk text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            Planes de <span className="text-governance-cyan">Gobernanza.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Modelos deterministas adaptados a la escala de su organización.
          </p>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 max-w-7xl py-16">
        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          {/* Tier 1: Auditoría Ricci */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-12 flex flex-col hover:border-governance-cyan hover:bg-governance-cyan/[0.02] hover:-translate-y-2 transition-all duration-300">
            <div className="font-grotesk text-2xl text-white mb-2">Auditoría Ricci</div>
            <div className="font-grotesk text-5xl font-bold text-white mb-6">
              $2,500 <span className="text-base text-gray-500 font-normal">/ reporte</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                "Análisis de Curvatura en 1 Proceso",
                "Mapeo de Puntos de Alucinación",
                "Validación de Integridad 10D",
                "Reporte de Estabilidad Cognitiva"
              ].map((item, i) => (
                <li key={i} className="text-gray-400 text-sm flex gap-3 items-center">
                  <span className="text-governance-cyan">❖</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="mailto:sales@ahigovernance.com" className="block text-center border border-governance-cyan text-governance-cyan py-4 rounded font-mono text-sm font-bold uppercase tracking-wider hover:bg-governance-cyan/10 transition-colors">
              Solicitar Auditoría
            </a>
          </div>

          {/* Tier 2: Certificación Omega (Featured) */}
          <div className="bg-white/[0.02] border border-governance-cyan rounded-xl p-12 flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_30px_rgba(0,212,255,0.1)]">
            {/* Badge */}
            <div className="absolute top-5 -right-8 bg-governance-cyan text-black text-[10px] font-mono font-bold py-1 px-10 rotate-45 tracking-widest shadow-lg">
              RECOMENDADO
            </div>
            
            <div className="font-grotesk text-2xl text-white mb-2">Certificación Omega</div>
            <div className="font-grotesk text-5xl font-bold text-white mb-6">
              $8,000 <span className="text-base text-gray-500 font-normal">/ certificación</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                "Blindaje de 5 Procesos Críticos",
                "Certificado de Verdad Estructural",
                "Implementación de Escudo Omega",
                "Re-auditoría Trimestral Incluida"
              ].map((item, i) => (
                <li key={i} className="text-gray-400 text-sm flex gap-3 items-center">
                  <span className="text-governance-cyan">❖</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="mailto:sales@ahigovernance.com" className="block text-center bg-governance-cyan text-black py-4 rounded font-mono text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all">
              Obtener Certificación
            </a>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-12 flex flex-col hover:border-governance-cyan hover:bg-governance-cyan/[0.02] hover:-translate-y-2 transition-all duration-300">
            <div className="font-grotesk text-2xl text-white mb-2">Enterprise TaaS</div>
            <div className="font-grotesk text-5xl font-bold text-white mb-6">
              Custom <span className="text-base text-gray-500 font-normal">/ anual</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {[
                "Gobernanza Total del Ecosistema",
                "Inmunidad contra Deepfakes (Sintergic)",
                "SLA de Certeza Estructural 24/7",
                "Compliance EU AI Act Automatizado"
              ].map((item, i) => (
                <li key={i} className="text-gray-400 text-sm flex gap-3 items-center">
                  <span className="text-governance-cyan">❖</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="mailto:enterprise@ahigovernance.com" className="block text-center border border-governance-cyan text-governance-cyan py-4 rounded font-mono text-sm font-bold uppercase tracking-wider hover:bg-governance-cyan/10 transition-colors">
              Contactar Enterprise
            </a>
          </div>

        </div>

        {/* Why TaaS Section */}
        <section className="border border-white/10 bg-governance-cyan/[0.01] rounded-xl p-16 text-center max-w-4xl mx-auto mb-20">
          <h2 className="font-grotesk text-2xl text-white mb-4">¿Por qué Truth as a Service?</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto font-light">
            A diferencia de las consultorías tradicionales basadas en opiniones, AHI Governance utiliza la arquitectura del retículo y la física de la información para eliminar la incertidumbre. No es supervisión, es confinamiento estructural del error.
          </p>
        </section>
      </main>

      <footer className="relative z-10 py-20 border-t border-white/10 bg-[#010102] text-center">
        <div className="container mx-auto px-6">
          <p className="text-gray-500 text-sm mb-8">© 2026 AHI Governance Labs. Un pilar del Ecosistema de Soberanía Simbiótica.</p>
          <div className="flex justify-center gap-8 font-mono text-xs text-[#333] tracking-widest">
            <span>IMPI 20250494546</span>
            <span>CRI_STANDARD v3.0</span>
            <span>DETERMINISM: ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
