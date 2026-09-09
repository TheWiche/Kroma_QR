import React from 'react';
import type { ErrorCorrectionLevel } from 'qr-code-styling';
import { ShieldCheck, Maximize2 } from 'lucide-react';

interface DimensionsAccordionProps {
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  onErrorCorrectionChange: (level: ErrorCorrectionLevel) => void;
  onMarginChange: (margin: number) => void;
}

export const DimensionsAccordion: React.FC<DimensionsAccordionProps> = ({
  errorCorrectionLevel,
  margin,
  onErrorCorrectionChange,
  onMarginChange,
}) => {
  const levels: { id: ErrorCorrectionLevel; label: string; desc: string; percent: string }[] = [
    { id: 'L', label: 'Bajo (L)', desc: 'Básica (para más datos)', percent: '~7%' },
    { id: 'M', label: 'Medio (M)', desc: 'Equilibrado (estándar)', percent: '~15%' },
    { id: 'Q', label: 'Calidad (Q)', desc: 'Alta legibilidad', percent: '~25%' },
    { id: 'H', label: 'Alto (H)', desc: 'Máxima (ideal con logo)', percent: '~30%' },
  ];

  return (
    <div className="space-y-4 pt-2">
      {/* Error correction levels */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-persimmon" />
          <label className="text-xs font-semibold text-editorial-stone uppercase tracking-wider">
            Resistencia a daños
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {levels.map((lvl) => {
            const isSelected = errorCorrectionLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onErrorCorrectionChange(lvl.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-persimmon/15 border-persimmon text-editorial-chalk shadow-amber-sm'
                    : 'bg-obsidian-module border-obsidian-border text-editorial-stone hover:text-editorial-chalk'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-editorial-chalk">{lvl.id}</span>
                  <span className="text-[10px] font-mono text-persimmon">{lvl.percent}</span>
                </div>
                <div className="text-[11px] text-editorial-ash leading-tight">{lvl.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Margin / Quiet zone */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-editorial-stone uppercase tracking-wider flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-persimmon" />
            Margen blanco
          </label>
          <span className="text-xs font-mono text-editorial-chalk">{margin} px</span>
        </div>
        <input
          type="range"
          min="0"
          max="36"
          step="2"
          value={margin}
          onChange={(e) => onMarginChange(parseInt(e.target.value, 10))}
          className="w-full accent-persimmon cursor-pointer h-1.5 bg-obsidian-module rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-editorial-ash mt-1">
          <span>0px (Sin margen)</span>
          <span>12px (Recomendado)</span>
          <span>36px (Amplio)</span>
        </div>
      </div>
    </div>
  );
};
