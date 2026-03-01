/**
 * Componente Hero Section - Implementación Tailwind CSS
 * Basado en el diseño original de Sovereign Symbiosis
 */

"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  scrollToId?: string;
  variant?: 'sovereign' | 'observatory' | 'governance';
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  onCtaClick,
  scrollToId,
  variant = 'sovereign',
  className
}) => {
  const variantStyles = {
    sovereign: {
      titleGradient: 'text-gradient-hero',
      ctaBg: 'bg-accent',
      ctaHover: 'hover:shadow-accent-glow',
      accentColor: 'text-accent'
    },
    observatory: {
      titleGradient: 'text-observatory-cyan',
      ctaBg: 'bg-observatory-cyan',
      ctaHover: 'hover:shadow-cyan-glow',
      accentColor: 'text-observatory-cyan'
    },
    governance: {
      titleGradient: 'text-observatory-gold',
      ctaBg: 'bg-observatory-gold',
      ctaHover: 'hover:shadow-yellow-400/30',
      accentColor: 'text-observatory-gold'
    }
  };

  const styles = variantStyles[variant];

  return (
    <section className={cn(
      "relative min-h-screen flex items-center justify-center overflow-hidden",
      "bg-void text-main",
      className
    )}>
      {/* Background Effects */}
      <div className="bg-stars" />
      <div className="noise-overlay" />
      
      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Title */}
        <h1 className={cn(
          "text-4xl md:text-6xl lg:text-8xl font-black font-display leading-tight mb-6",
          "reveal reveal-stagger-1",
          styles.titleGradient
        )}>
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <h2 className={cn(
            "text-xl md:text-2xl lg:text-3xl font-semibold mb-4",
            "text-main/80 reveal reveal-stagger-2",
            styles.accentColor
          )}>
            {subtitle}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p className={cn(
            "text-lg md:text-xl text-main/70 mb-8 max-w-3xl mx-auto leading-relaxed",
            "reveal reveal-stagger-3"
          )}>
            {description}
          </p>
        )}

        {/* CTA Button */}
        {ctaText && (onCtaClick || scrollToId) && (
          <button
            onClick={() => {
              if (onCtaClick) onCtaClick();
              if (scrollToId) {
                document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={cn(
              "px-8 py-4 rounded-lg font-semibold text-void",
              "transition-all duration-400 transform",
              "hover:-translate-y-0.5 hover:scale-105",
              styles.ctaBg,
              styles.ctaHover,
              "reveal reveal-stagger-3"
            )}
          >
            {ctaText}
          </button>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className={cn(
          "w-6 h-10 border-2 rounded-full flex justify-center",
          "border-accent/50"
        )}>
          <div className={cn(
            "w-1 h-3 bg-accent rounded-full mt-2",
            "animate-pulse"
          )} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;