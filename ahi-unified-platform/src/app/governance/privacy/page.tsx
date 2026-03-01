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

export default function PrivacyPage() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Política de Privacidad</h1>
          <p className="text-text-muted">Última actualización: 9 de enero de 2026</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              1. Información que Recopilamos
            </h2>
            <p className="text-text-muted leading-relaxed mb-4">
              AHI Governance Labs recopila la información necesaria para garantizar la integridad de sus procesos organizacionales:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li><strong>Datos de contacto:</strong> Correo electrónico corporativo proporcionado para auditorías.</li>
              <li><strong>Datos de Procesos:</strong> Hash y métricas estructurales de los flujos organizacionales auditados (nunca datos personales de empleados o clientes finales).</li>
              <li><strong>Uso del sitio:</strong> Analítica anónima para mejora de la experiencia de usuario.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              2. Uso de la Información
            </h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Utilizamos la información recopilada exclusivamente para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-muted">
              <li>Proporcionar servicios de auditoría y certificación CRI™.</li>
              <li>Asegurar el rigor determinista en la administración de su ecosistema.</li>
              <li>Comunicar resultados y recomendaciones de optimización estructural.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              3. Compartición y Seguridad
            </h2>
            <p className="text-text-muted leading-relaxed">
              No compartimos información con terceros, excepto cuando sea necesario para la validación técnica bajo acuerdos estrictos de confidencialidad. Implementamos medidas de seguridad de grado industrial para proteger la integridad de sus datos organizacionales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-governance-cyan uppercase tracking-wider mb-6 border-b border-white/10 pb-2">
              4. Contacto de Privacidad
            </h2>
            <p className="text-text-muted leading-relaxed">
              Para cualquier solicitud relacionada con sus datos, puede contactarnos en: <a href="mailto:privacy@ahigovernance.com" className="text-governance-cyan hover:underline">privacy@ahigovernance.com</a>
            </p>
          </section>
        </div>
      </main>

      <footer className="py-16 border-t border-white/5 text-center text-sm text-text-muted">
        <div className="max-w-4xl mx-auto px-6">
          <p>© 2026 AHI Governance Labs. Transparencia Estructural Garantizada.</p>
        </div>
      </footer>
    </div>
  );
}
