import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import TruthTerminal from '@/components/dashboard/TruthTerminal';

function StatusBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-10">
      <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
      <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400 uppercase font-bold">System Status: Omega_Active</span>
    </div>
  );
}

function ServiceCard({ metric, title, description }: { metric: string, title: string, description: string }) {
  return (
    <div className="glass-card flex flex-col items-start text-left">
      <div className="font-mono text-[9px] text-[var(--accent)] border border-[var(--accent)]/30 px-2 py-1 mb-8 uppercase tracking-[0.2em] font-bold">
        {metric}
      </div>
      <h3 className="text-xl font-display text-white mb-6 uppercase leading-tight tracking-tighter">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 font-light">{description}</p>
      <div className="w-full h-px bg-white/5" />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  if (host.includes('sovereignsymbiosis')) {
    redirect('/symbiosis');
  }

  return (
    <div className="min-h-screen">
      <div className="grid-bg" />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24 text-center container mx-auto px-12">
        <StatusBadge />
        <h1 className="text-white mb-8 uppercase leading-[0.9] tracking-[-0.05em] text-hero font-black">
          La Verdad ya no es una Opinión. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600">
            Es una Invariante Geométrica.
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed font-light">
          Proteja su soberanía informacional con el primer <strong>Sistema Inmune Matemático</strong> para Inteligencia Artificial. No vendemos predicciones, garantizamos Certeza Estructural.
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <a href="#portal" className="btn-primary px-10 py-4 no-underline">Iniciar Auditoría</a>
          <a href="/symbiosis" className="px-10 py-4 border border-white/10 text-white font-display text-[0.7rem] hover:bg-white/5 transition-all uppercase tracking-widest flex items-center gap-3">
            Investigación <span className="text-xl">→</span>
          </a>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="solutions" className="py-24 container mx-auto px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ServiceCard 
            metric="RICCI_FLOW : 0.0927"
            title="Auditoría de Certeza"
            description="Elimine la incertidumbre. Detectamos puntos de alucinación midiendo la curvatura del espacio latente en sus modelos."
          />
          <ServiceCard 
            metric="WEYL_RESONANCE : 0.7291"
            title="Escudo Omega"
            description="Certificación inmutable. Garantizamos que la información conserva su masa lógica original frente a ataques de ruido."
          />
          <ServiceCard 
            metric="RESILIENCE : 0.8546"
            title="Defensa Sintergica"
            description="Inmunidad visual. Nuestro Nervio Óptico ignora distorsiones profundas que engañan a las IAs convencionales."
          />
        </div>
      </section>

      {/* Portal de Verdad Section */}
      <section id="portal" className="py-24 container mx-auto px-12 max-w-5xl">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white uppercase mb-4 tracking-tighter">Portal de Verdad</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-mono font-bold">Análisis de integridad mediante el Dekeracto de 59,049 nodos.</p>
         </div>
         
         {/* Live Terminal Component */}
         <TruthTerminal />

         <div className="mt-12 text-center">
            <p className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.3em]">
              Data_Resonance_Active // Secure_Channel_Established
            </p>
         </div>
      </section>
    </div>
  );
}
