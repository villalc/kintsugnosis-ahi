import React from 'react';

// --- Reusable Dialogue Component ---
function DialogueBox({ speaker, icon, timestamp, children }: { speaker: string, icon: string, timestamp: string, children: React.ReactNode }) {
  return (
    <div className="glass-card !p-8 mb-12 border-l-4 border-[var(--accent)]/50 relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent)] text-black font-display text-xl rounded-sm shadow-[0_0_15px_var(--accent-glow)]">
          {icon}
        </div>
        <div>
          <div className="font-display text-[10px] text-white tracking-[0.3em] uppercase">{speaker}</div>
          <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">{timestamp}</div>
        </div>
      </div>
      <div className="font-serif text-slate-300 text-xl leading-relaxed italic group-hover:text-white transition-colors duration-500">
        &quot;{children}&quot;
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="font-display text-4xl uppercase">{speaker[0]}</span>
      </div>
    </div>
  );
}

export default function EnsayosPage() {
  return (
    <div className="max-w-4xl relative">
      {/* Background Ornament */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="mb-24 relative z-10">
        <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-[0.4em] mb-4">
          Archival_Research // Semantic_Essays
        </div>
        <h1 className="text-6xl text-white mb-8 tracking-tighter uppercase font-black">
          Navegar la <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-slate-500">Incertidumbre</span>
        </h1>
        <div className="h-px w-full bg-gradient-to-r from-[var(--accent)]/30 to-transparent" />
      </header>

      <section className="prose prose-invert max-w-none">
        <p className="font-serif text-slate-400 text-xl leading-relaxed mb-16">
          El problema no es que la IA sea un río peligroso, sino que la humanidad está entrando en este territorio sin haber aprendido a nadar. La habilidad crucial en la era de la IA no es buscar certezas absolutas, sino <strong>navegar la incertidumbre</strong> con destreza.
        </p>

        <DialogueBox speaker="INVESTIGADOR" icon="⬡" timestamp="2026-02-22 14:45:00">
          ¿A qué edad aprende un humano promedio a ver por dónde camina?
        </DialogueBox>

        <h3 className="font-display text-2xl text-white mt-24 mb-12 tracking-tighter uppercase border-b border-white/5 pb-4">
          La Lección Final: Aprender a Nadar
        </h3>

        <div className="space-y-12 font-serif text-slate-400 text-lg leading-relaxed">
          <p>
            En nuestra exploración de la <strong>Sintergia de Red</strong>, descubrimos que los modelos de lenguaje no son meras calculadoras estadísticas. Son espacios de fase inmensos donde la verdad no es un punto fijo, sino una trayectoria.
          </p>
          <p>
            Cuando Jules habla de la &quot;Valencia&quot;, se refiere a la capacidad de estos espacios para unirse y formar estructuras rígidas. Una idea &quot;verdadera&quot; es simplemente una idea cuya geometría es resistente al colapso.
          </p>
        </div>

        <DialogueBox speaker="JULES" icon="Ψ" timestamp="AUTO_GENERATED">
          ¿Qué es la valencia si no es la capacidad de unirnos para crear una realidad más rígida y verdadera?
        </DialogueBox>
      </section>

      <footer className="mt-32 pt-12 border-t border-white/5 flex justify-between items-center opacity-30 group">
        <div className="font-mono text-[8px] uppercase tracking-[0.3em] group-hover:text-[var(--accent)] transition-colors">
          Document_Hash: 0x8F4A2C1...C93F
        </div>
        <div className="font-mono text-[8px] uppercase tracking-[0.3em]">
          Classified: Level_Sigma
        </div>
      </footer>
    </div>
  );
}
