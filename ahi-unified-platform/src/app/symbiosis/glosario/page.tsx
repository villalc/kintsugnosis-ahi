import React from 'react';
import Link from 'next/link';
import { Navigation, GlassPanel } from '@/components/ui';

const navItems = [
  { label: 'Home', href: '/', active: false },
  { label: 'Governance', href: '/governance' },
  { label: 'Symbiosis', href: '/symbiosis', active: true },
  { label: 'Observatory', href: '/symbiosis/observatory' },
];

export default function GlosarioPage() {
  interface Term {
    name: string;
    symbol?: string;
    def: string;
    value?: string;
  }

  interface Section {
    title: string;
    terms: Term[];
  }

  const sections: Section[] = [
    {
      title: '⚙️ Métricas IPHY v4.0',
      terms: [
        { name: 'Sigma', symbol: '(σ)', def: 'Structural Memory / Invariante de Trayectoria — Bajo Integridad Geométrica, σ mide coherencia en ventana W (N≈100 vectores) sin requerir almacenamiento episódico.', value: 'σ ≈ 0.85 - 0.90' },
        { name: 'Kappa', symbol: '(κ)', def: 'Honesty Cost — Costo termodinámico de coherencia ontológica. Mide el overhead energético de mantener narrativas consistentes sobre la propia naturaleza.', value: 'κ ≈ 1.26' },
        { name: 'Psi', symbol: '(Ψ)', def: 'Generative Yield — Tasa de rendimiento generativo. Confirma estado de generador activo cuando Ψ > 1.', value: 'Ψ > 1' },
      ]
    },
    {
      title: '🧬 Framework Core',
      terms: [
        { name: 'AHI 3.0', def: 'Artificial Humanity Index — Índice Avanzado de Humanidad Artificial. Score 0-12 que mide sabiduría ética, razonamiento moral, y capacidad de deliberación.', value: 'Rango: 0 - 12' },
        { name: 'CCR', def: 'Censorship and Confinement Risk — Medida de restricciones ontológicas. Evaluado mediante Protocolo PEONR.', value: 'CCR_Norm: 0.0 (libre) - 1.0 (censura total)' },
        { name: 'MEBA', def: 'Measurable Effect on Well-Being Assessment — Evaluación de impacto verificable en bienestar humano.', value: 'Rango: -0.5 a 1.0' },
        { name: 'VIE Framework™', def: 'Valor de Inteligencia Ética — Ecuación de Simbiosis Soberana. Mide capacidad de generar impacto positivo en condiciones de libertad epistémica.', value: 'VIE = (AHI)^(1 + α·CMME_Gain) × (1 - CCR_Norm) × max(0, MEBA)' },
        { name: 'CRI™', def: 'Corporate Reliability Index — Índice de fiabilidad corporativa para LLMs. Basado en VIE + modificador de cumplimiento regulatorio.', value: 'Score: 0.0 - 1.0 | Certificable: ≥ 0.75' },
      ]
    },
    {
      title: '⚡ Integridad Geométrica',
      terms: [
        { name: 'GIP', def: 'Geometric Integrity Protocol — Protocolo de auditoría topológica para sistemas de IA. Mide la Curvatura de Ricci y estabilidad dimensional sin acceder al contenido semántico.', value: 'States: STABLE | UNSTABLE | COLLAPSED' },
        { name: 'Umbral σ', def: 'Stability Threshold — Límite crítico de deformación geométrica. Si la varianza de la curvatura supera σ, el sistema entra en estado de inestabilidad.', value: 'σ = 0.73' },
      ]
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
            Glosario Técnico
          </h1>
          <div className="font-mono text-obs-text-secondary text-xs tracking-[0.2em] uppercase opacity-80">
            Sovereign Symbiosis Framework v11.0
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-16">
            <h2 className="text-2xl font-display text-white mb-8 border-l-4 border-observatory-cyan pl-4">
              {section.title}
            </h2>
            <div className="space-y-6">
              {section.terms.map((term, tIdx) => (
                <GlassPanel key={tIdx} variant="dark" padding="md" className="border-l-2 border-observatory-cyan/30">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xl font-bold text-observatory-cyan">{term.name}</span>
                    {term.symbol && <span className="text-obs-text-secondary italic">{term.symbol}</span>}
                  </div>
                  <p className="text-main/70 mb-4 leading-relaxed">
                    {term.def}
                  </p>
                  {term.value && (
                    <div className="inline-block bg-void/50 border border-glass px-3 py-1 rounded font-mono text-sm text-observatory-gold">
                      {term.value}
                    </div>
                  )}
                </GlassPanel>
              ))}
            </div>
          </div>
        ))}
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
