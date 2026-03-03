'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LogOut } from 'lucide-react';
import { TierGate } from '@/components/dashboard/TierGate';
import { RicciFlowChart } from '@/components/dashboard/RicciFlowChart';
import { EntropyChart } from '@/components/dashboard/EntropyChart';

const TIER_LABELS: Record<number, { name: string; badge: string }> = {
  1: { name: 'Quick Start', badge: 'bg-green-500/20 text-green-400 border-green-500/40' },
  2: { name: 'Technical Pro', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  3: { name: 'Enterprise Sovereign', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
};

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userTier, setUserTier] = useState<number>(0);
  const [loadingTier, setLoadingTier] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    const fetchTier = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setUserTier(snap.data().tier || 0);
        }
      } catch (e) {
        console.error('Error cargando tier:', e);
      } finally {
        setLoadingTier(false);
      }
    };

    fetchTier();
  }, [user, loading]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || loadingTier) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="font-mono text-cyan-400 text-sm animate-pulse tracking-widest">
          CARGANDO PANEL DE CONTROL...
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Si no tiene suscripción activa, redirigir a pricing
  if (userTier === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-yellow-400">Sin suscripción activa</p>
          <p className="text-gray-400 text-sm">Selecciona un plan para acceder al dashboard.</p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-2 bg-cyan-500 text-black font-mono font-bold rounded hover:bg-cyan-400 transition-colors"
          >
            VER PLANES
          </button>
        </div>
      </div>
    );
  }

  const tierInfo = TIER_LABELS[userTier] || TIER_LABELS[1];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-cyan-500 font-bold tracking-widest text-sm">AHI GOVERNANCE</span>
          <span className={`text-xs font-mono px-2 py-1 rounded border ${tierInfo.badge}`}>
            {tierInfo.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-mono hidden md:block">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-mono text-xs">SALIR</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Bienvenida */}
        <div>
          <h1 className="text-2xl font-bold">Panel de Control</h1>
          <p className="text-gray-400 text-sm mt-1">
            Bienvenido, {user.displayName || user.email}.
          </p>
        </div>

        {/* CRI Score - Todos los tiers */}
        <section>
          <h2 className="text-xs font-mono tracking-widest text-gray-500 mb-4">INTEGRIDAD DEL SISTEMA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
              <p className="text-xs text-gray-500 font-mono">CRI™ SCORE</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">84.2%</p>
              <p className="text-xs text-gray-600 mt-1">Integridad Estructural</p>
            </div>
            <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
              <p className="text-xs text-gray-500 font-mono">ESTADO</p>
              <p className="text-3xl font-bold text-green-400 mt-2">ACTIVO</p>
              <p className="text-xs text-gray-600 mt-1">Sistema operativo</p>
            </div>
            <div className="bg-white/5 border border-gray-800 rounded-xl p-6">
              <p className="text-xs text-gray-500 font-mono">PLAN</p>
              <p className={`text-2xl font-bold mt-2 ${tierInfo.badge.includes('cyan') ? 'text-cyan-400' : tierInfo.badge.includes('green') ? 'text-green-400' : 'text-purple-400'}`}>
                Tier {userTier}
              </p>
              <p className="text-xs text-gray-600 mt-1">{tierInfo.name}</p>
            </div>
          </div>
        </section>

        {/* Ricci Flow Chart - Tier 1+ */}
        <section>
          <h2 className="text-xs font-mono tracking-widest text-gray-500 mb-4">ANÁLISIS RICCI-FLOW</h2>
          <TierGate requiredTier={1} userTier={userTier} featureName="Ricci Flow Chart">
            <RicciFlowChart />
          </TierGate>
        </section>

        {/* Entropy Chart - Tier 2+ */}
        <section>
          <h2 className="text-xs font-mono tracking-widest text-gray-500 mb-4">
            ENTROPÍA ESPECTRAL
            {userTier < 2 && <span className="ml-2 text-gray-600">(Tier 2+)</span>}
          </h2>
          <TierGate requiredTier={2} userTier={userTier} featureName="Entropy Chart">
            <EntropyChart />
          </TierGate>
        </section>

        {/* API Access - Tier 3 only */}
        <section>
          <h2 className="text-xs font-mono tracking-widest text-gray-500 mb-4">
            ACCESO API & ON-PREMISE
            {userTier < 3 && <span className="ml-2 text-gray-600">(Enterprise)</span>}
          </h2>
          <TierGate requiredTier={3} userTier={userTier} featureName="API Access & On-Premise Deployment">
            <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
              <p className="font-mono text-purple-400 text-sm">API KEY ACTIVA</p>
              <p className="font-mono text-gray-300 text-xs mt-2">ahi_live_xxxxxxxxxxxxxxxxxxxx</p>
            </div>
          </TierGate>
        </section>

      </main>
    </div>
  );
}
