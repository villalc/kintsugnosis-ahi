/**
 * Componente Navigation - Implementación Tailwind CSS
 * Basado en el diseño de navegación de Sovereign Symbiosis y Observatory
 * Implementa glassmorphism con efectos hover neón
 */

"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  variant?: 'sovereign' | 'observatory' | 'minimal';
  position?: 'fixed' | 'absolute' | 'relative';
  showLogo?: boolean;
  logoText?: string;
  className?: string;
  accentColor?: 'accent' | 'cyan' | 'magenta' | 'gold' | 'green';
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  variant = 'sovereign',
  position = 'fixed',
  showLogo = true,
  logoText = 'AHI',
  className,
  accentColor = 'accent'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const variantStyles = {
    sovereign: {
      bg: 'bg-void/80',
      border: 'border-accent/20',
      hover: 'hover:text-accent',
      active: 'text-accent',
      indicator: 'bg-accent'
    },
    observatory: {
      bg: 'bg-observatory-bg-deep/80',
      border: 'border-observatory-cyan/20',
      hover: 'hover:text-observatory-cyan',
      active: 'text-observatory-cyan',
      indicator: 'bg-observatory-cyan'
    },
    minimal: {
      bg: 'bg-transparent',
      border: 'border-transparent',
      hover: 'hover:text-main',
      active: 'text-main',
      indicator: 'bg-main'
    }
  };

  const accentStyles = {
    accent: {
      hover: 'hover:text-accent',
      active: 'text-accent',
      indicator: 'bg-accent'
    },
    cyan: {
      hover: 'hover:text-observatory-cyan',
      active: 'text-observatory-cyan',
      indicator: 'bg-observatory-cyan'
    },
    magenta: {
      hover: 'hover:text-observatory-magenta',
      active: 'text-observatory-magenta',
      indicator: 'bg-observatory-magenta'
    },
    gold: {
      hover: 'hover:text-observatory-gold',
      active: 'text-observatory-gold',
      indicator: 'bg-observatory-gold'
    },
    green: {
      hover: 'hover:text-observatory-green',
      active: 'text-observatory-green',
      indicator: 'bg-observatory-green'
    }
  };

  const styles = variantStyles[variant];
  const accent = accentStyles[accentColor];

  const navItemClasses = (item: NavItem) => cn(
    "relative px-4 py-2 text-sm font-medium transition-all duration-400",
    "group overflow-hidden",
    item.active ? accent.active : "text-main/70",
    styles.hover,
    accent.hover
  );

  return (
    <nav className={cn(
      position,
      "top-0 left-0 right-0 z-50 transition-all duration-400",
      isScrolled ? `${styles.bg} backdrop-blur-16 border-b ${styles.border}` : styles.bg,
      className
    )}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {showLogo && (
            <a href="#" className={cn(
              "flex items-center space-x-3 group",
              styles.hover
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                "bg-gradient-to-br from-accent to-observatory-cyan",
                "group-hover:scale-110 transition-transform duration-400"
              )}>
                <span className="text-main font-black text-sm">
                  {logoText.charAt(0)}
                </span>
              </div>
              <span className={cn(
                "font-display font-bold text-lg",
                "group-hover:tracking-wider transition-all duration-400"
              )}>
                {logoText}
              </span>
            </a>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={navItemClasses(item)}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Hover indicator */}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 transform origin-left",
                  "scale-x-0 group-hover:scale-x-100 transition-transform duration-400",
                  item.active ? accent.indicator : "bg-current",
                  "opacity-50"
                )} />
                
                {/* Active indicator */}
                {item.active && (
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5",
                    accent.indicator
                  )} />
                )}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors duration-400",
              styles.hover
            )}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={cn(
                "block w-full h-0.5 transition-all duration-400",
                isMenuOpen ? "rotate-45 translate-y-1.5" : "",
                "bg-current"
              )} />
              <span className={cn(
                "block w-full h-0.5 transition-all duration-400",
                isMenuOpen ? "opacity-0" : "",
                "bg-current"
              )} />
              <span className={cn(
                "block w-full h-0.5 transition-all duration-400",
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : "",
                "bg-current"
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-400",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className={cn(
            "py-4 space-y-2",
            "border-t",
            styles.border
          )}>
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-400",
                  item.active ? accent.active : "text-main/70",
                  styles.hover,
                  accent.hover,
                  "hover:bg-main/5"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                {item.external && (
                  <span className="ml-2 text-xs opacity-50">↗</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Componente de ejemplo con navegación de muestra
export const NavigationExample: React.FC = () => {
  const navItems: NavItem[] = [
    { label: 'Home', href: '#home', active: true },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Observatory', href: '#observatory' },
    { label: 'Governance', href: '#governance' },
    { label: 'Symbiosis', href: '#symbiosis' },
    { label: 'GitHub', href: 'https://github.com/ahigovernance', external: true }
  ];

  return (
    <div className="min-h-screen bg-void">
      <Navigation
        items={navItems}
        variant="observatory"
        accentColor="cyan"
        logoText="AHI"
      />
      
      {/* Demo content */}
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black font-display text-gradient-hero mb-6">
            Navigation Demo
          </h1>
          <p className="text-lg text-main/70 mb-8">
            Scroll to see the navigation glass effect and try the mobile menu
          </p>
          
          {/* Spacer content */}
          <div className="space-y-8">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-32 bg-dust/50 rounded-lg flex items-center justify-center">
                <span className="text-main/50">Content Block {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;