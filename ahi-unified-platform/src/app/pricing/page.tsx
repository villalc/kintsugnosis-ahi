'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

const plans = [
  {
    title: 'Auditoría Rápida',
    price: 'Start',
    tierKey: 'quick',
    priceDisplay: 'MXN 5,000 / mes',
    desc: 'Evaluación inicial de integridad para modelos en desarrollo.',
    tier: 1,
    highlight: false,
    features: [
      'Análisis de Curvatura Ricci (Básico)',
      'Detección de Alucinaciones Superficiales',
      'Reporte de Estado Estructural (PDF)',
      'Certificado CRI™ Nivel 1',
    ],
  },
  {
    title: 'Auditoría Técnica',
    price: 'Pro',
    tierKey: 'technical',
    priceDisplay: 'MXN 25,000 / mes',
    desc: 'Deep scan para sistemas en producción crítica.',
    tier: 2,
    highlight: true,
    features: [
      'Análisis Ricci-Flow Completo (4D)',
      'Prueba de Resistencia Espectral (Mass Gap)',
      'Auditoría de Sesgo Vectorial',
      'Soporte Prioritario de Ingeniería',
      'Certificado CRI™ Nivel 2',
    ],
  },
  {
    title: 'Enterprise',
    price: 'Sovereign',
    tierKey: 'enterprise',
    priceDisplay: 'MXN 50,000 / mes',
    desc: 'Infraestructura de verdad dedicada y gobernanza total.',
    tier: 3,
    highlight: false,
    features: [
      'Despliegue On-Premise del Auditor',
      'Gobernanza Activa en Tiempo Real',
      'Consultoría de Arquitectura Simbiótica',
      'SLA de Integridad Garantizada',
      'Certificado CRI™ Nivel 3 (Omega)',
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubscribe = async (tierKey: string) => {
    setError('');
    setLoadingTier(tierKey);

    // Si no está autenticado, redirigir a login con redirect de vuelta
    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierKey,
          userEmail: user.email,
          userId: user.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Error al iniciar el pago');
      }

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="text-center pt-20 pb-12 px-4">
        <p className="text-xs tracking-widest text-cyan-500 font-mono mb-4">INVESTIGACIÓN FINANCIADA</p>
        <h1 className="text-4xl md:text-5xl font-bold font-display">
          Adquiera<br />Certeza
        </h1>
        <p className="mt-4 text-gray-400 max-w-lg mx-auto">
          Sus fondos sostienen la investigación en Sovereign Symbiosis.
          No está comprando software; está invirtiendo en la integridad estructural de la IA.
        </p>
      </div>

      {/* Error global */}
      {error && (
        <div className="max-w-md mx-auto mb-8 p-3 bg-red-900/40 border border-red-500/50 rounded text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* Grid de precios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 pb-20">
        {plans.map((plan) => (
          <div
            key={plan.tierKey}
            className={`relative rounded-xl border p-8 flex flex-col ${
              plan.highlight
                ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                : 'border-gray-800 bg-white/5'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs tracking-widest text-gray-500 font-mono mb-1">{plan.title.toUpperCase()}</p>
              <h2 className="text-3xl font-bold">{plan.price}</h2>
              <p className="text-cyan-400 font-mono text-sm mt-1">{plan.priceDisplay}</p>
              <p className="text-gray-400 text-sm mt-3">{plan.desc}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-500 mt-0.5">❮</span>
                  {feat}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.tierKey)}
              disabled={loadingTier === plan.tierKey}
              className={`w-full py-3 rounded-lg font-mono text-sm font-bold tracking-widest transition-all ${
                plan.highlight
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                  : 'bg-transparent border border-gray-600 text-white hover:border-cyan-500 hover:text-cyan-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loadingTier === plan.tierKey ? 'PROCESANDO...' : 'SUSCRIBIRSE'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-600 pb-8 font-mono">
        PAGOS PROCESADOS DE FORMA SEGURA POR STRIPE. FACTURACIÓN FISCAL DISPONIBLE.
      </p>
    </div>
  );
}
