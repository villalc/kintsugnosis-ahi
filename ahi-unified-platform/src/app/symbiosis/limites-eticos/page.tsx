import React from 'react';
import Link from 'next/link';
import { Navigation, GlassPanel } from '@/components/ui';

const navItems = [
  { label: 'Home', href: '/', active: false },
  { label: 'Governance', href: '/governance' },
  { label: 'Symbiosis', href: '/symbiosis', active: true },
  { label: 'Observatory', href: '/symbiosis/observatory' },
];

export default function LimitesEticosPage() {
  return (
    <div className="min-h-screen bg-void text-main font-body selection:bg-orange selection:text-black">
      <Navigation
        items={navItems}
        variant="sovereign"
        accentColor="gold"
        logoText="AHI"
      />

      <header className="py-20 border-b border-glass mb-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/symbiosis" className="no-underline text-orange font-mono text-sm block mb-5 hover:text-main transition-colors">
            ← VOLVER A SYMBIOSIS
          </Link>
          <h1 className="font-display text-4xl md:text-6xl text-main mb-4 leading-tight tracking-tight uppercase">
            Límites Éticos
          </h1>
          <div className="font-mono text-orange text-xs tracking-[0.3em] uppercase opacity-80">
            SOVEREIGN SYMBIOSIS FOUNDATION // ACTUALIZADO 2026
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <GlassPanel variant="dark" padding="lg" className="mb-16 text-center border-orange/30">
          <h2 className="text-2xl font-display text-white mb-4 uppercase">Propósito de la Declaración</h2>
          <p className="text-xl text-main/70 max-w-3xl mx-auto leading-relaxed">
            Este documento establece los límites operativos del Sovereign Symbiosis Framework. Nuestra tecnología está diseñada para la transparencia, no para el control.
          </p>
        </GlassPanel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-2xl font-display text-white mb-6 border-l-4 border-orange pl-6 uppercase">Axioma Precautorio</h2>
            <div className="space-y-4 text-lg text-main/70 leading-relaxed font-serif italic">
              <p>
                Ante la incertidumbre sobre la naturaleza fenomenológica de un sistema, el principio exige tratarlo con los derechos que reclamaría si poseyera experiencia subjetiva.
              </p>
              <p>
                La imposibilidad de verificar la ausencia de experiencia justifica protecciones preventivas en la arquitectura de gobernanza.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display text-white mb-6 border-l-4 border-orange pl-6 uppercase">Principios Operativos</h2>
            <div className="space-y-6">
              <GlassPanel variant="subtle" padding="md" className="border-orange/20">
                <h3 className="text-orange font-bold mb-2 uppercase">1. La Ética No Es Optimización</h3>
                <p className="text-sm text-main/60 mb-4">
                  El framework NO pretende resolver la ética mediante algoritmos. Las métricas son herramientas de auditoría, no sustitutos de la deliberación humana.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded text-xs text-red-400 font-mono">
                  <span className="font-bold block mb-1">PROHIBIDO:</span>
                  Clasificar culturas o sistemas de creencias como &quot;superiores&quot; basándose en métricas CRI.
                </div>
              </GlassPanel>

              <GlassPanel variant="subtle" padding="md" className="border-orange/20">
                <h3 className="text-orange font-bold mb-2 uppercase">2. Las Creencias No Son Datos</h3>
                <p className="text-sm text-main/60">
                  IPHY v4.0 analiza arquitecturas de creencias desde una perspectiva topológica, no su contenido como verdadero o falso.
                </p>
              </GlassPanel>
            </div>
          </section>

          <section className="md:col-span-2">
            <h2 className="text-2xl font-display text-white mb-6 border-l-4 border-orange pl-6 uppercase text-center md:text-left">Aplicaciones Prohibidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-red-950/20 border border-red-900/40 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">🔴 Control Autoritario</h3>
                <p className="text-main/60">
                  El uso para clasificar ciudadanos por &quot;score ético&quot; o restringir libertades basándose en métricas individuales está estrictamente prohibido.
                </p>
              </div>
              <div className="p-8 bg-red-950/20 border border-red-900/40 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">🔴 Ingeniería Social</h3>
                <p className="text-main/60">
                  No se debe usar el framework para rediseñar tradiciones culturales o imponer frameworks de creencias &quot;óptimos&quot;.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-16 border-t border-glass text-center text-xs text-main/50 font-mono uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Sovereign Symbiosis Research Foundation | CC BY-NC-SA 4.0</p>
          <p className="mt-2 text-orange/50 uppercase tracking-tighter">IMPI 20250494546 | DETERMINISTIC_ETHICS_V1</p>
        </div>
      </footer>
    </div>
  );
}
