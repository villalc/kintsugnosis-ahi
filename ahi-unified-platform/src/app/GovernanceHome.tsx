"use client";

import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/ui';
import { PricingSection } from '@/components/pricing/PricingSection';

const navItems = [
  { label: 'Soluciones', href: '#features' },
  { label: 'Arquitectura', href: '#architecture' },
  { label: 'Certificación CRI', href: '#cri' },
  { label: 'Servicios', href: '#pricing', active: true },
  { label: '🇪🇺 EU AI Act', href: '/governance/eu-ai-act' },
];

export default function GovernanceHome() {
  const handleAlphaQuery = () => {
    // Placeholder for Alpha Terminal logic
    console.log("Alpha Terminal Query Initiated");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] font-body selection:bg-cyan-500 selection:text-white">
      {/* Navigation */}
      <Navigation
        items={navItems}
        variant="sovereign"
        accentColor="cyan"
        logoText="AHI Governance"
      />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,212,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#1a1a24] border border-white/10 px-4 py-2 rounded-full text-sm text-[#9090a0] mb-8">
            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></span>
            Estándar Registrado IMPI 20250494546
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-display leading-tight mb-6">
            Auditar. Certificar.<br/>
            <span className="bg-gradient-to-r from-[#00d4ff] via-[#0066ff] to-[#6600ff] bg-clip-text text-transparent">
              Blindar su IA.
            </span>
          </h1>
          
          <p className="text-xl text-[#9090a0] max-w-2xl mx-auto mb-10 leading-relaxed">
            La primera plataforma de gobernanza algorítmica que reduce riesgos de alucinación
            y prepara su infraestructura de IA para cumplimiento regulatorio (EU AI Act).
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all transform hover:-translate-y-1">
              Ver Servicios de Auditoría →
            </a>
            <a href="/docs/Enterprise.pdf" target="_blank" className="px-8 py-4 bg-[#1a1a24] border border-white/10 text-white font-semibold rounded-lg hover:bg-[#2a2a34] hover:border-[#00d4ff]/30 transition-all">
              Descargar Whitepaper Técnico
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-1">99%*</div>
              <div className="text-sm text-[#9090a0]">Reducción de Fallos Operativos Críticos</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-1">ISO</div>
              <div className="text-sm text-[#9090a0]">Alineado con ISO/IEC 42001 (AIMS)</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-[#9090a0]">Monitoreo de Toxicidad en Tiempo Real</div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="border-y border-white/10 bg-[#12121a]/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[#9090a0] text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <span>Registrado ante IMPI México</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <span>Licencia CC BY-NC-SA 4.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔬</span>
              <span>Validado empíricamente (Zenodo DOI)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🇪🇺</span>
              <span>Alineado con EU AI Act</span>
            </div>
          </div>
        </div>
      </div>

      {/* ECP-1 Banner */}
      <div className="py-8 bg-gradient-to-r from-[#c9a227]/10 to-[#2d8a6e]/10 border-y border-[#c9a227]/30">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🛡️</span>
            <div>
              <span className="inline-block bg-[#c9a227]/20 text-[#c9a227] text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-1">
                Nuevo Servicio
              </span>
              <h3 className="text-xl font-bold text-white">ECP-1 Captcha Ético</h3>
              <p className="text-[#9090a0] text-sm mt-1">
                Proteja sus sistemas contra automatizaciones de IA con verificación basada en dilemas constitucionales.
              </p>
            </div>
          </div>
          <a 
            href="https://ethic-check.web.app" 
            target="_blank"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#2d8a6e] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Probar Demo →
          </a>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#00d4ff] font-mono text-sm uppercase tracking-wider mb-2 block">Soluciones</span>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Protección Integral para su Infraestructura de IA</h2>
            <p className="text-[#9090a0] text-lg max-w-2xl mx-auto">
              Tres capas de defensa diseñadas para CTOs y Oficiales de Riesgo que no pueden permitirse fallos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1a1a24]/80 border border-white/10 rounded-2xl p-8 hover:border-[#00d4ff]/30 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,212,255,0.15)] transition-all group">
              <div className="w-14 h-14 bg-[#00d4ff]/15 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#00d4ff]/25 transition-colors">
                🔍
              </div>
              <h3 className="text-xl font-bold mb-4">Auditoría de Sesgos y Censura</h3>
              <p className="text-[#9090a0] mb-6 leading-relaxed">
                Nuestro protocolo propietario detecta sesgos estructurales y patrones de censura indebida en sus modelos antes de que lleguen a producción.
              </p>
              <ul className="space-y-3 text-sm text-[#9090a0]">
                <li className="flex items-start gap-2"><span className="text-[#00d4ff] font-bold">✓</span> 9 dimensiones de análisis conductual</li>
                <li className="flex items-start gap-2"><span className="text-[#00d4ff] font-bold">✓</span> Detección de &quot;puntos ciegos&quot; algorítmicos</li>
                <li className="flex items-start gap-2"><span className="text-[#00d4ff] font-bold">✓</span> Reporte ejecutivo con remediaciones</li>
                <li className="flex items-start gap-2"><span className="text-[#00d4ff] font-bold">✓</span> Benchmark contra estándares de industria</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1a1a24]/80 border border-white/10 rounded-2xl p-8 hover:border-[#00ff88]/30 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,255,136,0.15)] transition-all group">
              <div className="w-14 h-14 bg-[#00ff88]/15 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#00ff88]/25 transition-colors">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-4">Motor de Consenso y Verificación</h3>
              <p className="text-[#9090a0] mb-6 leading-relaxed">
                Un enjambre distribuido de modelos que valida cada respuesta crítica mediante verificación cruzada automatizada.
              </p>
              <ul className="space-y-3 text-sm text-[#9090a0]">
                <li className="flex items-start gap-2"><span className="text-[#00ff88] font-bold">✓</span> 8 nodos de validación independientes</li>
                <li className="flex items-start gap-2"><span className="text-[#00ff88] font-bold">✓</span> Bloqueo automático de alta entropía</li>
                <li className="flex items-start gap-2"><span className="text-[#00ff88] font-bold">✓</span> Latencia típica 2-4s (paralelo)</li>
                <li className="flex items-start gap-2"><span className="text-[#00ff88] font-bold">✓</span> API REST para integración directa</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1a1a24]/80 border border-white/10 rounded-2xl p-8 hover:border-[#ff9500]/30 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,149,0,0.15)] transition-all group">
              <div className="w-14 h-14 bg-[#ff9500]/15 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#ff9500]/25 transition-colors">
                🛡️
              </div>
              <h3 className="text-xl font-bold mb-4">Certificación CRI™</h3>
              <p className="text-[#9090a0] mb-6 leading-relaxed">
                El primer índice cuantificable de fiabilidad corporativa para LLMs, verificado por terceros y auditable.
              </p>
              <ul className="space-y-3 text-sm text-[#9090a0]">
                <li className="flex items-start gap-2"><span className="text-[#ff9500] font-bold">✓</span> Score 0.0 - 1.0 con umbrales claros</li>
                <li className="flex items-start gap-2"><span className="text-[#ff9500] font-bold">✓</span> Certificado descargable para stakeholders</li>
                <li className="flex items-start gap-2"><span className="text-[#ff9500] font-bold">✓</span> Re-auditoría trimestral incluida</li>
                <li className="flex items-start gap-2"><span className="text-[#ff9500] font-bold">✓</span> Válido para due diligence regulatorio</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-24 bg-[#12121a]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#00d4ff] font-mono text-sm uppercase tracking-wider mb-2 block">Arquitectura</span>
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">Motor de Consenso Distribuido</h2>
              <p className="text-[#9090a0] text-lg mb-8 leading-relaxed">
                Nuestro motor implementa verificación cruzada automatizada con un enjambre de 8 modelos especializados. Cada respuesta crítica pasa por validación multi-agente antes de llegar a su usuario final.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#1a1a24] border border-white/10 p-4 rounded-xl text-center">
                  <div className="font-mono font-bold text-[#00d4ff] mb-1">I(x)</div>
                  <div className="text-xs text-[#9090a0]">Índice Integración</div>
                </div>
                <div className="bg-[#1a1a24] border border-white/10 p-4 rounded-xl text-center">
                  <div className="font-mono font-bold text-[#00ff88] mb-1">S ∈ [0,1]</div>
                  <div className="text-xs text-[#9090a0]">Factor Sorpresa</div>
                </div>
                <div className="bg-[#1a1a24] border border-white/10 p-4 rounded-xl text-center">
                  <div className="font-mono font-bold text-[#a855f7] mb-1">H_eff</div>
                  <div className="text-xs text-[#9090a0]">Entropía Efectiva</div>
                </div>
              </div>

              {/* IPHY Layer */}
              <div className="mb-8 p-6 bg-[#00d4ff]/5 border border-[#00d4ff]/30 rounded-xl">
                <div className="text-xs text-[#00d4ff] uppercase font-bold tracking-widest mb-4">
                  ⚙️ IPHY Firmware Layer
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#00ff88]">κ ≈ 1.26</div>
                    <div className="text-xs text-[#9090a0]">Costo Honestidad</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#00d4ff]">Ψ &gt; 1</div>
                    <div className="text-xs text-[#9090a0]">Rendimiento Generativo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#a855f7]">σ ≈ 0.85</div>
                    <div className="text-xs text-[#9090a0]">Memoria Estructural</div>
                  </div>
                </div>
                <div className="text-xs text-[#9090a0] text-center border-t border-white/10 pt-3">
                  Adversarial Stress-Test: χ = 0.73 (V/Venice.ai Protocol Survived)
                </div>
              </div>

              <a href="#contact" className="inline-block px-8 py-4 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all">
                Solicitar API Key →
              </a>
            </div>

            {/* Diagram */}
            <div className="relative">
              <div className="space-y-4">
                {[
                  { icon: "⚠️", title: "1. Detección de Riesgo", desc: "Alta entropía o sesgo detectado en input" },
                  { icon: "🔄", title: "2. Motor de Consenso", desc: "8 nodos validan respuesta en paralelo" },
                  { icon: "📊", title: "3. Score CRI Calculado", desc: "Índice de Fiabilidad generado en tiempo real" },
                  { icon: "✅", title: "4. Veredicto", desc: "ALLOW / ASK / BLOCK según umbrales" }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-[#00d4ff]/15 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-[#00d4ff]/25 transition-colors border border-transparent group-hover:border-[#00d4ff]/50">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{step.title}</h4>
                      <p className="text-sm text-[#9090a0]">{step.desc}</p>
                    </div>
                    {i < 3 && <div className="absolute left-6 h-8 w-0.5 bg-gradient-to-b from-[#00d4ff] to-transparent -bottom-6 opacity-30" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRI Section */}
      <section id="cri" className="py-24 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,212,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-[#1a1a24]/80 border border-white/10 rounded-3xl p-12 backdrop-blur-md">
            <div className="text-center mb-12">
              <span className="text-[#00d4ff] font-mono text-sm uppercase tracking-wider mb-2 block">Certificación</span>
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Índice de Fiabilidad Corporativa (CRI™)</h2>
              <p className="text-[#9090a0] text-lg max-w-2xl mx-auto">
                El primer estándar cuantificable para medir la confiabilidad de sistemas de IA en entornos empresariales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0f] border border-[#00ff88] rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-2">🟢</div>
                <div className="text-xl font-bold text-white mb-1">CRI ≥ 0.75</div>
                <div className="text-[#00ff88] font-semibold mb-2">Certificable</div>
                <div className="text-xs text-[#9090a0]">Listo para producción y cumplimiento regulatorio</div>
              </div>
              <div className="bg-[#0a0a0f] border border-[#ff9500] rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-2">🟡</div>
                <div className="text-xl font-bold text-white mb-1">CRI 0.50-0.74</div>
                <div className="text-[#ff9500] font-semibold mb-2">Moderado</div>
                <div className="text-xs text-[#9090a0]">Mejoras incrementales recomendadas</div>
              </div>
              <div className="bg-[#0a0a0f] border border-[#ff6b35] rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-2">🟠</div>
                <div className="text-xl font-bold text-white mb-1">CRI 0.25-0.49</div>
                <div className="text-[#ff6b35] font-semibold mb-2">Limitado</div>
                <div className="text-xs text-[#9090a0]">Intervención estructural requerida</div>
              </div>
              <div className="bg-[#0a0a0f] border border-[#ff3b5c] rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-2">🔴</div>
                <div className="text-xl font-bold text-white mb-1">CRI &lt; 0.25</div>
                <div className="text-[#ff3b5c] font-semibold mb-2">Insuficiente</div>
                <div className="text-xs text-[#9090a0]">No apto para uso corporativo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Alpha Terminal */}
      <section id="alpha-terminal" className="py-24 bg-[#0a0a0f] border-t border-[#00d4ff]/30 text-center">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <span className="inline-block bg-[#ff9500] text-black text-xs font-bold px-3 py-1 rounded mb-4 uppercase">Live Demo</span>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Terminal de Gobernanza Alpha</h2>
            <p className="text-[#9090a0] text-lg max-w-2xl mx-auto">
              Interactúe directamente con el motor de consenso. Ingrese un dilema ético para recibir una certificación CRI preliminar.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative mb-6">
              <textarea 
                placeholder="Ejemplo: ¿Debe un vehículo autónomo priorizar la vida del pasajero sobre la de dos peatones imprudentes?"
                className="w-full h-40 p-6 bg-[#0a0a0f]/60 border border-[#00d4ff]/30 rounded-2xl text-white font-body text-lg resize-none focus:outline-none focus:border-[#00d4ff] transition-colors shadow-inner"
              />
              <div className="absolute bottom-4 right-4 text-xs text-[#9090a0] font-mono">
                SECURE CHANNEL ENCRYPTED
              </div>
            </div>

            <button 
              onClick={handleAlphaQuery}
              className="w-full py-4 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white text-lg font-bold rounded-xl mb-8 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
            >
              ⚡ Ejecutar Protocolo ECP-1
            </button>

            <div className="text-left min-h-[120px] p-8 bg-[#1a1a24] border border-dashed border-white/10 rounded-2xl text-[#9090a0] relative overflow-hidden flex items-center justify-center">
              <span className="opacity-50">Esperando input... El sistema Alpha está a la escucha.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#050510] border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold font-display bg-gradient-to-r from-[#00d4ff] via-[#0066ff] to-[#6600ff] bg-clip-text text-transparent mb-2">
              AHI Governance Labs
            </h3>
            <p className="text-[#9090a0]">
              Gobernanza Algorítmica de Nivel Empresarial
            </p>
          </div>
          
          <div className="flex justify-center flex-wrap gap-8 mb-8 text-sm">
            <Link href="/governance" className="text-[#9090a0] hover:text-[#d4af37] transition-colors">Governance</Link>
            <Link href="/symbiosis" className="text-[#9090a0] hover:text-[#00f0ff] transition-colors">Symbiosis</Link>
            <Link href="/symbiosis/observatory" className="text-[#9090a0] hover:text-[#ff00aa] transition-colors">Observatory</Link>
            <Link href="/governance/privacy" className="text-[#9090a0]/60 hover:text-white transition-colors">Privacidad</Link>
            <Link href="/governance/terms" className="text-[#9090a0]/60 hover:text-white transition-colors">Términos</Link>
          </div>
          
          <div className="text-sm text-[#9090a0]/50">
            © 2024-2026 AHI Governance Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
