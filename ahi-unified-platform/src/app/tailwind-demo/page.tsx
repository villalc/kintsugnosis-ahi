/**
 * Página de Ejemplo - Todos los Componentes Tailwind
 * Demuestra la integración completa de todos los componentes migrados
 * Basado en los diseños originales de Sovereign Symbiosis y Observatory
 */

import React from 'react';
import { cn } from '@/lib/utils';
import HeroSection from '@/components/ui/HeroSection';
import Navigation from '@/components/ui/Navigation';
import ArchitectureGrid, { ArchitectureGridExample } from '@/components/ui/ArchitectureGrid';
import GlassPanel, { GlassPanelTitle, GlassPanelContent, GlassPanelTags } from '@/components/ui/GlassPanel';

const navItems = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Observatory', href: '#observatory' },
  { label: 'Governance', href: '#governance' },
  { label: 'Symbiosis', href: '#symbiosis' }
];

const sampleCards = [
  {
    title: "Quantum Core",
    description: "Advanced quantum computing infrastructure for cryptographic operations and secure communications.",
    tags: ["Quantum", "Crypto", "Security"],
    icon: "⚛️",
    color: "cyan" as const,
    link: "/quantum"
  },
  {
    title: "Neural Networks",
    description: "Distributed AI systems with self-organizing capabilities for autonomous decision making.",
    tags: ["AI", "Neural", "Autonomous"],
    icon: "🧠",
    color: "magenta" as const,
    link: "/neural"
  },
  {
    title: "Blockchain Fabric",
    description: "Interconnected blockchain networks providing immutable data storage and verification.",
    tags: ["Blockchain", "Immutable", "Verification"],
    icon: "🔗",
    color: "gold" as const,
    link: "/blockchain"
  }
];

export default function TailwindComponentsDemo() {
  return (
    <div className="min-h-screen bg-void text-main">
      {/* Navigation */}
      <Navigation
        items={navItems}
        variant="observatory"
        accentColor="cyan"
        logoText="AHI"
      />

      {/* Hero Section */}
      <HeroSection
        title="AHI Unified Platform"
        subtitle="Digital Sovereignty Architecture"
        description="Next-generation infrastructure for autonomous digital ecosystems. Quantum-powered, blockchain-secured, AI-enhanced."
        ctaText="Explore Architecture"
        variant="observatory"
        scrollToId="architecture"
      />

      {/* Architecture Grid Section */}
      <section id="architecture" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-gradient-hero mb-4">
              Digital Architecture
            </h2>
            <p className="text-lg md:text-xl text-main/70 max-w-3xl mx-auto leading-relaxed">
              Next-generation infrastructure components powering the sovereign digital ecosystem
            </p>
          </div>

          <div className="grid grid-cols-arch-grid gap-8">
            {sampleCards.map((card, index) => (
              <a key={index} href={card.link} className="group">
                <GlassPanel
                  variant="neon"
                  glowColor={card.color}
                  padding="lg"
                  hover={true}
                  className="h-full transition-all duration-400 group-hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
                    `bg-${card.color}/20 text-${card.color}`
                  )}>
                    <span className="text-2xl">{card.icon}</span>
                  </div>

                  {/* Title */}
                  <GlassPanelTitle color={card.color}>
                    {card.title}
                  </GlassPanelTitle>

                  {/* Description */}
                  <GlassPanelContent>
                    {card.description}
                  </GlassPanelContent>

                  {/* Tags */}
                  <GlassPanelTags tags={card.tags} color={card.color} />

                  {/* Link indicator */}
                  <div className={cn(
                    "mt-4 text-sm font-medium flex items-center",
                    `text-${card.color} group-hover:text-${card.color}-dim transition-colors`
                  )}>
                    Learn more
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </GlassPanel>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Glass Panels Demo Section */}
      <section className="py-24 md:py-32 bg-observatory-bg-deep">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-gradient-hero mb-4">
              Glassmorphism Components
            </h2>
            <p className="text-lg md:text-xl text-main/70 max-w-3xl mx-auto leading-relaxed">
              Modern glass panels with neon accents and hover effects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Default Glass Panel */}
            <GlassPanel variant="default" glowColor="cyan">
              <GlassPanelTitle color="cyan">Default Panel</GlassPanelTitle>
              <GlassPanelContent>
                Standard glass panel with cyan accent and subtle hover effects.
              </GlassPanelContent>
              <GlassPanelTags tags={["Default", "Glass"]} color="cyan" />
            </GlassPanel>

            {/* Neon Glass Panel */}
            <GlassPanel variant="neon" glowColor="magenta">
              <GlassPanelTitle color="magenta">Neon Panel</GlassPanelTitle>
              <GlassPanelContent>
                Vibrant neon panel with magenta glow and enhanced visual effects.
              </GlassPanelContent>
              <GlassPanelTags tags={["Neon", "Glow"]} color="magenta" />
            </GlassPanel>

            {/* Subtle Glass Panel */}
            <GlassPanel variant="subtle">
              <GlassPanelTitle color="cyan">Subtle Panel</GlassPanelTitle>
              <GlassPanelContent>
                Minimal glass panel with subtle transparency and clean design.
              </GlassPanelContent>
              <GlassPanelTags tags={["Subtle", "Clean"]} color="cyan" />
            </GlassPanel>

            {/* Dark Glass Panel */}
            <GlassPanel variant="dark" glowColor="gold">
              <GlassPanelTitle color="gold">Dark Panel</GlassPanelTitle>
              <GlassPanelContent>
                Dark-themed glass panel with gold accents for premium feel.
              </GlassPanelContent>
              <GlassPanelTags tags={["Dark", "Premium"]} color="gold" />
            </GlassPanel>

            {/* Green Glass Panel */}
            <GlassPanel variant="neon" glowColor="green">
              <GlassPanelTitle color="green">Green Panel</GlassPanelTitle>
              <GlassPanelContent>
                Eco-friendly green panel with natural, sustainable design vibes.
              </GlassPanelContent>
              <GlassPanelTags tags={["Green", "Eco"]} color="green" />
            </GlassPanel>

            {/* Purple Glass Panel */}
            <GlassPanel variant="neon" glowColor="purple">
              <GlassPanelTitle color="purple">Purple Panel</GlassPanelTitle>
              <GlassPanelContent>
                Mystical purple panel with creative and innovative energy.
              </GlassPanelContent>
              <GlassPanelTags tags={["Purple", "Creative"]} color="purple" />
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Typography Demo Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-gradient-hero mb-4">
              Typography System
            </h2>
            <p className="text-lg md:text-xl text-main/70 max-w-3xl mx-auto leading-relaxed">
              Complete typography system with all font families and weights
            </p>
          </div>

          <div className="space-y-12">
            {/* Display Font */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6 text-accent">Display Font (Orbitron)</h3>
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black font-display text-gradient-hero">
                  Display Black
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold font-display text-observatory-cyan">
                  Display Bold
                </h2>
                <h3 className="text-2xl md:text-4xl font-normal font-display text-observatory-magenta">
                  Display Normal
                </h3>
              </div>
            </div>

            {/* Body Font */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6 text-accent">Body Font (Inter)</h3>
              <div className="space-y-4 max-w-3xl mx-auto">
                <p className="text-lg font-light font-body text-main/90">
                  Light body text for elegant and readable content.
                </p>
                <p className="text-lg font-normal font-body text-main">
                  Normal body text for standard paragraph content.
                </p>
                <p className="text-lg font-semibold font-body text-main">
                  Semibold body text for emphasis and importance.
                </p>
              </div>
            </div>

            {/* Mono Font */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6 text-accent">Mono Font (JetBrains Mono)</h3>
              <div className="max-w-3xl mx-auto">
                <div className="glass-panel border-glass p-6 rounded-lg text-left">
                  <code className="font-mono text-sm text-observatory-cyan">
                    const quantumState = superposition.qubit();<br />
                    quantumState.entangle(cryptoKey);<br />
                    return quantumState.measure();
                  </code>
                </div>
              </div>
            </div>

            {/* Serif Font */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6 text-accent">Serif Font (Cormorant Garamond)</h3>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl font-serif italic text-observatory-gold leading-relaxed">
                  &quot;In the realm of digital sovereignty, we craft the architecture of tomorrow&apos;s autonomous systems.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-observatory-bg-deep border-t border-glass">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold font-display text-gradient-hero mb-2">
              AHI Unified Platform
            </h3>
            <p className="text-main/70">
              Digital Sovereignty Architecture • Quantum-Powered • Blockchain-Secured
            </p>
          </div>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-main/70 hover:text-observatory-cyan transition-colors">
              Architecture
            </a>
            <a href="#" className="text-main/70 hover:text-observatory-cyan transition-colors">
              Observatory
            </a>
            <a href="#" className="text-main/70 hover:text-observatory-cyan transition-colors">
              Governance
            </a>
            <a href="#" className="text-main/70 hover:text-observatory-cyan transition-colors">
              Symbiosis
            </a>
          </div>
          
          <div className="text-sm text-main/50">
            © 2024 AHI Governance Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}