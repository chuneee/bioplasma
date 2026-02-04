import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
}

export function PlaceholderView({ title, description }: PlaceholderViewProps) {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
          <Construction size={40} strokeWidth={1.5} className="text-[var(--color-primary)]" />
        </div>
        <h3 className="mb-3 text-[var(--color-text)]">{title}</h3>
        <p className="text-[var(--color-text-secondary)] mb-6">
          {description}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
          <span className="text-[var(--color-primary)]" style={{ fontSize: '14px' }}>
            En desarrollo
          </span>
        </div>
      </div>
    </div>
  );
}
