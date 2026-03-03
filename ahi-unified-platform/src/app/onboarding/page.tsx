'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const TIER_LABELS: Record<number, { name: string; color: string }> = {
  1: { name: 'Auditoría Rápida', color: 'text-green-400' },
  2: { name: 'Auditoría Técnica', color: 'text-cyan-400' },
  3: { name: 'Enterprise Sovereign', color: 'text-purple-400' },
};

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tier, setTier] = useState<number>(0);
  const [status, setStatus] = useState<'waiting' | 'ready' | 'error'>('waiting');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login?redirect=/onboarding');
      return;
    }

    // Polling de Firestore hasta que el webhook confirme el tier
    // El webhook puede tardar 2-5 segundos en llegar
    const pollForTier = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists() && snap.data().tier > 0) {
          setTier(snap.data().tier);
          setStatus('ready');
          // Esperar 3 segundos mostrando bienvenida y luego ir al dashboard
          setTimeout(() => router.push('/dashboard'), 3000);
        } else if (attempts < 10) {
          // Reintentar cada 2 segundos (hasta 20 segundos total)
          setTimeout(() => setAttempts((a) => a + 1), 2000);
        } else {
          // El webhook tardó demasiado: mostrar dashboard de todas formas
          setStatus('ready');
          setTimeout(() => router.push('/dashboard'), 3000);
        }
      } catch {
        setStatus('error');
      }
    };

    pollForTier();
  }, [user, loading, attempts]);

  if (loading || status === 'waiting') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-cyan-400 text-sm tracking-widest animate-pulse">
            VERIFICANDO INTEGRIDAD DE PAGO...
          </p>
          <p className="text-gray-600 text-xs font-mono">
            {attempts > 0 && `Intento ${attempts}/10`}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 font-mono">Error verificando el pago.</p>
          <p className="text-gray-400 text-sm">Contacta a enterprise@ahigovernance.com</p>
          <button onClick={() => router.push('/dashboard')} className="mt-4 px-6 py-2 border border-gray-600 rounded font-mono text-sm">
            Ir al Dashboard de todas formas
          </button>
        </div>
      </div>
    );
  }

  const tierInfo = TIER_LABELS[tier] || { name: 'Cliente AHI', color: 'text-cyan-400' };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md px-6">
        {/* Sello de confirmación */}
        <div className="w-20 h-20 rounded-full border-2 border-cyan-500 flex items-center justify-center mx-auto">
          <span className="text-3xl">✓</span>
        </div>

        <div>
          <p className="text-xs tracking-widest text-gray-500 font-mono mb-2">ACCESO AUTORIZADO</p>
          <h1 className="text-3xl font-bold">
            Bienvenido a AHI
          </h1>
          <p className={`text-lg font-mono mt-2 ${tierInfo.color}`}>
            {tierInfo.name}
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          Su suscripción ha sido activada. Está siendo redirigido al dashboard...
        </p>

        <div className="w-full bg-gray-900 rounded-full h-1">
          <div className="bg-cyan-500 h-1 rounded-full animate-pulse w-3/4" />
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="text-xs text-gray-600 hover:text-gray-400 font-mono transition-colors"
        >
          Ir al dashboard ahora &rarr;
        </button>
      </div>
    </div>
  );
}
