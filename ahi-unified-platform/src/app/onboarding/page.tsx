'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const TIER_LABELS: Record<number, { name: string; color: string }> = {
  1: { name: 'Auditoría Rápida', color: 'text-green-400' },
  2: { name: 'Auditoría Técnica', color: 'text-cyan-400' },
  3: { name: 'Enterprise Sovereign', color: 'text-purple-400' },
};

function OnboardingContent() {
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

    const pollForTier = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists() && snap.data().tier > 0) {
          setTier(snap.data().tier);
          setStatus('ready');
          setTimeout(() => router.push('/dashboard'), 3000);
        } else if (attempts < 10) {
          setTimeout(() => setAttempts((a) => a + 1), 2000);
        } else {
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
        <div className="text-cyan-400 text-xl animate-pulse">VERIFICANDO INTEGRIDAD DE PAGO...</div>
        {attempts > 0 && <div className="text-gray-500 text-sm mt-2">{`Intento ${attempts}/10`}</div>}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
        <div className="text-red-400 text-xl">Error verificando el pago.</div>
        <div className="text-gray-400 text-sm mt-2">Contacta a enterprise@ahigovernance.com</div>
        <button onClick={() => router.push('/dashboard')} className="mt-4 px-6 py-2 border border-gray-600 rounded font-mono text-sm">
          Ir al Dashboard de todas formas
        </button>
      </div>
    );
  }

  const tierInfo = TIER_LABELS[tier] || { name: 'Cliente AHI', color: 'text-cyan-400' };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center mx-auto">
          <span className="text-cyan-400 text-3xl">✓</span>
        </div>
        <div className="text-green-400 text-sm tracking-widest">ACCESO AUTORIZADO</div>
        <h1 className="text-4xl font-bold text-white">Bienvenido a AHI</h1>
        <div className={`text-xl ${tierInfo.color}`}>{tierInfo.name}</div>
        <p className="text-gray-400 text-sm">
          Su suscripción ha sido activada. Está siendo redirigido al dashboard...
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-xs text-gray-600 hover:text-gray-400 font-mono transition-colors"
        >
          Ir al dashboard ahora →
        </button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-cyan-400 animate-pulse">Cargando...</div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
