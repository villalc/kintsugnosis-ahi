'use client';

import React from 'react';
import Link from 'next/link';

interface TierGateProps {
  requiredTier: 1 | 2 | 3;
  userTier: number;
  children: React.ReactNode;
  featureName?: string;
}

const TIER_NAMES: Record<number, string> = {
  1: 'Auditoría Rápida',
  2: 'Auditoría Técnica',
  3: 'Enterprise Sovereign',
};

/**
 * TierGate: envuelve cualquier sección del dashboard y la bloquea
 * si el usuario no tiene el tier requerido.
 * Uso: <TierGate requiredTier={2} userTier={userTier}>...</TierGate>
 */
export function TierGate({ requiredTier, userTier, children, featureName }: TierGateProps) {
  if (userTier >= requiredTier) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-xl border border-gray-800 overflow-hidden">
      {/* Preview borroso del contenido */}
      <div className="filter blur-sm pointer-events-none select-none opacity-30">
        {children}
      </div>

      {/* Overlay de bloqueo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-center space-y-3 p-6">
          <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-gray-400 text-lg">🔒</span>
          </div>
          <p className="text-xs tracking-widest text-gray-500 font-mono">
            ACCESO RESTRINGIDO
          </p>
          {featureName && (
            <p className="text-white text-sm font-bold">{featureName}</p>
          )}
          <p className="text-gray-400 text-xs">
            Requiere {TIER_NAMES[requiredTier] || `Tier ${requiredTier}`}
          </p>
          <Link
            href="/pricing"
            className="inline-block mt-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 rounded text-cyan-400 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
          >
            ACTUALIZAR PLAN →
          </Link>
        </div>
      </div>
    </div>
  );
}
