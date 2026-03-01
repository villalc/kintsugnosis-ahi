/**
 * ROOT PAGE — Server Component (SSR)
 *
 * Este componente fuerza SSR para que el middleware pueda ejecutarse
 * y redirigir al sitio correcto basado en el hostname.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// --- New, clean Home Page Component ---
function NewHomePage() {
  return (
    <div>
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-4 font-grotesk">
          Clarity and Structure, Reimagined.
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Welcome to the new AHI Unified Platform. We've cleared away the complexity to provide a clean, focused environment for structural governance and organizational symbiosis.
        </p>
        <div className="mt-8">
          <a href="/governance" className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
            Explore Governance
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-3 font-grotesk">Governance</h2>
          <p className="text-slate-400">
            The tools and frameworks for building resilient, deterministic organizational structures.
          </p>
        </div>
        <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-3 font-grotesk">Sovereign Symbiosis</h2>
          <p className="text-slate-400">
            Research and essays on the new paradigms of corporate and digital sovereignty.
          </p>
        </div>
      </section>
    </div>
  );
}

// Forzar SSR para que el middleware se ejecute.
export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Redirigir a /symbiosis si el dominio es el correcto
  if (host.includes('sovereignsymbiosis')) {
    redirect('/symbiosis');
  }

  // Por defecto, mostrar la nueva y limpia página de AHI Governance
  return <NewHomePage />;
}
