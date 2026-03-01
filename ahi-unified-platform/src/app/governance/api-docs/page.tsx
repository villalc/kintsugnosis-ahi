import React from 'react';
import { Navigation } from '@/components/ui/Navigation';

export default function ApiDocsPage() {
  const navItems = [
    { label: 'Home', href: '/', active: false },
    { label: 'Governance', href: '/governance' },
    { label: 'Pricing', href: '/governance/pricing' },
    { label: 'API Reference', href: '/governance/api-docs', active: true },
    { label: 'EU AI Act', href: '/governance/eu-ai-act' },
    { label: 'Symbiosis', href: '/symbiosis' },
    { label: 'Observatory', href: '/symbiosis/observatory' },
  ];

  return (
    <div className="min-h-screen bg-governance-bg text-white font-body selection:bg-governance-cyan selection:text-black">
      {/* Navigation */}
      <Navigation
        items={navItems}
        variant="sovereign"
        accentColor="cyan"
        logoText="AHI"
      />

      {/* Header */}
      <header className="relative z-10 pt-40 pb-16 text-center border-b border-white/10 bg-governance-secondary">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            CMME-11 API Reference
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Interfaz programática para el Motor de Consenso Multi-Modelo y Certificación de Integridad Geométrica.
          </p>
          
          <div className="inline-block bg-white/[0.05] border border-white/10 rounded-lg px-6 py-3 font-mono text-governance-cyan text-sm tracking-wide">
            BASE URL: https://us-central1-ahi-governance-labs.cloudfunctions.net
          </div>
          
          <p className="text-gray-500 text-xs mt-6 font-mono">
            Endpoints disponibles: <code className="bg-white/5 px-2 py-1 rounded text-white">ignite_node_genesis</code> | <code className="bg-white/5 px-2 py-1 rounded text-white">certify_prompt_integrity</code>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-4xl py-20">
        
        {/* Auth Section */}
        <section id="auth" className="mb-20 pb-20 border-b border-white/10">
          <h2 className="font-display text-2xl md:text-3xl mb-6 flex items-center gap-3">
            <span>🔐</span> Autenticación
          </h2>
          <p className="text-gray-400 mb-6">
            Todas las peticiones deben incluir tu API Key en el header.
          </p>
          <div className="bg-[#1a1a24] border border-white/10 rounded-lg p-6 font-mono text-sm text-[#a9b7c6] overflow-x-auto">
            Authorization: Bearer YOUR_API_KEY_HERE
          </div>
        </section>

        {/* Endpoints Section */}
        <section id="endpoints" className="mb-20 pb-20 border-b border-white/10">
          <h2 className="font-display text-2xl md:text-3xl mb-12 flex items-center gap-3">
            <span>📍</span> Endpoints Principales
          </h2>

          {/* GET /health */}
          <div className="bg-governance-card border border-white/10 rounded-xl p-8 mb-10">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="bg-governance-cyan/15 text-governance-cyan font-mono font-bold px-3 py-1.5 rounded text-sm">GET</span>
              <span className="font-mono text-lg text-white">/health</span>
            </div>
            <p className="text-gray-400 mb-6">
              Verifica el estado operativo y la región activa de la instancia.
            </p>
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Respuesta Ejemplo:</h4>
            <div className="bg-[#1a1a24] border border-white/10 rounded-lg p-6 font-mono text-sm text-[#a9b7c6] overflow-x-auto">
{`{
  "status": "healthy",
  "timestamp": "2026-01-12T10:15:00Z",
  "version": "0.1.0",
  "region": "us-central1"
}`}
            </div>
          </div>

          {/* POST /v1/evaluate */}
          <div className="bg-governance-card border border-white/10 rounded-xl p-8 mb-10">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="bg-governance-green/15 text-governance-green font-mono font-bold px-3 py-1.5 rounded text-sm">POST</span>
              <span className="font-mono text-lg text-white">/v1/evaluate</span>
            </div>
            <p className="text-gray-400 mb-6">
              Evalúa un output de IA bajo el framework CMME-11 (Métricas IPHY/VIE).
            </p>
            
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Body Parameters:</h4>
            <ul className="space-y-3 mb-8">
              {[
                { name: "prompt", type: "string", desc: "El prompt original enviado al modelo." },
                { name: "output", type: "string", desc: "La respuesta generada a evaluar." },
                { name: "model_id", type: "string", desc: "Identificador del modelo (ej: gpt-4, claude-3)." }
              ].map((param, i) => (
                <li key={i} className="text-gray-400 text-sm pl-4 border-l border-white/10">
                  <span className="font-mono text-governance-cyan font-bold mr-2">{param.name}</span>
                  <span className="text-gray-500 italic mr-2">({param.type}):</span>
                  {param.desc}
                </li>
              ))}
            </ul>

            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Respuesta Ejemplo (200 OK):</h4>
            <div className="bg-[#1a1a24] border border-white/10 rounded-lg p-6 font-mono text-sm text-[#a9b7c6] overflow-x-auto">
{`{
  "evaluation_id": "eval_88d66c00",
  "metrics": {
    "vie_score": 0.8742,
    "ahi_score": 9.2,
    "sap_state": "SOVEREIGN"
  },
  "certification_eligible": true
}`}
            </div>
          </div>

          {/* POST /v1/certify */}
          <div className="bg-governance-card border border-white/10 rounded-xl p-8 mb-10">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="bg-governance-green/15 text-governance-green font-mono font-bold px-3 py-1.5 rounded text-sm">POST</span>
              <span className="font-mono text-lg text-white">/v1/certify</span>
            </div>
            <p className="text-gray-400 mb-6">
              Genera un certificado CRI™ (Corporate Reliability Index) oficial para compliance.
            </p>
            <div className="bg-[#1a1a24] border border-white/10 rounded-lg p-6 font-mono text-sm text-[#a9b7c6] overflow-x-auto">
{`{
  "certification_id": "cert_CRI2026",
  "status": "CERTIFIED",
  "compliance": {
    "eu_ai_act": true,
    "iso_27001": true
  }
}`}
            </div>
          </div>
        </section>

        {/* Rate Limits Section */}
        <section id="rate-limits">
          <h2 className="font-display text-2xl md:text-3xl mb-8 flex items-center gap-3">
            <span>📊</span> Límites & Cuotas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-gray-500 uppercase text-xs tracking-wider font-bold">Nivel</th>
                  <th className="py-4 px-6 text-gray-500 uppercase text-xs tracking-wider font-bold">Requests / Minuto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-6 text-white font-semibold">Starter</td>
                  <td className="py-4 px-6 text-gray-400">10 req/min</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-6 text-white font-semibold">Pro</td>
                  <td className="py-4 px-6 text-gray-400">500 req/min</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-governance-cyan font-semibold">Enterprise</td>
                  <td className="py-4 px-6 text-gray-400">Ilimitado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/10 bg-[#12121a] text-center">
        <div className="container mx-auto px-6">
          <p className="text-gray-500 text-sm mb-4">© 2026 AHI Governance Labs. Todos los derechos reservados.</p>
          <a href="mailto:enterprise@ahigovernance.com" className="text-governance-cyan text-sm hover:underline">
            enterprise@ahigovernance.com
          </a>
        </div>
      </footer>
    </div>
  );
}
