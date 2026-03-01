import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/ui';

const navItems = [
  { label: 'Home', href: '/', active: false },
  { label: 'Governance', href: '/governance', active: true },
  { label: 'Pricing', href: '/governance/pricing' },
  { label: 'API', href: '/governance/api-docs' },
  { label: 'EU AI Act', href: '/governance/eu-ai-act' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-governance-bg text-text-main font-body selection:bg-governance-cyan selection:text-black">
      <Navigation
        items={navItems}
        variant="minimal"
        accentColor="cyan"
        logoText="AHI"
      />

      <header className="py-24 border-b border-white/5 bg-governance-surface/50">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/governance" className="text-governance-cyan font-mono text-sm uppercase tracking-widest hover:text-white transition-colors mb-6 inline-block">
            ← VOLVER A GOVERNANCE
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Términos de Servicio</h1>
          <p className="text-text-muted">Última actualización: 9 de enero de 2026</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              1. Descripción del Servicio
            </h2>
            <p className="text-text-muted leading-relaxed">
              AHI Governance Labs proporciona servicios de auditoría y organización para ecosistemas corporativos. Nuestra misión es garantizar que los procesos administrativos de su empresa operen bajo un rigor determinista, eliminando la incertidumbre informativa.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              2. Propiedad Intelectual
            </h2>
            <p className="text-text-muted leading-relaxed">
              El estándar AHI 3.0® y la certificación CRI™ están protegidos por leyes de propiedad intelectual y registros ante el IMPI México. El uso de nuestras métricas estructurales está sujeto a licencias específicas para cada cliente.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              3. Limitación de Responsabilidad
            </h2>
            <p className="text-text-muted leading-relaxed">
              Nuestras auditorías garantizan la integridad de la forma y estructura de los procesos organizacionales. No asumimos responsabilidad por las decisiones comerciales tomadas por el usuario, ni proporcionamos asesoría legal directa. Nuestros reportes son herramientas de soporte técnico-organizativo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              4. Contacto Legal y Abuso
            </h2>
            <div className="text-text-muted leading-relaxed">
              <p className="mb-2"><strong>Términos y Contratos:</strong> <a href="mailto:terms@ahigovernance.com" className="text-governance-cyan hover:underline">terms@ahigovernance.com</a></p>
              <p><strong>Reporte de Abusos:</strong> <a href="mailto:abuse@ahigovernance.com" className="text-governance-cyan hover:underline">abuse@ahigovernance.com</a></p>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-16 border-t border-white/5 text-center text-sm text-text-muted">
        <div className="max-w-4xl mx-auto px-6">
          <p>© 2026 AHI Governance Labs. Integridad Estructural v3.0</p>
        </div>
      </footer>
    </div>
  );
}
