'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function LoginPage() {
  const { loginWithGoogle, loading } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('Authentication failed. Access Denied.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-cyan-500 font-mono">INITIALIZING SECURE HANDSHAKE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      
      <GlassPanel className="w-full max-w-md p-8 relative z-10 border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/50 animate-pulse">
            <Cpu className="w-8 h-8 text-cyan-400" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              AHI OPERATION CENTER
            </h1>
            <p className="text-xs font-mono text-cyan-500/60 uppercase tracking-[0.2em]">
              Restricted Access // Level 3 Clearance
            </p>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/50 p-3 rounded text-red-400 text-xs font-mono text-center">
              {error}
            </div>
          )}

          <div className="w-full space-y-4">
            <button
              onClick={handleLogin}
              className="w-full group relative flex items-center justify-center gap-3 px-4 py-3 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-sm text-cyan-100 group-hover:text-white tracking-wide">
                AUTHENTICATE WITH IDENTITY
              </span>
            </button>
            
            <div className="text-center">
              <span className="text-[10px] text-gray-600 font-mono">
                SECURE CONNECTION ESTABLISHED via SHA-256
              </span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
