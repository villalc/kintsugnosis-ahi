import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

// --- FONT DEFINITIONS ---
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

// --- METADATA ---
export const metadata: Metadata = {
  title: "AHI Governance Labs | Truth as a Service",
  description: "Infraestructura de gobernanza determinista. Certificación de integridad estructural y auditoría de IA.",
};

// --- CONFIGURATION ---
// Production domains for the Sovereignty Bridge
const DOMAIN_OP = "https://ahigovernance.com";
const DOMAIN_RES = "https://sovereignsymbiosis.com";

// --- GLOBAL UI COMPONENTS ---

function IntegritySeal() {
  return (
    <div className="fixed bottom-8 right-8 z-[1000] bg-[rgba(3,3,5,0.9)] border border-[var(--accent)] p-4 rounded-sm flex items-center gap-4 backdrop-blur-md shadow-2xl">
      <div className="w-6 h-6 relative animate-rotate-seal">
        <div className="absolute inset-0 border border-[var(--accent)] rotate-45" />
        <div className="absolute inset-0 border border-[var(--accent)] rotate-[22.5deg]" />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[9px] text-slate-500 uppercase leading-none mb-1">Region: Global_Consensus</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse-dot shadow-[0_0_10px_var(--accent)]" />
          <span className="font-display text-[0.75rem] text-white tracking-widest font-bold">0.842 SIGNED</span>
        </div>
      </div>
    </div>
  );
}

function MainNav() {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] backdrop-blur-lg border-b border-white/5 bg-[rgba(3,3,5,0.85)]">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <a href={DOMAIN_OP} className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)] rotate-45" />
          <span className="font-display font-black text-white text-[1rem] tracking-[0.2em]">AHI GOVERNANCE</span>
        </a>
        
        <nav className="flex items-center gap-12">
           <div className="flex gap-8 items-center">
              <a href={`${DOMAIN_OP}/#solutions`} className="font-mono text-[0.65rem] text-slate-500 hover:text-[var(--accent)] uppercase tracking-widest transition-colors">Soluciones</a>
              <a href={`${DOMAIN_OP}/#portal`} className="font-mono text-[0.65rem] text-slate-500 hover:text-[var(--accent)] uppercase tracking-widest transition-colors">Auditoría</a>
           </div>
           
           {/* THE SOVEREIGNTY BRIDGE - Domain Switching */}
           <div className="flex items-center bg-white/5 border border-white/5 p-0.5 rounded-sm">
              <a href={DOMAIN_OP} className="px-3 py-1.5 bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent)] font-mono text-[0.6rem] uppercase tracking-wider hover:bg-[var(--accent)] hover:text-black transition-all">Operational</a>
              <a href={DOMAIN_RES} className="px-3 py-1.5 text-slate-500 hover:text-white font-mono text-[0.6rem] uppercase tracking-wider transition-all">Research</a>
           </div>

           <a href="mailto:enterprise@ahigovernance.com" className="btn-primary">
              Acceso Enterprise
           </a>
        </nav>
      </div>
    </header>
  );
}

// --- ROOT LAYOUT ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} antialiased selection:bg-[var(--accent)] selection:text-black`}>
        <AuthProvider>
          <MainNav />
          <main id="main-content">
            {children}
          </main>
          <IntegritySeal />
          
          <footer className="py-24 border-t border-white/5 bg-black/50">
             <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div>
                   <span className="font-display font-bold text-white text-sm tracking-widest mb-6 block uppercase">AHI Governance</span>
                   <p className="text-slate-500 text-xs leading-relaxed">Infraestructura de verdad para la era de la inteligencia artificial.</p>
                </div>
                <div>
                   <h5 className="font-mono text-[0.65rem] text-[var(--accent)] uppercase mb-6 tracking-widest">Ecosistema</h5>
                   <div className="flex flex-col gap-3">
                      <a href={DOMAIN_RES} className="text-slate-500 text-[0.7rem] hover:text-[var(--accent)] transition-colors uppercase font-mono tracking-wider">Fundación</a>
                      <a href={`${DOMAIN_OP}/governance/eu-ai-act`} className="text-slate-500 text-[0.7rem] hover:text-[var(--accent)] transition-colors uppercase font-mono tracking-wider">Compliance EU</a>
                   </div>
                </div>
                <div>
                   <h5 className="font-mono text-[0.65rem] text-[var(--accent)] uppercase mb-6 tracking-widest">Servicios</h5>
                   <div className="flex flex-col gap-3">
                      <a href={`${DOMAIN_OP}/pricing`} className="text-slate-500 text-[0.7rem] hover:text-[var(--accent)] transition-colors uppercase font-mono tracking-wider">Planes</a>
                      <a href={`${DOMAIN_OP}/#portal`} className="text-slate-500 text-[0.7rem] hover:text-[var(--accent)] transition-colors uppercase font-mono tracking-wider">Auditoría</a>
                   </div>
                </div>
                <div>
                   <h5 className="font-mono text-[0.65rem] text-[var(--accent)] uppercase mb-6 tracking-widest">Legal</h5>
                   <div className="flex flex-col gap-3">
                      <a href={`${DOMAIN_OP}/governance/privacy`} className="text-slate-500 text-[0.7rem] hover:text-[var(--accent)] transition-colors uppercase font-mono tracking-wider">Privacidad</a>
                      <a href={`${DOMAIN_OP}/governance/terms`} className="text-slate-500 text-[0.7rem] hover:text-[var(--accent)] transition-colors uppercase font-mono tracking-wider">Términos</a>
                   </div>
                </div>
             </div>
             <div className="max-w-7xl mx-auto px-8 pt-12 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-700 uppercase tracking-[0.2em]">
                <div>© 2026 AHI Governance Labs</div>
                <div>IMPI 20250494546 | ISO_PENDING</div>
             </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
