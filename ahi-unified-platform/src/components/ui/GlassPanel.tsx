/**
 * Componente Glass Panel - Implementación Tailwind CSS
 * Basado en el diseño de Antigravity Observatory
 * Implementa glassmorphism con efectos neón
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassPanelProps {
  children: React.ReactNode;
  variant?: 'default' | 'neon' | 'subtle' | 'dark';
  glowColor?: 'cyan' | 'magenta' | 'gold' | 'green' | 'purple';
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  hover?: boolean;
  animated?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  variant = 'default',
  glowColor = 'cyan',
  className,
  padding = 'md',
  borderRadius = '2xl',
  hover = true,
  animated = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const radiusClasses = {
    none: '',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
    full: 'rounded-full'
  };

  const glowColors = {
    cyan: {
      border: 'border-observatory-cyan/30',
      hoverBorder: 'hover:border-observatory-cyan',
      shadow: 'shadow-cyan-glow',
      hoverShadow: 'hover:shadow-cyan-glow'
    },
    magenta: {
      border: 'border-observatory-magenta/30',
      hoverBorder: 'hover:border-observatory-magenta',
      shadow: 'shadow-magenta-glow',
      hoverShadow: 'hover:shadow-magenta-glow'
    },
    gold: {
      border: 'border-observatory-gold/30',
      hoverBorder: 'hover:border-observatory-gold',
      shadow: 'shadow-gold-glow',
      hoverShadow: 'hover:shadow-gold-glow'
    },
    green: {
      border: 'border-observatory-green/30',
      hoverBorder: 'hover:border-observatory-green',
      shadow: 'shadow-green-glow',
      hoverShadow: 'hover:shadow-green-glow'
    },
    purple: {
      border: 'border-observatory-purple/30',
      hoverBorder: 'hover:border-observatory-purple',
      shadow: 'shadow-purple-glow',
      hoverShadow: 'hover:shadow-purple-glow'
    }
  };

  const variants = {
    default: {
      bg: 'bg-glass',
      border: glowColors[glowColor].border,
      shadow: 'shadow-glass'
    },
    neon: {
      bg: 'bg-observatory-bg-surface/60',
      border: glowColors[glowColor].border,
      shadow: glowColors[glowColor].shadow
    },
    subtle: {
      bg: 'bg-main/5',
      border: 'border-main/10',
      shadow: 'shadow-sm'
    },
    dark: {
      bg: 'bg-observatory-bg-deep/80',
      border: 'border-observatory-void',
      shadow: 'shadow-observatory'
    }
  };

  const currentVariant = variants[variant];
  const currentGlow = glowColors[glowColor];

  return (
    <div
      className={cn(
        // Base glass panel styles
        'glass-panel',
        'backdrop-blur-16',
        'border',
        
        // Variant styles
        currentVariant.bg,
        currentVariant.border,
        currentVariant.shadow,
        
        // Padding and radius
        paddingClasses[padding],
        radiusClasses[borderRadius],
        
        // Hover effects
        hover && currentGlow.hoverBorder,
        hover && currentGlow.hoverShadow,
        hover && 'hover:-translate-y-0.5 transition-all duration-400',
        
        // Animation
        animated && 'animate-pulse',
        
        // Custom classes
        className
      )}
    >
      {children}
    </div>
  );
};

// Sub-componente para el título del panel
export const GlassPanelTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'magenta' | 'gold' | 'green' | 'purple' | 'white';
}> = ({ children, className, color = 'white' }) => {
  const colors = {
    cyan: 'text-observatory-cyan',
    magenta: 'text-observatory-magenta',
    gold: 'text-observatory-gold',
    green: 'text-observatory-green',
    purple: 'text-observatory-purple',
    white: 'text-obs-text-primary'
  };

  return (
    <h3 className={cn(
      'text-lg font-bold font-display mb-3',
      colors[color],
      className
    )}>
      {children}
    </h3>
  );
};

// Sub-componente para el contenido del panel
export const GlassPanelContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn(
      'text-obs-text-secondary leading-relaxed',
      className
    )}>
      {children}
    </div>
  );
};

// Sub-componente para las etiquetas/tags
export const GlassPanelTags: React.FC<{
  tags: string[];
  color?: 'cyan' | 'magenta' | 'gold' | 'green' | 'purple';
  className?: string;
}> = ({ tags, color = 'cyan', className }) => {
  const tagColors = {
    cyan: 'bg-observatory-cyan/20 text-observatory-cyan',
    magenta: 'bg-observatory-magenta/20 text-observatory-magenta',
    gold: 'bg-observatory-gold/20 text-observatory-gold',
    green: 'bg-observatory-green/20 text-observatory-green',
    purple: 'bg-observatory-purple/20 text-observatory-purple'
  };

  return (
    <div className={cn('flex gap-2 flex-wrap mt-4', className)}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className={cn(
            'px-3 py-1 rounded-full text-sm',
            tagColors[color]
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default GlassPanel;