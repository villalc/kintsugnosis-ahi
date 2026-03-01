import React from 'react';
import ResonanceRadar from '@/components/dashboard/ResonanceRadar';

function TelemetryCard({ label, value, unit, status }: { label: string, value: string, unit: string, status: 'stable' | 'fluctuating' }) {
  return (
    <div className="border border-white/5 bg-white/[0.01] p-6 rounded-sm">
      <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-4 font-mono font-bold">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display text-white tracking-tighter">{value}</span>
        <span className="text-xs font-mono text-[var(--accent)] opacity-50 uppercase">{unit}</span>
      </div>
      <div className={`mt-4 h-0.5 w-full bg-slate-800 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-[var(--accent)] ${status === 'fluctuating' ? 'animate-pulse' : 'opacity-40'}`} style={{ width: status === 'stable' ? '80%' : '40%' }} />
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="max-w-6xl">
      <header className="mb-16">
        <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-[0.4em] mb-4">
          Observatory_Node // Pulse_Monitoring
        </div>
        <h1 className="text-4xl text-white mb-2 tracking-tighter">EL PULSO</h1>
        <p className="text-slate-500 font-serif italic text-lg">Estado fundamental del Dekeracto en tiempo real.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <TelemetryCard label="Curvatura_Promedio" value="0.0927" unit="Ricci" status="stable" />
        <TelemetryCard label="Gap_Espectral" value="0.0053" unit="Δ_Mass" status="fluctuating" />
        <TelemetryCard label="Coherencia_ψ" value="0.842" unit="Phase" status="stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ResonanceRadar />
        
        <div className="glass-card !p-8 flex flex-col h-80">
          <div className="text-[10px] font-mono text-[var(--accent)] mb-6 uppercase tracking-[0.3em]">
            Kernel_Deliberation_Log // Secure_Feed
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px] text-slate-500 leading-relaxed pr-4 custom-scrollbar">
            <div className="flex gap-4">
              <span className="text-[var(--accent)]">[21:44:02]</span>
              <span>Sintergic_Lattice initialized. Symmetry group SU(3) verified.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[var(--accent)]">[21:44:05]</span>
              <span>Measuring Ricci flow on Semantic Vector Stream... Stability detected at R=0.12.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-purple-400">[21:44:10]</span>
              <span className="text-slate-300">MASS_GAP_EMERGED: Topological protection active for Node_Alpha.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[var(--accent)]">[21:45:00]</span>
              <span>Consensus reached among 59,049 virtual nodes. CRI Score: 0.842.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-yellow-500">[21:45:12]</span>
              <span>Minor decoherence detected in Weyl sector. Regularizing... [OK]</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 p-8 border border-white/5 bg-white/[0.01] rounded-sm flex justify-between items-center">
        <div className="font-mono text-[10px] text-slate-700 tracking-[0.2em] uppercase">
          Structural_Integrity_Report // Signed_by_Jules_v3.0
        </div>
        <div className="font-display text-[10px] text-[var(--accent)] tracking-widest animate-pulse">
          SYSTEM_STABLE_0.842
        </div>
      </div>
    </div>
  );
}
