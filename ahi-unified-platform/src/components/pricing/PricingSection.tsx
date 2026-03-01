'use client';

import React from 'react';
import { StripeBuyButton } from './StripeBuyButton';

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PK || '';

const STRIPE_BTN_QUICK = process.env.NEXT_PUBLIC_STRIPE_BTN_QUICK || '';
const STRIPE_BTN_TECHNICAL = process.env.NEXT_PUBLIC_STRIPE_BTN_TECHNICAL || '';
const STRIPE_BTN_ENTERPRISE = process.env.NEXT_PUBLIC_STRIPE_BTN_ENTERPRISE || '';

const tiers = [
  {
    name: 'Quick Score',
    tag: 'Self-Service',
    price: '$2,500 — $5,000 MXN',
    description: 'Análisis automatizado con CRI™ Score Card para validación rápida.',
    color: '#00d4ff',
    buyButtonId: STRIPE_BTN_QUICK,
    includes: [
      'Análisis automatizado de 1 modelo de IA',
      'CRI™ Score (0-100) vía MEBA framework',
      'Métricas: stress algorítmico, entropía, estabilidad',
      'Verificación GIP (Ricci curvature check)',
    ],
    delivers: [
      'PDF de 3-5 páginas con Score Card',
      'Semáforo de riesgo (Verde/Amarillo/Rojo)',
      '3 recomendaciones priorizadas',
      'Badge digital "CRI™ Assessed"',
    ],
    sla: '24-48 horas',
    refund: '100% si no se entrega en 48h',
  },
  {
    name: 'Technical Audit',
    tag: 'Standard',
    price: '$10,000 — $25,000 MXN',
    description: 'Auditoría técnica con análisis manual de arquitectura y reporte ejecutivo.',
    color: '#00ff88',
    featured: true,
    buyButtonId: STRIPE_BTN_TECHNICAL,
    includes: [
      'Todo lo del Quick Score',
      'Auditoría manual de arquitectura del modelo',
      'Análisis de Fisher Gap + Geometric Lock',
      'Revisión de pipelines de datos y sesgos',
      '1 call de contexto (30 min)',
      '1 call de hallazgos (45 min)',
    ],
    delivers: [
      'Reporte técnico de 15-25 páginas',
      'CRI™ Score Card desglosado por dimensión',
      'Mapa de riesgos con severidad',
      'Plan de remediación con timeline',
      'Certificado "GIP Audited" (6 meses)',
    ],
    sla: '5-10 días hábiles',
    refund: '50% si se cancela antes del análisis técnico',
  },
  {
    name: 'Enterprise Compliance',
    tag: 'Full',
    price: '$50,000+ MXN',
    description: 'Auditoría integral multi-modelo con certificación, monitoreo y soporte continuo.',
    color: '#a855f7',
    buyButtonId: STRIPE_BTN_ENTERPRISE,
    includes: [
      'Todo lo del Technical Audit',
      'Auditoría multi-modelo / multi-sistema',
      'Cumplimiento regulatorio (EU AI Act)',
      'Testing adversarial personalizado',
      '3 calls de seguimiento (30 días)',
      'Acceso al Dashboard de monitoreo (6 meses)',
    ],
    delivers: [
      'Reporte ejecutivo (5 pág. para C-suite)',
      'Reporte técnico completo (30-50 pág.)',
      'Certificación CRI™ Enterprise (12 meses)',
      'Playbook de gobernanza personalizado',
      'Dashboard con métricas en tiempo real',
      'Carta de cumplimiento firmada',
    ],
    sla: '15-20 días hábiles',
    refund: '30% si se cancela en los primeros 5 días. Garantía de re-auditoría si el regulador rechaza el reporte (90 días).',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#12121a]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#00d4ff] font-mono text-sm uppercase tracking-wider mb-2 block">
            Servicios
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Protección para Cada Escala
          </h2>
          <p className="text-[#9090a0] text-lg max-w-2xl mx-auto">
            Desde startups validando su primer modelo hasta enterprises cumpliendo regulación internacional.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-[#1a1a24]/80 border rounded-2xl p-8 flex flex-col transition-all hover:-translate-y-1 ${
                tier.featured
                  ? `border-[${tier.color}]/50 shadow-[0_0_40px_rgba(0,255,136,0.1)]`
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={tier.featured ? { borderColor: `${tier.color}40` } : undefined}
            >
              {/* Tag */}
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-black"
                    style={{ backgroundColor: tier.color }}
                  >
                    Más Popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <span
                  className="text-xs font-mono uppercase tracking-wider mb-2 block"
                  style={{ color: tier.color }}
                >
                  {tier.tag}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-xl font-bold text-white mb-3">{tier.price}</div>
                <p className="text-sm text-[#9090a0] leading-relaxed">{tier.description}</p>
              </div>

              {/* What's included */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#9090a0] mb-3">
                  Qué incluye
                </h4>
                <ul className="space-y-2">
                  {tier.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#c0c0d0]">
                      <span style={{ color: tier.color }} className="font-bold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What you get */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#9090a0] mb-3">
                  Qué recibe
                </h4>
                <ul className="space-y-2">
                  {tier.delivers.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#c0c0d0]">
                      <span style={{ color: tier.color }} className="font-bold mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* SLA & Refund */}
              <div className="mt-auto pt-6 border-t border-white/10 space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-[#9090a0]">
                  <span>⏱</span>
                  <span>Entrega: <strong className="text-white">{tier.sla}</strong></span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#9090a0]">
                  <span>↩</span>
                  <span>{tier.refund}</span>
                </div>
              </div>

              {/* Stripe Buy Button */}
              <StripeBuyButton
                buyButtonId={tier.buyButtonId}
                publishableKey={STRIPE_PK}
              />
            </div>
          ))}
        </div>

        {/* Refund Policy Note */}
        <div className="text-center text-xs text-[#9090a0]/60 max-w-2xl mx-auto">
          <p>
            Todos los precios en MXN. Se aceptan pagos en USD al tipo de cambio del día.
            Factura fiscal mexicana (CFDI) disponible bajo solicitud.
            Para consultas Enterprise personalizadas, escriba a{' '}
            <a href="mailto:enterprise@ahigovernance.com" className="text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors">
              enterprise@ahigovernance.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
