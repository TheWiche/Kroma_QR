import React from 'react';
import type { DotType } from 'qr-code-styling';
import { Check } from 'lucide-react';

interface DotsAccordionProps {
  selected: DotType;
  onChange: (type: DotType) => void;
}

interface DotOption {
  id: DotType;
  label: string;
  description: string;
  preview: React.ReactNode;
}

export const DotsAccordion: React.FC<DotsAccordionProps> = ({ selected, onChange }) => {
  const options: DotOption[] = [
    {
      id: 'rounded',
      label: 'Redondeado',
      description: 'Esquinas redondeadas y suaves',
      preview: (
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <span className="w-2.5 h-2.5 bg-current rounded-sm" />
          <span className="w-2.5 h-2.5 bg-current rounded-sm" />
          <span className="w-2.5 h-2.5 bg-current rounded-sm" />
          <span className="w-2.5 h-2.5 bg-current rounded-sm" />
        </div>
      ),
    },
    {
      id: 'dots',
      label: 'Puntos circulares',
      description: 'Círculos independientes y modernos',
      preview: (
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <span className="w-2.5 h-2.5 bg-current rounded-full" />
          <span className="w-2.5 h-2.5 bg-current rounded-full" />
          <span className="w-2.5 h-2.5 bg-current rounded-full" />
          <span className="w-2.5 h-2.5 bg-current rounded-full" />
        </div>
      ),
    },
    {
      id: 'extra-rounded',
      label: 'Muy redondeado',
      description: 'Puntos alargados y suaves',
      preview: (
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <span className="w-2.5 h-2.5 bg-current rounded-md" />
          <span className="w-2.5 h-2.5 bg-current rounded-md" />
          <span className="w-2.5 h-2.5 bg-current rounded-md" />
          <span className="w-2.5 h-2.5 bg-current rounded-md" />
        </div>
      ),
    },
    {
      id: 'classy',
      label: 'Elegante',
      description: 'Estilo moderno con esquinas cortadas',
      preview: (
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <span className="w-2.5 h-2.5 bg-current rounded-tl-lg rounded-br-lg" />
          <span className="w-2.5 h-2.5 bg-current rounded-tr-lg rounded-bl-lg" />
          <span className="w-2.5 h-2.5 bg-current rounded-tr-lg rounded-bl-lg" />
          <span className="w-2.5 h-2.5 bg-current rounded-tl-lg rounded-br-lg" />
        </div>
      ),
    },
    {
      id: 'classy-rounded',
      label: 'Elegante suave',
      description: 'Combinación de esquinas rectas y curvas',
      preview: (
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <span className="w-2.5 h-2.5 bg-current rounded-tl-full rounded-br-md" />
          <span className="w-2.5 h-2.5 bg-current rounded-tr-full rounded-bl-md" />
          <span className="w-2.5 h-2.5 bg-current rounded-tr-full rounded-bl-md" />
          <span className="w-2.5 h-2.5 bg-current rounded-tl-full rounded-br-md" />
        </div>
      ),
    },
    {
      id: 'square',
      label: 'Cuadrado tradicional',
      description: 'El estilo clásico de código QR',
      preview: (
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <span className="w-2.5 h-2.5 bg-current" />
          <span className="w-2.5 h-2.5 bg-current" />
          <span className="w-2.5 h-2.5 bg-current" />
          <span className="w-2.5 h-2.5 bg-current" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-persimmon/10 border-persimmon text-editorial-chalk ring-1 ring-persimmon/40 shadow-amber-sm'
                  : 'bg-obsidian-module/80 border-obsidian-border text-editorial-stone hover:text-editorial-chalk hover:border-obsidian-elevated'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-persimmon/20 text-persimmon'
                      : 'bg-obsidian-card text-editorial-stone'
                  }`}
                >
                  {opt.preview}
                </div>
                <div>
                  <div className="text-xs font-semibold text-editorial-chalk">
                    {opt.label}
                  </div>
                  <div className="text-[11px] text-editorial-ash leading-tight mt-0.5">
                    {opt.description}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-persimmon text-obsidian-base flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
