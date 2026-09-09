import React from 'react';
import type { CornerSquareType, CornerDotType } from 'qr-code-styling';
import { Check } from 'lucide-react';

interface EyesAccordionProps {
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  customCornerColors: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;
  onSquareTypeChange: (type: CornerSquareType) => void;
  onDotTypeChange: (type: CornerDotType) => void;
  onToggleCustomColors: (enabled: boolean) => void;
  onSquareColorChange: (color: string) => void;
  onDotColorChange: (color: string) => void;
}

export const EyesAccordion: React.FC<EyesAccordionProps> = ({
  cornerSquareType,
  cornerDotType,
  customCornerColors,
  cornerSquareColor,
  cornerDotColor,
  onSquareTypeChange,
  onDotTypeChange,
  onToggleCustomColors,
  onSquareColorChange,
  onDotColorChange,
}) => {
  const squareOptions: { id: CornerSquareType; label: string; preview: React.ReactNode }[] = [
    {
      id: 'extra-rounded',
      label: 'Bordes suaves',
      preview: (
        <div className="w-5 h-5 rounded-md border-2 border-current flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-current rounded-sm" />
        </div>
      ),
    },
    {
      id: 'dot',
      label: 'Círculo',
      preview: (
        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-current rounded-full" />
        </div>
      ),
    },
    {
      id: 'square',
      label: 'Cuadrado clásico',
      preview: (
        <div className="w-5 h-5 border-2 border-current flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-current" />
        </div>
      ),
    },
  ];

  const dotOptions: { id: CornerDotType; label: string; preview: React.ReactNode }[] = [
    {
      id: 'dot',
      label: 'Círculo',
      preview: <div className="w-3.5 h-3.5 bg-current rounded-full" />,
    },
    {
      id: 'square',
      label: 'Cuadrado',
      preview: <div className="w-3.5 h-3.5 bg-current" />,
    },
  ];

  return (
    <div className="space-y-4 pt-2">
      {/* Marco Exterior de las esquinas */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Marco exterior de las esquinas
        </label>
        <div className="grid grid-cols-3 gap-2">
          {squareOptions.map((opt) => {
            const isSelected = cornerSquareType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSquareTypeChange(opt.id)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-persimmon/10 border-persimmon text-editorial-chalk ring-1 ring-persimmon/40 shadow-amber-sm'
                    : 'bg-obsidian-module border-obsidian-border text-editorial-stone hover:text-editorial-chalk hover:border-obsidian-elevated'
                }`}
              >
                <div className={isSelected ? 'text-persimmon' : 'text-editorial-stone'}>
                  {opt.preview}
                </div>
                <span className="text-[11px] font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Punto central de las esquinas */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Punto interior de las esquinas
        </label>
        <div className="grid grid-cols-2 gap-2">
          {dotOptions.map((opt) => {
            const isSelected = cornerDotType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onDotTypeChange(opt.id)}
                className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2.5 ${
                  isSelected
                    ? 'bg-persimmon/10 border-persimmon text-editorial-chalk ring-1 ring-persimmon/40 shadow-amber-sm'
                    : 'bg-obsidian-module border-obsidian-border text-editorial-stone hover:text-editorial-chalk hover:border-obsidian-elevated'
                }`}
              >
                <div className={isSelected ? 'text-persimmon' : 'text-editorial-stone'}>
                  {opt.preview}
                </div>
                <span className="text-[11px] font-medium">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-persimmon ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom eye color toggle */}
      <div className="pt-2 border-t border-obsidian-border/50">
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-medium text-editorial-chalk block">
              Colores personalizados para esquinas
            </span>
            <span className="text-[11px] text-editorial-ash block">
              Usa colores diferentes en las esquinas del código QR
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={customCornerColors}
              onChange={(e) => onToggleCustomColors(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-obsidian-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-editorial-chalk after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-persimmon"></div>
          </label>
        </div>

        {customCornerColors && (
          <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-medium text-editorial-stone mb-1.5">
                Color del marco
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-obsidian-module border border-obsidian-border">
                <input
                  type="color"
                  value={cornerSquareColor}
                  onChange={(e) => onSquareColorChange(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={cornerSquareColor}
                  onChange={(e) => onSquareColorChange(e.target.value)}
                  className="w-full text-xs font-mono uppercase bg-transparent text-editorial-chalk focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-editorial-stone mb-1.5">
                Color del centro
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-obsidian-module border border-obsidian-border">
                <input
                  type="color"
                  value={cornerDotColor}
                  onChange={(e) => onDotColorChange(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={cornerDotColor}
                  onChange={(e) => onDotColorChange(e.target.value)}
                  className="w-full text-xs font-mono uppercase bg-transparent text-editorial-chalk focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
