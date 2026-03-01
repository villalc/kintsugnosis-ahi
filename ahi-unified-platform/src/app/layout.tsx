import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// --- FONT DEFINITIONS ---
// Combining fonts from both versions
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

// --- METADATA (from remote) ---
export const metadata: Metadata = {
  title: {
    default: "AHI Governance Labs — Auditoría Ética de IA",
    template: "%s | AHI Governance Labs",
  },
  description:
    "Auditoría y certificación ética de sistemas de inteligencia artificial. CRI™ Score, MEBA Framework y Protocolo GIP para gobernanza responsable de IA.",
  metadataBase: new URL("https://ahigovernance.com"),
  // ... (keeping all the SEO and openGraph metadata from the remote version)
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://ahigovernance.com",
    siteName: "AHI Governance Labs",
    title: "AHI Governance Labs — Auditoría Ética de IA",
    description:
      "Certificación CRI™ y auditoría geométrica para sistemas autónomos. Gobernanza responsable basada en matemáticas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AHI Governance Labs — Auditoría Ética de IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AHI Governance Labs",
    description:
      "Auditoría y certificación ética de sistemas de IA. CRI™ Score y Protocolo GIP.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#0a0a0a",
};

// --- Main Navigation (our new clean version) ---
function MainNav() {
  return (
    <nav className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="font-bold text-lg font-grotesk">
            <span className="text-green-400">AHI</span> Unified
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="/" className="text-slate-300 hover:text-white transition-colors">Home</a>
            <a href="/governance" className="text-slate-300 hover:text-white transition-colors">Governance</a>
            <a href="/symbiosis" className="text-slate-300 hover:text-white transition-colors">Sovereign Symbiosis</a>
            <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- Root Layout ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-slate-900 text-slate-200`}>
        <AuthProvider>
          <MainNav />
          <main className="max-w-5xl mx-auto px-4 py-12">
            {children}
          </main>
          <footer className="max-w-5xl mx-auto px-4 py-8 mt-16 border-t border-slate-700 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} AHI Corporation. All rights reserved.</p>
          </footer>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
