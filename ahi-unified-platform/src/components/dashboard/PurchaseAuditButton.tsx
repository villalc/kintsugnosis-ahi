'use client';

import React from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';

interface PurchaseAuditButtonProps {
  priceLabel?: string;
  className?: string;
}

export function PurchaseAuditButton({ priceLabel = "$50,000 MXN", className = "" }: PurchaseAuditButtonProps) {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_AUDIT_LINK;

  if (!paymentLink) {
    // Si no hay link configurado, mostramos un botón deshabilitado o de contacto
    return (
      <button 
        disabled
        className={`px-4 py-2 bg-gray-800 text-gray-500 rounded border border-gray-700 cursor-not-allowed font-mono text-xs ${className}`}
        title="Payment link not configured"
      >
        PAYMENTS DISABLED (DEV MODE)
      </button>
    );
  }

  return (
    <a
      href={paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-900 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-100 font-mono text-sm tracking-wide rounded-lg transition-all duration-300 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
      <CreditCard className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
      <span>INITIATE AUDIT PROTOCOL</span>
      <span className="bg-emerald-950/50 px-2 py-0.5 rounded text-[10px] text-emerald-300 border border-emerald-500/30">
        {priceLabel}
      </span>
      <ExternalLink className="w-3 h-3 text-emerald-500/50 group-hover:text-emerald-400 ml-1" />
    </a>
  );
}
