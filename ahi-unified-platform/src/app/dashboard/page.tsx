'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { RicciFlowChart } from '@/components/dashboard/RicciFlowChart';
import { EntropyChart } from '@/components/dashboard/EntropyChart';
import { Activity, Shield, LogOut, Terminal, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 animate-pulse font-mono">LOADING SECURE ENVIRONMENT...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500/10 rounded flex items-center justify-center border border-cyan-500/50">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">THE EYE</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Observability Dashboard // v4.1</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            SYSTEM ONLINE
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-400">OPERATOR</p>
              <p className="text-sm font-bold text-cyan-100">{user.displayName || user.email}</p>
            </div>
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-cyan-500/30"
            />
            <button 
              onClick={signOut}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
              title="Terminate Session"
            >
              <signOut className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* Ricci Flow Metric */}
        <GlassPanel className="p-6 border-cyan-500/20 bg-black/40">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                RICCI CURVATURE
              </h2>
              <p className="text-xs text-gray-500">Real-time manifold stability</p>
            </div>
            <span className="text-xs font-mono px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded border border-cyan-500/30">LIVE</span>
          </div>
          <RicciFlowChart />
        </GlassPanel>

        {/* Entropy Metric */}
        <GlassPanel className="p-6 border-pink-500/20 bg-black/40">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-pink-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                SYSTEM ENTROPY
              </h2>
              <p className="text-xs text-gray-500">Thermodynamic state analysis</p>
            </div>
            <span className="text-xs font-mono px-2 py-1 bg-pink-900/30 text-pink-300 rounded border border-pink-500/30">LIVE</span>
          </div>
          <EntropyChart />
        </GlassPanel>

        {/* System Logs (Mock) */}
        <GlassPanel className="col-span-1 lg:col-span-2 p-6 border-white/10 bg-black/40 min-h-[200px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              AUDIT LOGS
            </h2>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 underline">View Full History</button>
          </div>
          <div className="space-y-2 font-mono text-xs">
            {[
              { time: "10:42:15", level: "INFO", msg: "Dashboard initialized for user session." },
              { time: "10:41:55", level: "WARN", msg: "Minor curvature fluctuation detected in Sector 7." },
              { time: "10:40:02", level: "INFO", msg: "Automatic rebalancing of entropy pools completed." },
              { time: "10:38:44", level: "INFO", msg: "Connection established with Geometry Engine." },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 border-b border-white/5 pb-2 last:border-0">
                <span className="text-gray-500">[{log.time}]</span>
                <span className={`font-bold ${log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-400'}`}>{log.level}</span>
                <span className="text-gray-300">{log.msg}</span>
              </div>
            ))}
          </div>
        </GlassPanel>

      </div>
    </div>
  );
}
