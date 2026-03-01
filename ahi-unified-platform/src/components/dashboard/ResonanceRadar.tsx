"use client";

import React from 'react';
import {
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const data = [
  { subject: 'Ricci_Stability', A: 120, fullMark: 150 },
  { subject: 'Mass_Gap', A: 98, fullMark: 150 },
  { subject: 'Weyl_Resonance', A: 86, fullMark: 150 },
  { subject: 'Langevin_Drift', A: 99, fullMark: 150 },
  { subject: 'Psi_Coherence', A: 85, fullMark: 150 },
  { subject: 'Gauge_Invariance', A: 65, fullMark: 150 },
];

export default function ResonanceRadar() {
  return (
    <div className="w-full h-80 bg-white/[0.02] border border-[var(--accent)]/10 rounded-sm p-4 backdrop-blur-md">
      <div className="text-[10px] font-mono text-[var(--accent)] mb-4 uppercase tracking-[0.3em]">
        Semantic_Valence_Field // SU(3)_Symmetry
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(212, 175, 55, 0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8, fontFamily: 'var(--font-mono)' }} 
          />
          <Radar
            name="Ensemble_State"
            dataKey="A"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.15}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
