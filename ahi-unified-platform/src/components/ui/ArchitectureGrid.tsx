/**
 * Componente Architecture Grid - Implementación Tailwind CSS
 * Basado en el diseño de AHI Governance Labs Architecture Section
 * Implementa grid layouts responsive con glass panels
 */

import React from 'react';
import { cn } from '@/lib/utils';
import GlassPanel, { GlassPanelTitle, GlassPanelContent, GlassPanelTags } from './GlassPanel';

export interface ArchitectureCard {
  title: string;
  description: string;
  tags: string[];
  icon?: string;
  color?: 'cyan' | 'magenta' | 'gold' | 'green' | 'purple';
  link?: string;
}

export interface ArchitectureGridProps {
  title?: string;
  subtitle?: string;
  cards: ArchitectureCard[];
  variant?: 'arch-grid' | 'genesis' | 'manifesto';
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  showTags?: boolean;
  animated?: boolean;
}

export const ArchitectureGrid: React.FC<ArchitectureGridProps> = ({
  title = "Architecture",
  subtitle = "Digital Infrastructure Components",
  cards,
  variant = 'arch-grid',
  columns = 3,
  className,
  showTags = true,
  animated = true
}) => {
  const gridClasses = {
    'arch-grid': 'grid-cols-arch-grid',
    'genesis': 'grid-cols-genesis',
    'manifesto': 'grid-cols-manifesto'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const getColumnClass = () => {
    if (variant === 'arch-grid') return gridClasses['arch-grid'];
    if (variant === 'genesis') return gridClasses['genesis'];
    if (variant === 'manifesto') return gridClasses['manifesto'];
    return columnClasses[columns];
  };

  return (
    <section className={cn(
      "py-24 md:py-32 bg-void relative overflow-hidden",
      className
    )}>
      {/* Background Effects */}
      <div className="bg-stars" />
      <div className="noise-overlay" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-black font-display mb-4",
            "text-gradient-hero animate-gradient-shift"
          )}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-main/70 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className={cn(
          "grid gap-8",
          getColumnClass()
        )}>
          {cards.map((card, index) => (
            <ArchitectureCard
              key={index}
              card={card}
              showTags={showTags}
              animated={animated}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Sub-componente para tarjetas individuales
interface ArchitectureCardProps {
  card: ArchitectureCard;
  showTags?: boolean;
  animated?: boolean;
  delay?: number;
}

const ArchitectureCard: React.FC<ArchitectureCardProps> = ({
  card,
  showTags = true,
  animated = true,
  delay = 0
}) => {
  const { title, description, tags, icon, color = 'cyan', link } = card;

  const cardContent = (
    <GlassPanel
      variant="neon"
      glowColor={color}
      padding="lg"
      hover={true}
      animated={false}
      className={cn(
        "h-full transition-all duration-400",
        animated && "reveal",
        animated && delay && `reveal-stagger-${Math.min(delay * 10 + 1, 3)}`
      )}
    >
      {/* Icon */}
      {icon && (
        <div className={cn(
          "w-12 h-12 rounded-lg mb-4 flex items-center justify-center",
          `bg-${color}/20 text-${color}`
        )}>
          <span className="text-2xl">{icon}</span>
        </div>
      )}

      {/* Title */}
      <GlassPanelTitle color={color}>
        {title}
      </GlassPanelTitle>

      {/* Description */}
      <GlassPanelContent>
        {description}
      </GlassPanelContent>

      {/* Tags */}
      {showTags && tags.length > 0 && (
        <GlassPanelTags tags={tags} color={color} />
      )}

      {/* Link indicator */}
      {link && (
        <div className={cn(
          "mt-4 text-sm font-medium",
          `text-${color} hover:text-${color}-dim transition-colors`
        )}>
          Learn more →
        </div>
      )}
    </GlassPanel>
  );

  return link ? (
    <a href={link} className="block group">
      {cardContent}
    </a>
  ) : (
    cardContent
  );
};

// Componente de ejemplo con datos de muestra
export const ArchitectureGridExample: React.FC = () => {
  const sampleCards: ArchitectureCard[] = [
    {
      title: "Quantum Core",
      description: "Advanced quantum computing infrastructure for cryptographic operations and secure communications.",
      tags: ["Quantum", "Crypto", "Security"],
      icon: "⚛️",
      color: "cyan",
      link: "/quantum"
    },
    {
      title: "Neural Networks",
      description: "Distributed AI systems with self-organizing capabilities for autonomous decision making.",
      tags: ["AI", "Neural", "Autonomous"],
      icon: "🧠",
      color: "magenta",
      link: "/neural"
    },
    {
      title: "Blockchain Fabric",
      description: "Interconnected blockchain networks providing immutable data storage and verification.",
      tags: ["Blockchain", "Immutable", "Verification"],
      icon: "🔗",
      color: "gold",
      link: "/blockchain"
    },
    {
      title: "Edge Computing",
      description: "Distributed computing nodes at the network edge for reduced latency and enhanced performance.",
      tags: ["Edge", "Performance", "Latency"],
      icon: "🌐",
      color: "green",
      link: "/edge"
    },
    {
      title: "Cybersecurity Mesh",
      description: "Comprehensive security framework protecting digital assets and ensuring data integrity.",
      tags: ["Security", "Protection", "Integrity"],
      icon: "🛡️",
      color: "purple",
      link: "/security"
    },
    {
      title: "Data Analytics",
      description: "Advanced analytics platform processing vast datasets to extract meaningful insights.",
      tags: ["Analytics", "Data", "Insights"],
      icon: "📊",
      color: "cyan",
      link: "/analytics"
    }
  ];

  return (
    <ArchitectureGrid
      title="Digital Architecture"
      subtitle="Next-generation infrastructure components powering the sovereign digital ecosystem"
      cards={sampleCards}
      variant="arch-grid"
      columns={3}
      animated={true}
    />
  );
};

export default ArchitectureGrid;