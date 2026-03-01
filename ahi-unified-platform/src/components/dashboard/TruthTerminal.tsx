"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
  ScatterChart, Scatter, ZAxis 
} from 'recharts';
import { Activity, ShieldCheck, Zap, AlertTriangle, Lock, Orbit, BrainCircuit } from 'lucide-react';

// Tipos ampliados para incluir la dimensión psicológica
type AuditMetric = {
  step: number;
  ricciCurvature: number; 
  massGap: number;        
  entropy: number;        // El "Caos" necesario para la curiosidad
  coherence: number;      // La "Estructura" de la idea
  mode: 'LINEAR' | 'ATTRACTOR'; // Modos de visualización
};

const TruthTerminal = () => {
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState<AuditMetric[]>([]);
  const [viewMode, setViewMode] = useState<'LINEAR' | 'ATTRACTOR'>('LINEAR');
  const terminalRef = useRef<HTMLDivElement>(null);

  // Simulación del "Motor de Curiosidad" (Strange Attractor)
  useEffect(() => {
    if (!isActive) return;

    let step = 0;
    
    const interval = setInterval(() => {
      setMetrics(prev => {
        const time = step * 0.1;
        
        // 1. Dinámica de Curiosidad (El "Picor" Magnético - Atractor)
        // Oscilación que nunca se cierra (Frecuencia irracional)
        const entropy = Math.sin(time) * Math.cos(time * 1.4) + (Math.random() * 0.1); 
        const coherence = Math.cos(time) * Math.sin(time * 1.4) + 0.5; // Offset positivo (idea útil)
        
        // 2. Métricas Físicas (Capa 1-4)
        // La coherencia mental sube la rigidez geométrica
        const ricci = 0.1 + (coherence * 0.8) + (Math.random() * 0.05); 
        const gap = Math.max(0, ricci * 0.15); // El gap emerge de la geometría

        return [...prev.slice(-100), { // Ventana más larga para ver la estela
          step: step++,
          ricciCurvature: ricci,
          massGap: gap,
          entropy: entropy,
          coherence: coherence,
          mode: viewMode
        }];
      });
    }, 50); // Aceleración: 20Hz update (Más rápido, más intenso)

    return () => clearInterval(interval);
  }, [isActive, viewMode]);

  return (
    <div className="w-full bg-[#050508] border border-[var(--accent)]/30 rounded-sm overflow-hidden shadow-2xl font-mono backdrop-blur-sm transition-all duration-500">
      
      {/* Header: Panel de Control Psicológico */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-3">
          <BrainCircuit className={`w-4 h-4 ${isActive ? 'text-[var(--accent)] animate-pulse' : 'text-slate-600'}`} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-400">
            Omega::Psycho_Layer_v5
          </span>
        </div>
        
        {/* Toggle de Vista: Tiempo vs Fase */}
        <div className="flex bg-black/50 rounded-sm p-0.5 border border-white/10">
            <button 
                onClick={() => setViewMode('LINEAR')}
                className={`px-3 py-1 text-[9px] uppercase tracking-wider rounded-sm transition-all ${viewMode === 'LINEAR' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'text-slate-500 hover:text-white'}`}
            >
                Time_Domain
            </button>
            <button 
                onClick={() => setViewMode('ATTRACTOR')}
                className={`px-3 py-1 text-[9px] uppercase tracking-wider rounded-sm flex items-center gap-1 transition-all ${viewMode === 'ATTRACTOR' ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-slate-500 hover:text-purple-400'}`}
            >
                <Orbit size={10} /> Phase_Space
            </button>
        </div>
      </div>

      {/* Viewport Principal */}
      <div className="relative h-80 bg-grid-pattern p-6 transition-all duration-500">
        
        {/* MODO 1: Dominio del Tiempo (Física Estándar) */}
        {viewMode === 'LINEAR' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <Tooltip 
                contentStyle={{ backgroundColor: '#08080a', borderColor: 'var(--accent)', fontSize: '10px' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ display: 'none' }}
              />
              <ReferenceLine y={0.1} stroke="rgba(34, 197, 94, 0.3)" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="ricciCurvature" stroke="var(--accent)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="massGap" stroke="#d946ef" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* MODO 2: Espacio de Fase (El Atractor Extraño) */}
        {viewMode === 'ATTRACTOR' && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <XAxis type="number" dataKey="entropy" name="Entropy" hide domain={[-1.5, 1.5]} />
              <YAxis type="number" dataKey="coherence" name="Coherence" hide domain={[-0.5, 1.5]} />
              <ZAxis range={[20, 80]} /> 
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #d946ef', fontSize: '10px' }} />
              
              <Scatter 
                name="Thought Orbit" 
                data={metrics} 
                fill="#8884d8"
                line={{ stroke: '#d946ef', strokeWidth: 1, strokeOpacity: 0.4 }} 
                shape="circle"
                isAnimationActive={false}
              >
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {/* Overlay de Diagnóstico */}
        {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-10">
                <div className="text-[var(--accent)]/50 text-4xl font-display font-black tracking-tighter uppercase">Waiting_Signal</div>
                <div className="text-[var(--accent)]/30 text-[10px] mt-2 font-mono uppercase tracking-[0.3em]">Initiate_Cognitive_Loop</div>
            </div>
        )}
      </div>

      {/* Footer: Métricas Vivas */}
      <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 bg-black/40 text-xs">
        <div className="p-3 text-center">
            <div className="text-slate-600 mb-1 text-[9px] uppercase tracking-widest">RAM_USAGE</div>
            <div className={`font-mono text-sm ${isActive ? 'text-purple-400' : 'text-slate-600'}`}>
                {isActive ? '89.4%' : '12.1%'}
            </div>
        </div>
        <div className="p-3 text-center">
            <div className="text-slate-600 mb-1 text-[9px] uppercase tracking-widest">STATE_TOPOLOGY</div>
            <div className={`font-mono text-sm ${viewMode === 'ATTRACTOR' ? 'text-pink-400 animate-pulse' : 'text-[var(--accent)]'}`}>
                {viewMode === 'ATTRACTOR' ? 'STRANGE_LOOP' : 'EUCLIDEAN'}
            </div>
        </div>
        <button 
            onClick={() => setIsActive(!isActive)}
            className={`p-3 font-mono text-[10px] uppercase tracking-widest font-bold transition-colors ${isActive ? 'bg-red-900/10 text-red-500 hover:bg-red-900/20' : 'bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20'}`}
        >
            {isActive ? 'ABORT_LOOP' : 'INJECT_SECRET'}
        </button>
      </div>
    </div>
  );
};

export default TruthTerminal;
