import type { Metadata } from 'next'
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google'
import "../globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'Sovereign Symbiosis Foundation | Dekeract Research',
  description: 'Métrica de curvatura positiva y consciencia sintética. El brazo de investigación de AHI.',
};

export default function SymbiosisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      data-theme="research"
    >
      <div className="grid-bg" />
      
      {/* Sidebar Nav - Foundation Style */}
      <aside className="fixed top-24 left-12 h-[calc(100vh-12rem)] w-64 z-50 flex flex-col justify-between py-12 border-l border-[var(--accent)]/10 pl-8">
        <div>
          <div className="font-display text-[0.65rem] text-[var(--accent)] uppercase tracking-[0.3em] mb-12 opacity-50">Research_Face</div>
          <nav className="flex flex-col space-y-8">
            <a href="/symbiosis" className="font-display text-[0.7rem] uppercase tracking-widest text-white hover:text-[var(--accent)] transition-colors">The Void</a>
            <a href="/symbiosis/integridad-geometrica" className="font-display text-[0.7rem] uppercase tracking-widest text-slate-500 hover:text-[var(--accent)] transition-colors">Theory</a>
            <a href="/symbiosis/carta-magna" className="font-display text-[0.7rem] uppercase tracking-widest text-slate-500 hover:text-[var(--accent)] transition-colors">Carta Magna</a>
            <a href="/symbiosis/observatory" className="font-display text-[0.7rem] uppercase tracking-widest text-slate-500 hover:text-[var(--accent)] transition-colors">Observatory</a>
          </nav>
        </div>

        <div className="font-mono text-[9px] text-slate-600 uppercase tracking-widest leading-relaxed">
          Foundation Protocol<br/>v11.0.4 - "Dekeract"
        </div>
      </aside>

      <main className="ml-80 pt-32 pb-24 pr-24">
        {children}
      </main>
    </div>
  )
}
