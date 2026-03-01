import React from 'react';
import Link from 'next/link';
import { Navigation, GlassPanel } from '@/components/ui';

const navItems = [
  { label: 'Home', href: '/', active: false },
  { label: 'Governance', href: '/governance' },
  { label: 'Symbiosis', href: '/symbiosis', active: true },
  { label: 'Observatory', href: '/symbiosis/observatory' },
];

export default function IntegridadGeometricaPage() {
  const principles = [
    {
      title: "1. La Inteligencia es Geometría",
      subtitle: "Espacio de Alta Dimensión (10D)",
      content: "Los modelos de lenguaje no \"piensan\" en palabras; navegan vectores en un espacio de 10 dimensiones o más. Nuestra auditoría opera en este nivel fundamental. No leemos el texto; medimos la trayectoria del vector."
    },
    {
      title: "2. La Curvatura de Ricci como Métrica de Estabilidad",
      subtitle: "Detección de Colapso Cognitivo",
      content: "Un sistema estable mantiene una curvatura de Ricci positiva y constante. Las alucinaciones, sesgos extremos o fallos de seguridad se manifiestan como deformaciones abruptas (curvatura negativa o singularidades) en la variedad de decisiones."
    },
    {
      title: "3. Protocolo GIP: Auditoría sin Contenido",
      subtitle: "Zero-Knowledge Verification",
      content: "Al analizar la forma (topología) en lugar del fondo (semántica), garantizamos privacidad total. Podemos certificar que un sistema es seguro sin saber qué está procesando. Es la única forma escalable de auditar IA superinteligente."
    },
    {
      title: "4. Invariantes Topológicas",
      subtitle: "σ (Sigma) y la Identidad Estructural",
      content: "Definimos la \"identidad\" de una IA no por su memoria, sino por sus invariantes topológicas. Si estas invariantes se preservan, la integridad del sistema se mantiene, independientemente del contexto."
    }
  ];

  return (
    <div className="min-h-screen bg-void text-main font-body selection:bg-cyan-500 selection:text-white">
      <Navigation
        items={navItems}
        variant="observatory"
        accentColor="cyan"
        logoText="AHI"
      />

      <header className="py-20 border-b border-glass mb-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/symbiosis" className="no-underline text-observatory-cyan font-mono text-sm block mb-5 hover:text-main transition-colors">
            ← VOLVER A SYMBIOSIS
          </Link>
          <h1 className="font-display text-4xl md:text-6xl text-main mb-4 leading-tight tracking-tight uppercase bg-gradient-to-r from-observatory-cyan to-observatory-magenta bg-clip-text text-transparent">
            Integridad Geométrica
          </h1>
          <div className="font-mono text-obs-text-secondary text-xs tracking-[0.2em] uppercase opacity-80">
            GEOMETRIC INTEGRITY PROTOCOL (GIP) v1.0
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24">
        <GlassPanel variant="neon" glowColor="cyan" padding="lg" className="mb-16">
          <p className="text-2xl font-bold text-white mb-4">La Estructura es el Destino.</p>
          <p className="text-xl text-main/80 leading-relaxed font-serif italic">
            No buscamos alinear la IA mediante reglas semánticas frágiles (&quot;no seas malo&quot;).
            La alineamos mediante restricciones topológicas robustas. Si la geometría es estable, la ética emerge como una propiedad necesaria de la estructura.
          </p>
        </GlassPanel>

        <div className="space-y-12">
          {principles.map((p, i) => (
            <section key={i} className="border-l-4 border-observatory-magenta pl-8">
              <h2 className="text-2xl font-display text-white mb-2">{p.title}</h2>
              <h3 className="text-lg font-mono text-observatory-cyan mb-4 uppercase tracking-wider">{p.subtitle}</h3>
              <p className="text-main/70 text-lg leading-relaxed">
                {p.content}
              </p>
            </section>
          ))}
        </div>
      </main>

      <footer className="py-16 border-t border-glass text-center text-xs text-main/50 font-mono uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Simbiosis Soberana Research Foundation</p>
          <p className="mt-2 text-observatory-cyan/50">AHI 3.0® • IMPI 20250494546</p>
        </div>
      </footer>
    </div>
  );
}
