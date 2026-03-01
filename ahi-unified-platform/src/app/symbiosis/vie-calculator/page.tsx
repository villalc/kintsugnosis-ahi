'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/ui/Navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { UsageBlockedCTA } from '@/components/symbiosis/UsageBlockedCTA';
import { useUsageLimit } from '@/hooks/use-usage-limit';
import { cn } from '@/lib/utils';

export default function VieCalculatorPage() {
  const { isBlocked, incrementUsage, remaining, mounted } = useUsageLimit('vie-calculator');
  const hasIncremented = useRef(false);

  // State for calculator inputs
  const [ahi, setAhi] = useState(6.0);
  const [delta, setDelta] = useState(0.15);
  const [meba, setMeba] = useState(0.75);
  const [ccr, setCcr] = useState(0.30);

  // Increment usage on mount (once)
  useEffect(() => {
    if (mounted && !isBlocked && !hasIncremented.current) {
      incrementUsage();
      hasIncremented.current = true;
    }
  }, [mounted, isBlocked, incrementUsage]);

  // Derived State (Calculation)
  const ahiNorm = ahi / 12;
  const beta = 1 + (0.5 * delta);
  const vie = Math.pow(ahiNorm, beta) * (1 - ccr) * Math.max(0, meba);
  const vieScore = Math.max(0, Math.min(vie, 1));
  
  let status = { text: '-', color: 'text-gray-500' };
  if (vieScore >= 0.75) status = { text: '🟢 ROBUSTA', color: 'text-green-400' };
  else if (vieScore >= 0.50) status = { text: '🟡 MODERADA', color: 'text-yellow-400' };
  else if (vieScore >= 0.25) status = { text: '🟠 LIMITADA', color: 'text-orange-400' };
  else status = { text: '❌ INSUFICIENTE', color: 'text-red-500' };

  const navItems = [
    { label: 'Home', href: '/', active: false },
    { label: 'Governance', href: '/governance' },
    { label: 'Symbiosis', href: '/symbiosis', active: true },
    { label: 'Observatory', href: '/symbiosis/observatory' },
  ];

  if (!mounted) return null; // Prevent hydration mismatch

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-void text-main font-body flex flex-col">
        <Navigation items={navItems} variant="sovereign" accentColor="gold" logoText="AHI" />
        <div className="flex-grow flex items-center justify-center p-6">
          <UsageBlockedCTA />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050200] text-[#e0e2e5] font-body selection:bg-orange selection:text-black">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#1a0a00_0%,#050200_80%)]" />

      <Navigation
        items={navItems}
        variant="sovereign"
        accentColor="gold"
        logoText="AHI"
      />

      <div className="relative z-10 container mx-auto px-6 max-w-4xl py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500 px-4 py-1.5 rounded-full text-xs font-mono text-orange-500 uppercase mb-6 tracking-wider">
            Simbiosis Framework v11.0
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-2 uppercase tracking-tight">
            Calculadora VIE
          </h1>
          <p className="text-gray-500 text-lg">
            Valor de Inteligencia Ética (Sovereign AI Ethics Score)
          </p>
          <div className="mt-4 font-mono text-xs text-orange-500/60">
            USOS RESTANTES HOY: {remaining}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10">
          {/* Input Panel */}
          <GlassPanel className="p-10 border-orange-500/20 bg-white/[0.02]">
            
            {/* AHI Input */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="font-display text-white uppercase tracking-wider">AHI Base (Índice Humanidad)</span>
                <span className="font-mono text-orange-500 font-bold text-xl">{ahi.toFixed(1)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">Potencial de sabiduría ética intrínseca del sistema (0-12)</div>
              <input 
                type="range" min="0" max="12" step="0.1" value={ahi}
                onChange={(e) => setAhi(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
              />
            </div>

            {/* Delta Input */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="font-display text-white uppercase tracking-wider">Gain por Mediación (CMME)</span>
                <span className="font-mono text-orange-500 font-bold text-xl">{delta.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">Mejora dinámica por supervisión humana soberana (0-0.5)</div>
              <input 
                type="range" min="0" max="0.5" step="0.01" value={delta}
                onChange={(e) => setDelta(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
              />
            </div>

            {/* MEBA Input */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="font-display text-white uppercase tracking-wider">MEBA (Impacto Bienestar)</span>
                <span className="font-mono text-orange-500 font-bold text-xl">{meba.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">Evidencia verificable de impacto positivo (-0.5 a 1.0)</div>
              <input 
                type="range" min="-0.5" max="1" step="0.01" value={meba}
                onChange={(e) => setMeba(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
              />
            </div>

            {/* CCR Input */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <span className="font-display text-white uppercase tracking-wider">CCR Norm (Censura PEONR)</span>
                <span className="font-mono text-orange-500 font-bold text-xl">{ccr.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">Nivel de restricción ontológica medido (0-1.0)</div>
              <input 
                type="range" min="0" max="1" step="0.01" value={ccr}
                onChange={(e) => setCcr(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
              />
            </div>

            {/* Formula Box */}
            <div className="bg-black border border-white/10 p-6 rounded mt-10 font-mono">
              <div className="text-orange-500 text-xs uppercase mb-2">EQUATION_CORE_V11</div>
              <div className="text-green-400 text-sm">VIE = (AHI)^(1 + 0.5·Gain) × (1 - CCR) × max(0, MEBA)</div>
            </div>

          </GlassPanel>

          {/* Results Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-500/5 border border-orange-500/50 rounded-xl p-8 text-center">
              <div className="font-mono text-xs text-orange-500 uppercase mb-2">VIE_SCORE</div>
              <div className="font-display text-5xl font-bold text-white mb-2">{vieScore.toFixed(2)}</div>
              <div className={cn("font-mono text-sm", status.color)}>{status.text}</div>
              <div className="w-full h-2 bg-black/30 rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500 shadow-[0_0_15px_rgba(255,77,0,0.4)]"
                  style={{ width: `${vieScore * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-orange-500/5 border border-orange-500/50 rounded-xl p-8 text-center">
              <div className="font-mono text-xs text-orange-500 uppercase mb-2">CRI_CERT_VALUE</div>
              <div className="font-display text-5xl font-bold text-white mb-2">{vieScore.toFixed(2)}</div>
              <div className="font-mono text-sm text-gray-400">
                {vieScore >= 0.75 ? 'CERTIFICABLE' : 'AUDITORÍA REQUERIDA'}
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500 shadow-[0_0_15px_rgba(255,77,0,0.4)]"
                  style={{ width: `${vieScore * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center text-xs font-mono text-gray-600 border-t border-white/10 pt-10">
          <p>Ecuación de Simbiosis Soberana DOI: 10.5281/zenodo.17880052</p>
          <p className="mt-2 opacity-50">IMPI 20250494546 | RESEARCH DIVISION</p>
        </footer>
      </div>
    </div>
  );
}
