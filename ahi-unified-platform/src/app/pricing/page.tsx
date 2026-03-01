import React from 'react';
import { StripeBuyButton } from '@/components/pricing/StripeBuyButton';

// Claves públicas (Seguras para exponer en cliente)
const STRIPE_PK = "pk_live_51T5abG3fWVYxfUSDz66GX6GJvJERTjMOuM44eET8YWuMKoSjF9rmpVTm51DjlPzkw7YGXLhP2slmQcXi0nRfNkPv00CjHsUy0p";

const plans = [
  {
    title: "Auditoría Rápida",
    price: "Start",
    desc: "Evaluación inicial de integridad para modelos en desarrollo.",
    features: [
      "Análisis de Curvatura Ricci (Básico)",
      "Detección de Alucinaciones Superficiales",
      "Reporte de Estado Estructural (PDF)",
      "Certificado CRI™ Nivel 1"
    ],
    btnId: "buy_btn_1T5cmg3fWVYxfUSDuH0roD9A", // Quick
    highlight: false
  },
  {
    title: "Auditoría Técnica",
    price: "Pro",
    desc: "Deep scan para sistemas en producción crítica.",
    features: [
      "Análisis Ricci-Flow Completo (4D)",
      "Prueba de Resistencia Espectral (Mass Gap)",
      "Auditoría de Sesgo Vectorial",
      "Soporte Prioritario de Ingeniería",
      "Certificado CRI™ Nivel 2"
    ],
    btnId: "buy_btn_1T5clo3fWVYxfUSDmxJcs9K3", // Technical
    highlight: true // Cian intenso
  },
  {
    title: "Enterprise",
    price: "Sovereign",
    desc: "Infraestructura de verdad dedicada y gobernanza total.",
    features: [
      "Despliegue On-Premise del Auditor",
      "Gobernanza Activa en Tiempo Real",
      "Consultoría de Arquitectura Simbiótica",
      "SLA de Integridad Garantizada",
      "Certificado CRI™ Nivel 3 (Omega)"
    ],
    btnId: "buy_btn_1T5chZ3fWVYxfUSDy7SjAWk9", // Enterprise
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] font-body pt-32 pb-24 px-6">
      
      {/* Header */}
      <div className="text-center mb-24 container mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--accent-dim)] border border-[var(--accent)] rounded-full mb-8">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--accent)] uppercase font-bold">Investigación Financiada</span>
        </div>
        <h1 className="text-5xl font-display text-white mb-6 uppercase tracking-tight">
          Adquiera <span className="text-[var(--accent)]">Certeza</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
          Sus fondos sostienen la investigación en Sovereign Symbiosis. No está comprando software; está invirtiendo en la integridad estructural de la IA.
        </p>
      </div>

      {/* Grid de Precios */}
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`
              relative p-10 rounded-sm border transition-all duration-500 flex flex-col
              ${plan.highlight 
                ? 'bg-[var(--accent-dim)]/10 border-[var(--accent)] shadow-[0_0_40px_var(--accent-dim)] scale-105 z-10' 
                : 'bg-white/[0.02] border-white/10 hover:border-white/30'
              }
            `}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-black px-4 py-1 font-mono text-[9px] uppercase tracking-widest font-bold">
                Recomendado
              </div>
            )}

            <h3 className="font-display text-2xl text-white mb-2 uppercase">{plan.title}</h3>
            <div className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-8">{plan.price}</div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-10 border-b border-white/10 pb-8">
              {plan.desc}
            </p>

            <ul className="space-y-4 mb-12 flex-1">
              {plan.features.map((feat, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="text-[var(--accent)] mt-1">❖</span>
                  {feat}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8 border-t border-white/10">
              <StripeBuyButton buyButtonId={plan.btnId} publishableKey={STRIPE_PK} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-24 text-slate-600 font-mono text-[10px] uppercase tracking-widest">
        Pagos procesados de forma segura por Stripe. Facturación fiscal disponible.
      </div>
    </div>
  );
}
