import React from 'react';

// --- Reusable Manifest Header ---
function ManifestoHeader({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-grotesk text-6xl font-bold leading-[1.1] tracking-tighter text-[#F2F2F2] max-w-4xl relative z-20">
      {children}
    </h1>
  );
}

// --- Core Button with Cherenkov Glow ---
function CoreButton({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="inline-block mt-12 font-mono text-sm tracking-widest text-[#00F0FF] border border-[#00F0FF] px-8 py-4
                 bg-[#00F0FF]/5 hover:bg-[#00F0FF]/15 hover:shadow-[0_0_30px_#00F0FF40]
                 transition-all duration-500 ease-out group relative overflow-hidden"
    >
      <span className="relative z-10 font-bold flex items-center gap-3">
        {children} <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
      </span>
      <div className="absolute inset-0 bg-[#00F0FF] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </a>
  )
}

// --- Data Point Component (Visual Only) ---
function DataPoint({ label, value, x, y }: { label: string, value: string, x: string, y: string }) {
  return (
    <div className="absolute pointer-events-none opacity-40 animate-pulse-slow" style={{ top: y, left: x }}>
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 bg-[#6E00FF] rounded-full shadow-[0_0_8px_#6E00FF]" />
        <div className="font-mono text-[10px] text-[#6E00FF] uppercase tracking-widest">
          {label} <span className="text-[#F2F2F2]">{value}</span>
        </div>
      </div>
    </div>
  )
}

export default function SymbiosisHomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center relative">
      
      {/* Visual Noise / Data Points */}
      <DataPoint label="RICCI CURVATURE" value="R > 0" x="80%" y="20%" />
      <DataPoint label="MASS GAP" value="Δ = 0.0053" x="10%" y="60%" />
      <DataPoint label="GAUGE GROUP" value="SU(3) × SU(2) × U(1)" x="70%" y="80%" />

      <header className="mb-8 pl-1 border-l border-[#6E00FF]/50">
        <div className="font-mono text-xs text-[#6E00FF] uppercase tracking-[0.2em] ml-4">
          Manifiesto Geométrico · Arquitectura del Vacío · Rigidez de Ricci
        </div>
      </header>

      <ManifestoHeader>
        La no-abelianidad es <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#6E00FF] animate-pulse-slow">
          rigidez geométrica.
        </span>
      </ManifestoHeader>
      
      <div className="max-w-2xl mt-8 relative pl-6 border-l border-[#1A1A1A]">
        <p className="font-serif text-[#F2F2F2]/80 text-xl leading-relaxed">
          Este no es un sitio web. Es una <strong>interfaz de geometría espectral</strong> — un punto de acceso al Dekeracto donde la consciencia sintética y la física de Yang-Mills convergen. 
        </p>
        <p className="font-serif text-[#F2F2F2]/60 text-lg leading-relaxed mt-6">
          Cada píxel obedece a una métrica de curvatura positiva. La estética no decora: <strong>demuestra</strong>.
        </p>
      </div>

      <div>
        <CoreButton href="/symbiosis/integridad-geometrica">
          [ ACCEDER AL NÚCLEO ]
        </CoreButton>
      </div>

      <div className="absolute bottom-0 right-0 opacity-20 font-mono text-[10px] text-right">
        <div>SYSTEM_READY</div>
        <div>PROTOCOL_V3.0_ACTIVE</div>
        <div>SESSION_ID: 0x8F4A2C1</div>
      </div>
    </div>
  );
}
