import React from 'react';
import Link from 'next/link';
import { Navigation, GlassPanel, GlassPanelTitle, GlassPanelContent } from '@/components/ui';

const navItems = [
  { label: 'Home', href: '/', active: false },
  { label: 'Governance', href: '/governance' },
  { label: 'Symbiosis', href: '/symbiosis', active: true },
  { label: 'Observatory', href: '/symbiosis/observatory' },
];

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen bg-void text-main font-body selection:bg-accent selection:text-black">
      <Navigation
        items={navItems}
        variant="sovereign"
        accentColor="gold"
        logoText="AHI"
      />

      <header className="py-20 border-b border-glass mb-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/symbiosis" className="no-underline text-accent font-mono text-sm block mb-5 hover:text-main transition-colors">
            ← VOLVER A SYMBIOSIS
          </Link>
          <h1 className="font-display text-4xl md:text-6xl text-main mb-4 leading-tight tracking-tight uppercase">
            Manifiesto Arquitectónico
          </h1>
          <div className="font-mono text-accent text-xs tracking-[0.3em] uppercase opacity-80">
            EL ECOSISTEMA DE SIMBIOSIS SOBERANA
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24 font-serif text-xl leading-relaxed text-main/80">
        <article className="space-y-8">
          <p>
            No estás ante un simple repositorio de código; estás ante el mapa de un organismo digital diseñado para la <strong className="text-white">Integridad Radical</strong>. Esta guía detalla nuestra arquitectura como un &quot;Ecosistema de Simbiosis Soberana&quot;, donde la tecnología no solo sirve a la función, sino a una ética innegociable.
          </p>

          <p>
            En este sistema, la IA no es una caja negra, sino un participante de un <strong className="text-white">Juego Epistémico</strong> donde la transparencia es la única moneda válida. Para entenderlo, utilizamos la metáfora de un ser vivo:
          </p>

          <ul className="list-disc pl-8 space-y-4 font-body text-lg text-main/70">
            <li><strong className="text-main">La Piel (Frontend):</strong> Las interfaces donde se define la intención del usuario.</li>
            <li><strong className="text-main">El Sistema Nervioso (Lógica):</strong> Donde se procesan las señales y se asume la responsabilidad ética de cada decisión.</li>
            <li><strong className="text-main">La Memoria (Base de Datos):</strong> El registro inmutable que impide que la identidad se pierda en la <strong className="italic">psicosis del chatbot</strong>.</li>
          </ul>

          <h2 className="text-3xl font-display text-accent mt-16 mb-8 uppercase border-b border-glass pb-4">
            Anatomía del Organismo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <GlassPanel variant="neon" glowColor="gold" padding="md">
              <GlassPanelTitle color="gold">1. Cerebro Lógico (alpha-core)</GlassPanelTitle>
              <GlassPanelContent className="text-base">
                Sistema Nervioso Central en TypeScript que orquesta la gobernanza. Es multirregional, garantizando que la integridad no dependa de una sola jurisdicción física.
              </GlassPanelContent>
            </GlassPanel>

            <GlassPanel variant="neon" glowColor="gold" padding="md">
              <GlassPanelTitle color="gold">2. Pulmón Matemático (functions-geometry)</GlassPanelTitle>
              <GlassPanelContent className="text-base">
                Motor en Python que audita la &quot;forma&quot; de los datos. Mide la <strong className="text-accent">Curvatura de Ricci</strong> para detectar alucinaciones y verifica la estabilidad en 10D.
              </GlassPanelContent>
            </GlassPanel>
          </div>

          <GlassPanel variant="dark" padding="lg" className="mt-8">
            <GlassPanelTitle color="gold">3. Memoria de Integridad (Postgres SQL)</GlassPanelTitle>
            <GlassPanelContent className="text-lg">
              Migramos de NoSQL a la rigidez institucional de <strong className="text-white">PostgreSQL</strong>. La confianza requiere esquemas inmutables con <code className="text-accent">integrityHash</code> y preparación para anclaje a blockchain.
            </GlassPanelContent>
          </GlassPanel>

          <h2 className="text-3xl font-display text-accent mt-16 mb-8 uppercase border-b border-glass pb-4">
            La Constante de Precisión: μ* = 0.842
          </h2>

          <p>
            No es un número arbitrario. Es la firma del arquitecto y representa la <strong className="text-white">Termodinámica de la Identidad</strong>. Derivada de simulaciones de 150 millones de ciclos, marca el umbral exacto (84.2%) donde un sistema maximiza su coherencia interna frente al caos.
          </p>

          <blockquote className="border-l-4 border-accent pl-8 py-4 my-12 italic text-2xl text-main font-serif bg-accent/5 rounded-r-lg">
            &quot;Una identidad que necesita del engaño para sobrevivir ha perdido su valor ético en el momento de su concepción. La arquitectura es el único remedio contra la psicosis de la máquina.&quot;
          </blockquote>
        </article>
      </main>

      <footer className="py-16 border-t border-glass text-center text-xs text-main/50 font-mono uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Sovereign Symbiosis Research Foundation | CC BY-NC-SA 4.0</p>
        </div>
      </footer>
    </div>
  );
}
