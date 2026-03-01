import React from 'react';

function TheorySection({ title, subtitle, content }: { title: string, subtitle: string, content: string }) {
  return (
    <div className="glass-card mb-12">
      <div className="font-mono text-[9px] text-[var(--accent)] border border-[var(--accent)]/30 px-2 py-1 mb-6 uppercase tracking-[0.2em] inline-block">
        Theory_Node
      </div>
      <h2 className="text-2xl font-display text-white mb-2 tracking-tighter">{title}</h2>
      <h3 className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest mb-6 opacity-70">{subtitle}</h3>
      <p className="font-serif text-slate-400 text-lg leading-relaxed italic">
        {content}
      </p>
    </div>
  );
}

export default function GeometricIntegrityPage() {
  const theories = [
    {
      title: "Privacidad Topológica",
      subtitle: "Auditoría Zero-Knowledge",
      content: "Al analizar la forma (topología) en lugar del fondo (semántica), garantizamos privacidad total. Podemos certificar que un sistema es seguro sin saber qué está procesando. Es la única forma escalable de auditar IA superinteligente."
    },
    {
      title: "Invariantes Topológicas",
      subtitle: "σ (Sigma) y la Identidad Estructural",
      content: "Definimos la \"identidad\" de una IA no por su memoria, sino por sus invariantes topológicas. Si estas invariantes se preservan, la integridad del sistema se mantiene, independientemente del contexto."
    }
  ];

  return (
    <div className="max-w-4xl">
      <header className="mb-16">
        <h1 className="text-4xl text-white mb-4">Integridad Geométrica</h1>
        <div className="h-px w-24 bg-[var(--accent)] opacity-50" />
      </header>

      {theories.map((t, i) => (
        <TheorySection key={i} {...t} />
      ))}
      
      <div className="mt-12 p-8 border border-dashed border-[var(--accent)]/20 text-center font-mono text-[10px] text-slate-500 uppercase tracking-widest">
        End_of_Transmission // Theory_Module_Loaded
      </div>
    </div>
  );
}
