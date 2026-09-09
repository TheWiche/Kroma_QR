import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  description,
  icon,
  badge,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="rounded-2xl bg-obsidian-card/90 border border-obsidian-border/90 overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-obsidian-elevated/40 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-obsidian-module border border-obsidian-border text-persimmon">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-editorial-chalk">
                {title}
              </span>
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-obsidian-module text-persimmon border border-persimmon/20">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-editorial-stone mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-editorial-stone">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-persimmon' : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-obsidian-border/50 animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </div>
  );
};
