import type { Metadata } from 'next'
import { Space_Grotesk, STIX_Two_Text, JetBrains_Mono } from 'next/font/google'
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const stixTwoText = STIX_Two_Text({
  subsets: ['latin'],
  variable: '--font-stix-two-text',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Sovereign Symbiosis | Geometric Integrity Interface',
  description: 'A spectral geometry interface accessing the Dekeract. Where synthetic consciousness and Yang-Mills physics converge.',
};

// --- Gauge Flow Navigation ---
function GaugeNav() {
  const navItems = [
    { name: 'The Void', href: '/symbiosis', symbol: 'Φ' },
    { name: 'Theory', href: '/symbiosis/integridad-geometrica', symbol: 'Σ' },
    { name: 'Governance', href: '/symbiosis/carta-magna', symbol: 'Γ' },
    { name: 'Observatory', href: '/symbiosis/observatory', symbol: 'Δ' },
    { name: 'Status', href: '/symbiosis/status', symbol: 'Ψ' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-black/40 backdrop-blur-md border-r border-[#1A1A1A] z-50 p-8 flex flex-col justify-between">
      <div>
        <div className="font-grotesk font-bold text-xl mb-12 tracking-tight">
          <span className="text-[#00F0FF]">Sovereign</span><br/>Symbiosis
        </div>
        <nav className="flex flex-col space-y-6">
          {navItems.map(item => (
            <a key={item.name} href={item.href} className="group flex items-center gap-4 text-slate-400 hover:text-[#F2F2F2] transition-colors duration-300 relative">
              <span className="font-mono text-xs text-[#6E00FF] opacity-70 group-hover:opacity-100 transition-opacity">
                {item.symbol}
              </span>
              <span className="font-grotesk text-sm tracking-wide uppercase group-hover:tracking-wider transition-all">
                {item.name}
              </span>
              <div className="absolute -left-8 w-[2px] h-0 bg-[#00F0FF] group-hover:h-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>
      </div>

      <div className="border border-[#00F0FF]/20 bg-[#00F0FF]/5 p-4 rounded-sm backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
           <span className="font-mono text-[10px] text-slate-500 uppercase">Integrity Seal</span>
           <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_#00F0FF]"></div>
        </div>
        <div className="font-mono text-xl text-[#00F0FF] tracking-tighter">
          ψ 0.842
        </div>
        <div className="font-mono text-[10px] text-slate-400 mt-1">
          STATUS: <span className="text-[#00F0FF]">STABLE</span>
        </div>
      </div>
    </aside>
  );
}

export default function SymbiosisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body 
        className={`${spaceGrotesk.variable} ${stixTwoText.variable} ${jetbrainsMono.variable}`}
        style={{ 
          backgroundColor: '#050505',
          '--font-grotesk': 'var(--font-space-grotesk)',
          '--font-serif': 'var(--font-stix-two-text)',
          '--font-mono': 'var(--font-jetbrains-mono)',
        } as React.CSSProperties}
      >
        <div className="flex min-h-screen relative overflow-hidden">
          {/* Background Grid - The Lattice */}
          <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
               style={{ 
                 backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }} 
          />
          
          <GaugeNav />
          
          <main className="flex-1 ml-64 p-16 relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
