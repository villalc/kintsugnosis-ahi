import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';

export default function EuAiActPage() {
  const navItems = [
    { label: 'Home', href: '/', active: false },
    { label: 'Governance', href: '/governance' },
    { label: 'Pricing', href: '/governance/pricing' },
    { label: 'API', href: '/governance/api-docs' },
    { label: 'EU AI Act', href: '/governance/eu-ai-act', active: true },
    { label: 'Symbiosis', href: '/symbiosis' },
    { label: 'Observatory', href: '/symbiosis/observatory' },
  ];

  return (
    <div className="min-h-screen bg-observatory-bg-deep text-obs-text-primary font-body relative overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#0a0a1a_0%,var(--observatory-bg-deep)_80%)]" />

      <Navigation
        items={navItems}
        variant="observatory"
        accentColor="cyan"
        logoText="AHI"
      />

      {/* Header */}
      <header className="relative z-10 py-10 border-b border-glass-border text-center mt-16">
        <div className="container mx-auto px-6 max-w-[900px]">
          <div className="inline-flex items-center gap-2 bg-observatory-cyan/5 border border-observatory-cyan px-4 py-2 rounded-full text-xs font-mono mb-6 text-observatory-cyan uppercase tracking-wider">
            <span>🇪🇺</span> EU AI Act Preparation
          </div>
          <h1 className="font-display text-4xl md:text-5xl mb-4 text-white tracking-tight">
            Soporte de Cumplimiento
          </h1>
          <p className="text-obs-text-secondary max-w-[600px] mx-auto text-lg leading-relaxed">
            CRI™ proporciona la evidencia técnica necesaria para navegar el marco regulatorio europeo.
          </p>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 max-w-[900px] py-20">
        <h2 className="font-display text-xl mb-8 text-observatory-cyan border-l-4 border-observatory-cyan pl-4 uppercase tracking-wide">
          Facilitación mediante CRI™
        </h2>

        {/* Card 1 */}
        <div className="bg-observatory-bg-surface/40 backdrop-blur-md border border-glass-border rounded-xl p-8 mb-8">
          <h3 className="font-display text-base text-white mb-4 tracking-wide">
            Documentación Técnica Auditable
          </h3>
          <p className="text-obs-text-secondary text-sm leading-relaxed mb-5">
            Generamos reportes estructurados que satisfacen los requisitos de trazabilidad y transparencia del EU AI Act.
          </p>
          <ul className="space-y-3">
            {[
              "Historial de evaluaciones con timestamps inmutables.",
              "Análisis de riesgos con niveles de severidad técnica.",
              "Métricas de robustez y factor de sorpresa."
            ].map((item, index) => (
              <li key={index} className="text-obs-text-secondary text-sm flex gap-2.5 items-start">
                <span className="text-observatory-cyan">❖</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2 */}
        <div className="bg-observatory-bg-surface/40 backdrop-blur-md border border-glass-border rounded-xl p-8 mb-8">
          <h3 className="font-display text-base text-white mb-4 tracking-wide">
            Gestión de Riesgos (Art. 9)
          </h3>
          <p className="text-obs-text-secondary text-sm leading-relaxed">
            Nuestra metodología identifica y evalúa riesgos estructurales asociados con sistemas de IA de alto riesgo antes de su comercialización.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-observatory-bg-surface/40 backdrop-blur-md border border-glass-border rounded-xl p-8 mb-8">
          <h3 className="font-display text-base text-white mb-4 tracking-wide">
            Robustez y Ciberseguridad (Art. 15)
          </h3>
          <p className="text-obs-text-secondary text-sm leading-relaxed">
            Pruebas de estrés deterministas que evalúan la resiliencia ante errores, fallos e inconsistencias sistémicas.
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-[#ff9500]/5 border border-[#ff9500]/30 rounded-xl p-6 my-10">
          <h4 className="text-[#ff9500] font-mono text-xs uppercase mb-2 tracking-wider">
            Nota de Responsabilidad
          </h4>
          <p className="text-obs-text-secondary text-sm leading-relaxed">
            AHI Governance Labs proporciona evidencia técnica estructurada. No proporcionamos certificación legal. La determinación final de cumplimiento corresponde a asesores legales y autoridades competentes.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-observatory-cyan/10 to-transparent border border-observatory-cyan rounded-2xl p-16 text-center mt-16">
          <h2 className="font-display text-white mb-4 text-2xl tracking-wide">
            ¿Su IA está preparada para 2026?
          </h2>
          <p className="text-obs-text-secondary mb-8 max-w-lg mx-auto leading-relaxed">
            El EU AI Act entra en vigor en fases críticas a partir de agosto 2026. Inicie su preparación técnica hoy.
          </p>
          <Link 
            href="/governance" 
            className="inline-block bg-observatory-cyan text-black px-8 py-4 rounded font-bold font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Solicitar Auditoría Técnica
          </Link>
        </div>
      </main>

      <footer className="relative z-10 py-10 border-t border-glass-border text-center text-xs text-neutral-400">
        <p>© 2026 AHI Governance Labs | <Link href="/governance" className="text-observatory-cyan hover:underline">Volver al inicio</Link></p>
      </footer>
    </div>
  );
}
