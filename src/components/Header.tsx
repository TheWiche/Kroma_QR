import React from 'react';
import { QrCode, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="border-b border-obsidian-border/80 bg-obsidian-substrate/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-persimmon/15 border border-persimmon/30 shadow-amber-sm text-persimmon">
            <QrCode className="w-5 h-5 text-persimmon" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-persimmon rounded-full animate-pulse ring-2 ring-obsidian-substrate" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-editorial-chalk font-outfit">
                Kroma <span className="text-persimmon font-extrabold">QR</span> Studio
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-persimmon/10 text-persimmon border border-persimmon/20">
                Obsidian Edition
              </span>
            </div>
            <p className="text-xs text-editorial-stone hidden md:block">
              Generador de códigos QR fácil de usar
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Reset Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('¿Deseas volver a los valores iniciales del código QR?')) {
                onReset();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border text-editorial-stone hover:text-persimmon-light transition-colors"
            title="Empezar de nuevo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Empezar de nuevo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
