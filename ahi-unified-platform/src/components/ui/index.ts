/**
 * Componente index para exportar todos los componentes UI
 * Facilita la importación de componentes desde otros archivos
 */

export { default as HeroSection } from './HeroSection';
export type { HeroSectionProps } from './HeroSection';

export { default as GlassPanel } from './GlassPanel';
export { 
  GlassPanelTitle, 
  GlassPanelContent, 
  GlassPanelTags 
} from './GlassPanel';
export type { GlassPanelProps } from './GlassPanel';

export { default as ArchitectureGrid } from './ArchitectureGrid';
export { ArchitectureGridExample } from './ArchitectureGrid';
export type { ArchitectureGridProps, ArchitectureCard } from './ArchitectureGrid';

export { default as Navigation } from './Navigation';
export { NavigationExample } from './Navigation';
export type { NavigationProps, NavItem } from './Navigation';

export { DialogueBox } from './DialogueBox';
export type { DialogueBoxProps } from './DialogueBox';