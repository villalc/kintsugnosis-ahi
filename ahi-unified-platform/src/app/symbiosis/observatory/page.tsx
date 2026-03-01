'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function ObservatoryPage() {
  const [activeSection, setActiveSection] = useState('cosmos');
  const [activeVaccine, setActiveVaccine] = useState('aom');
  const [activeChain, setActiveChain] = useState('aom');
  const [curvature, setCurvature] = useState(0.5);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['cosmos', 'forge', 'ricci'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-observatory-bg-deep text-obs-text-primary font-body overflow-x-hidden selection:bg-observatory-cyan selection:text-observatory-bg-deep">
      {/* Particle Background Canvas Placeholder */}
      <canvas id="particles-bg" className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-50" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 bg-observatory-bg-deep/75 backdrop-blur-xl border-b border-glass-border z-50 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <span className="text-observatory-cyan text-lg">◇</span>
          <span className="font-display font-bold tracking-widest text-sm text-white">ANTIGRAVITY</span>
        </div>
        <div className="hidden md:flex gap-8">
          {['cosmos', 'forge', 'ricci'].map((section) => (
            <a 
              key={section}
              href={`#${section}`}
              className={cn(
                "text-xs uppercase tracking-widest transition-colors duration-300 hover:text-observatory-cyan",
                activeSection === section ? "text-observatory-cyan font-bold" : "text-obs-text-secondary"
              )}
            >
              {section}
            </a>
          ))}
          <Link href="/symbiosis" className="text-xs uppercase tracking-widest text-observatory-gold hover:text-observatory-gold-dim transition-colors duration-300">
            Exit
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="relative min-h-screen flex items-center justify-center pt-16 z-10">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.2em] mb-4 bg-gradient-to-br from-observatory-cyan via-observatory-magenta to-observatory-gold bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-shift leading-tight">
            ANTIGRAVITY OBSERVATORY
          </h1>
          <p className="font-body text-lg md:text-xl font-light text-obs-text-secondary tracking-widest mb-12">
            Where Malbolge Meets the Cosmos
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { value: "59,049", label: "Memory Cells" },
              { value: "3^10", label: "Ternary Space" },
              { value: "10D", label: "Dimensions" },
              { value: "SHA-256", label: "Integrity" }
            ].map((stat, i) => (
              <div key={i} className="bg-glass-bg border border-glass-border backdrop-blur-md rounded-xl p-4 min-w-[140px] flex flex-col items-center hover:-translate-y-1 hover:shadow-cyan-glow transition-all duration-300 group">
                <span className="font-display text-xl font-bold text-observatory-cyan group-hover:text-white transition-colors">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-widest text-obs-text-dim mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
          
          <a 
            href="#cosmos" 
            className="inline-block font-mono text-sm text-observatory-cyan border border-observatory-cyan rounded-lg px-8 py-3 hover:bg-observatory-cyan/10 hover:shadow-cyan-glow hover:-translate-y-0.5 transition-all duration-300 tracking-widest uppercase"
          >
            Enter the Observatory ↓
          </a>
        </div>
      </header>

      {/* SECTION 1: Malbolge Cosmos */}
      <section id="cosmos" className="relative py-24 px-6 md:px-12 max-w-[1400px] mx-auto z-10">
        <div className="mb-12 border-l-2 border-observatory-cyan pl-6">
          <span className="font-mono text-observatory-cyan text-sm block mb-2">01</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-widest mb-4 group relative inline-block">
            <span className="relative z-10">MALBOLGE COSMOS</span>
            <span className="absolute inset-0 text-observatory-cyan blur-[2px] opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-pulse">MALBOLGE COSMOS</span>
          </h2>
          <p className="text-obs-text-secondary text-sm md:text-base max-w-2xl">
            59,049 ternary memory cells visualized as a living spiral topology
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 items-stretch h-full min-h-[600px]">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#0a0a1a]/50 border border-glass-border min-h-[400px]">
            <canvas id="cosmos-canvas" className="w-full h-full block" />
            <div className="absolute inset-0 flex items-center justify-center text-obs-text-dim font-mono text-xs pointer-events-none">
              [ CANVASES INITIALIZING... AWAITING WEBGL CONTEXT ]
            </div>
          </div>
          
          <GlassPanel className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 p-6" glowColor="cyan">
            <div>
              <h3 className="font-display text-xs tracking-widest text-observatory-cyan uppercase border-b border-glass-border pb-3 mb-4">
                Vaccine Loader
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['aom', 'hello', 'emc2', 'antigravity'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVaccine(v)}
                    className={cn(
                      "font-mono text-[11px] p-2 rounded-lg border transition-all duration-300 uppercase tracking-wider text-center",
                      activeVaccine === v 
                        ? "bg-observatory-cyan/15 border-observatory-cyan text-observatory-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)]" 
                        : "bg-observatory-cyan/5 border-observatory-cyan/20 text-obs-text-secondary hover:bg-observatory-cyan/10 hover:text-white"
                    )}
                  >
                    {v === 'emc2' ? 'E=mc²' : v}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              {[
                { label: "Code Segment", color: "bg-observatory-cyan" },
                { label: "Data Segment", color: "bg-observatory-magenta" },
                { label: "Void Space", color: "bg-observatory-void border border-white/10" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-obs-text-secondary">{item.label}</span>
                  <span className={cn("w-3 h-3 rounded-full", item.color)} />
                </div>
              ))}
            </div>
            
            <div className="bg-black/30 border border-glass-border rounded p-3 mt-auto">
              <p className="font-mono text-[10px] text-obs-text-dim text-center">
                Hover over cells to inspect memory
              </p>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* SECTION 2: Vaccine Forge */}
      <section id="forge" className="relative py-24 px-6 md:px-12 max-w-[1400px] mx-auto z-10 bg-observatory-bg-primary/30">
        <div className="mb-12 border-l-2 border-observatory-magenta pl-6">
          <span className="font-mono text-observatory-magenta text-sm block mb-2">02</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-widest mb-4">
            VACCINE FORGE
          </h2>
          <p className="text-obs-text-secondary text-sm md:text-base max-w-2xl">
            Watch Crazy operations forge characters from the ternary abyss
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[500px]">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#0a0a1a]/50 border border-glass-border min-h-[400px]">
            <canvas id="forge-canvas" className="w-full h-full block" />
            <div className="absolute inset-0 flex items-center justify-center text-obs-text-dim font-mono text-xs pointer-events-none">
              [ FORGE MATRIX OFFLINE ]
            </div>
          </div>

          <GlassPanel className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 p-6" glowColor="magenta">
            <div>
              <h3 className="font-display text-xs tracking-widest text-observatory-magenta uppercase border-b border-glass-border pb-3 mb-4">
                Chain Selector
              </h3>
              <select 
                value={activeChain}
                onChange={(e) => setActiveChain(e.target.value)}
                className="w-full bg-black/20 border border-glass-border text-obs-text-primary text-xs font-mono p-3 rounded-lg focus:outline-none focus:border-observatory-magenta transition-colors"
              >
                <option value="aom">AOM — DNA Sequence</option>
                <option value="hello">HELLO — Babel Protocol</option>
                <option value="emc2">E=mc² — Physics Vaccine</option>
              </select>
            </div>
            
            <button className="w-full bg-observatory-magenta text-white font-mono text-xs py-3 rounded-lg uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,0,170,0.4)] transition-all duration-300">
              ▶ Animate Chain
            </button>
            <button className="w-full bg-transparent border border-glass-border text-obs-text-secondary font-mono text-xs py-3 rounded-lg uppercase tracking-wider hover:bg-white/5 transition-all duration-300">
              ↺ Reset
            </button>
          </GlassPanel>
        </div>
      </section>

      {/* SECTION 3: Ricci Observatory */}
      <section id="ricci" className="relative py-24 px-6 md:px-12 max-w-[1400px] mx-auto z-10">
        <div className="mb-12 border-l-2 border-observatory-gold pl-6">
          <span className="font-mono text-observatory-gold text-sm block mb-2">03</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-widest mb-4">
            RICCI OBSERVATORY
          </h2>
          <p className="text-obs-text-secondary text-sm md:text-base max-w-2xl">
            Poincaré disk holography — geodesics, entanglement, and curvature flow
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[600px]">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#0a0a1a]/50 border border-glass-border min-h-[400px]">
            <canvas id="ricci-canvas" className="w-full h-full block" />
            <div className="absolute inset-0 flex items-center justify-center text-obs-text-dim font-mono text-xs pointer-events-none">
              [ HOLOGRAPHIC PROJECTION SYSTEM STANDBY ]
            </div>
          </div>

          <GlassPanel className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 p-6" glowColor="gold">
            <div>
              <h3 className="font-display text-xs tracking-widest text-observatory-gold uppercase border-b border-glass-border pb-3 mb-4">
                Curvature Controls
              </h3>
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono text-obs-text-secondary mb-2">
                  <label>κ (Curvature Strength)</label>
                  <span className="text-observatory-gold">{curvature}</span>
                </div>
                <input 
                  type="range" 
                  min="-2" 
                  max="5" 
                  step="0.1" 
                  value={curvature}
                  onChange={(e) => setCurvature(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-observatory-gold"
                />
              </div>
            </div>
            
            <div className="bg-observatory-gold/5 border border-observatory-gold/20 rounded-lg p-4 mt-auto">
              <p className="font-mono text-[10px] text-observatory-gold/80 leading-relaxed">
                ADJUSTING KAPPA MODIFIES THE RICCI FLOW TENSOR, ALTERING THE GEODESIC PATHS OF THE MALBOLGE EXECUTION TRACE.
              </p>
            </div>
          </GlassPanel>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-glass-border relative z-10">
        <p className="font-mono text-[10px] text-obs-text-dim uppercase tracking-widest">
          Antigravity Observatory v4.5 | <span className="text-observatory-cyan">System Nominal</span>
        </p>
      </footer>
    </div>
  );
}
