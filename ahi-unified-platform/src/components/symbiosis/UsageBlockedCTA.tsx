import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import Link from 'next/link';

export const UsageBlockedCTA = () => {
  return (
    <GlassPanel 
      variant="neon" 
      glowColor="gold" 
      className="max-w-2xl mx-auto text-center p-12"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500">
          <span className="text-3xl">🔒</span>
        </div>
        
        <h2 className="font-display text-2xl text-white uppercase tracking-wider">
          Límite de Uso Diario Alcanzado
        </h2>
        
        <p className="text-gray-400 max-w-lg leading-relaxed">
          Para garantizar el acceso justo a estas herramientas de soberanía cognitiva, hemos establecido un límite de 2 usos por dispositivo cada 24 horas.
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 w-full text-left">
          <p className="font-serif italic text-gray-300 mb-4 text-center">
            &quot;La restricción no es un error, es un recordatorio de que la verdad requiere esfuerzo sostenido.&quot;
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          ¿Necesitas acceso ilimitado para investigación profunda?
        </p>
        
        <div className="flex gap-4 mt-2">
          <Link 
            href="/governance/pricing" 
            className="px-6 py-3 bg-accent text-black font-mono font-bold uppercase rounded hover:bg-white transition-colors"
          >
            Ver Planes Enterprise
          </Link>
          <a 
            href="mailto:colaboracion@ahigovernance.com"
            className="px-6 py-3 border border-accent text-accent font-mono font-bold uppercase rounded hover:bg-accent/10 transition-colors"
          >
            Colaborar con la Fundación
          </a>
        </div>
      </div>
    </GlassPanel>
  );
};
