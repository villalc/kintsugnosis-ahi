import React from 'react';
import { cn } from '@/lib/utils';

export interface DialogueBoxProps {
  speaker: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  timestamp?: string;
  className?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  children,
  icon,
  timestamp,
  className,
}) => {
  return (
    <div className={cn(
      "bg-main/5 border-l-2 border-accent my-10 overflow-hidden transition-colors duration-300",
      className
    )}>
      <div className="bg-void/40 px-4 py-2 flex justify-between items-center font-mono text-xs text-main/60 border-b border-glass">
        <div className="flex items-center">
          <span className="font-bold text-accent text-xs uppercase mr-2 tracking-wider">
            {speaker}
          </span>
          {icon && <span className="ml-2 text-accent">{icon}</span>}
        </div>
        {timestamp && <span>{timestamp}</span>}
      </div>
      <div className="px-8 py-5 font-mono text-sm text-main/70 leading-relaxed">
        {children}
      </div>
    </div>
  );
};
