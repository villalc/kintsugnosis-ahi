import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

function StatusBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-10">
      <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
      <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400 uppercase">System Status: Omega_Active</span>
    </div>
  );
}

function ServiceCard({ metric, title, description }: { metric: string, title: string, description: string }) {
  return (
    <div className="glass-card flex flex-col items-start text-left">
      <div className="font-mono text-[9px] text-[var(--accent)] border border-[var(--accent)]/30 px-2 py-1 mb-8 uppercase tracking-[0.2em]">
        {metric}
      </div>
      <h3 className="text-xl font-display text-white mb-6 uppercase leading-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{description}</p>
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
        <h1 className="text-white mb-8 uppercase leading-[0.95] tracking-[-0.04em] text-hero">
          La Verdad ya no es una Opinión. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600">
            Es una Invariante Geométrica.
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed font-light">
          Proteja su soberanía informacional con el primer <strong>Sistema Inmune Matemático</strong> para Inteligencia Artificial. No vendemos predicciones, garantizamos Certeza Estructural.
        </p>
        <div className="flex flex-wrap gap-6 justify-center">
          <button className="btn-primary px-10 py-4">Iniciar Auditoría</button>
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

      {/* Terminal Section (Portal de Verdad) */}
      <section id="portal" className="py-24 container mx-auto px-12 max-w-5xl">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white uppercase mb-4 tracking-tighter">Portal de Verdad</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-mono">Análisis de integridad mediante el Dekeracto de 59,049 nodos.</p>
         </div>
         
         <div className="border border-white/10 rounded-sm bg-[#050508] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="bg-[#0a0a0f] px-6 py-4 border-b border-white/5 flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] opacity-50" />
               <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] opacity-50" />
               <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] opacity-50" />
               <div className="ml-auto font-mono text-slate-600 text-[10px] tracking-widest uppercase">/bin/audit_secure_v4.5</div>
            </div>
            
            <div className="p-24 text-center">
               <div className="border border-dashed border-white/10 rounded-sm p-16 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-dim)] transition-all cursor-pointer group relative overflow-hidden">
                  <div className="font-display text-sm text-[var(--accent)] mb-3 uppercase tracking-[0.3em] font-bold relative z-10">Input_Vector_Stream</div>
                  <p className="text-slate-600 text-[10px] uppercase tracking-widest relative z-10">Arrastre archivos o haga clic para análisis inmediato</p>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
