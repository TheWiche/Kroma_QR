import React from 'react';
import type { ColorMode, GradientConfig } from '../../types/qr';
import { COLOR_PALETTES } from '../../lib/constants';
import { Palette, Sparkles, Compass } from 'lucide-react';

interface ColorsAccordionProps {
  colorMode: ColorMode;
  dotColor: string;
  dotGradient: GradientConfig;
  backgroundColor: string;
  transparentBackground: boolean;
  onColorModeChange: (mode: ColorMode) => void;
  onDotColorChange: (color: string) => void;
  onGradientChange: (gradient: Partial<GradientConfig>) => void;
  onBackgroundColorChange: (color: string) => void;
  onTransparentChange: (transparent: boolean) => void;
  onApplyPalette: (p: (typeof COLOR_PALETTES)[number]) => void;
}

export const ColorsAccordion: React.FC<ColorsAccordionProps> = ({
  colorMode,
  dotColor,
  dotGradient,
  backgroundColor,
  transparentBackground,
  onColorModeChange,
  onDotColorChange,
  onGradientChange,
  onBackgroundColorChange,
  onTransparentChange,
  onApplyPalette,
}) => {
  return (
    <div className="space-y-4 pt-2">
      {/* Curated Luxury Studio Palettes (1-Click) */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-persimmon" />
          <label className="text-xs font-semibold text-editorial-stone uppercase tracking-wider">
            Paletas de color recomendadas
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COLOR_PALETTES.map((pal) => (
            <button
              key={pal.name}
              type="button"
              onClick={() => onApplyPalette(pal)}
              className="p-2 rounded-xl bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border text-left group transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: pal.color1 }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: pal.color2 }}
                />
                <span
                  className="w-4 h-4 rounded-full border border-white/20 ml-auto"
                  style={{ backgroundColor: pal.bg }}
                  title={`Fondo: ${pal.bg}`}
                />
              </div>
              <div className="text-[11px] font-medium text-editorial-chalk group-hover:text-persimmon transition-colors truncate">
                {pal.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Switcher: Solid vs Gradient */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Colores de los puntos
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onColorModeChange('solid')}
            className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all flex items-center justify-center gap-2 ${
              colorMode === 'solid'
                ? 'bg-persimmon/15 border-persimmon text-editorial-chalk shadow-amber-sm'
                : 'bg-obsidian-module border-obsidian-border text-editorial-stone hover:text-editorial-chalk'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Un solo color</span>
          </button>

          <button
            type="button"
            onClick={() => onColorModeChange('gradient')}
            className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all flex items-center justify-center gap-2 ${
              colorMode === 'gradient'
                ? 'bg-persimmon/15 border-persimmon text-editorial-chalk shadow-amber-sm'
                : 'bg-obsidian-module border-obsidian-border text-editorial-stone hover:text-editorial-chalk'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #E85A2A 0%, #F97316 100%)',
              }}
            />
            <span>Degradado</span>
          </button>
        </div>
      </div>

      {/* Solid Color Config */}
      {colorMode === 'solid' && (
        <div className="p-3 rounded-xl bg-obsidian-module border border-obsidian-border animate-in fade-in duration-150">
          <label className="block text-[11px] font-medium text-editorial-stone mb-2">
            Color de los puntos
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={dotColor}
              onChange={(e) => onDotColorChange(e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-none"
            />
            <input
              type="text"
              value={dotColor}
              onChange={(e) => onDotColorChange(e.target.value)}
              className="w-32 py-1.5 px-2.5 rounded-lg bg-obsidian-card border border-obsidian-border text-xs font-mono uppercase text-editorial-chalk focus:outline-none focus:border-persimmon"
            />
            <span className="text-xs text-editorial-ash">Hex</span>
          </div>
        </div>
      )}

      {/* Gradient Config */}
      {colorMode === 'gradient' && (
        <div className="p-3.5 rounded-xl bg-obsidian-module border border-obsidian-border space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-editorial-stone mb-1.5">
                Primer color
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-obsidian-card border border-obsidian-border">
                <input
                  type="color"
                  value={dotGradient.color1}
                  onChange={(e) => onGradientChange({ color1: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={dotGradient.color1}
                  onChange={(e) => onGradientChange({ color1: e.target.value })}
                  className="w-full text-xs font-mono uppercase bg-transparent text-editorial-chalk focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-editorial-stone mb-1.5">
                Segundo color
              </label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-obsidian-card border border-obsidian-border">
                <input
                  type="color"
                  value={dotGradient.color2}
                  onChange={(e) => onGradientChange({ color2: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={dotGradient.color2}
                  onChange={(e) => onGradientChange({ color2: e.target.value })}
                  className="w-full text-xs font-mono uppercase bg-transparent text-editorial-chalk focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Gradient Type and Rotation */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-editorial-stone mb-1.5">
                Tipo de degradado
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['linear', 'radial'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onGradientChange({ type: t })}
                    className={`py-1.5 text-xs font-medium rounded-lg border capitalize ${
                      dotGradient.type === t
                        ? 'bg-persimmon/15 border-persimmon text-editorial-chalk'
                        : 'bg-obsidian-card border-obsidian-border text-editorial-stone hover:text-editorial-chalk'
                    }`}
                  >
                    {t === 'linear' ? 'Lineal' : 'Circular'}
                  </button>
                ))}
              </div>
            </div>

            {dotGradient.type === 'linear' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-editorial-stone flex items-center gap-1">
                    <Compass className="w-3 h-3 text-persimmon" />
                    Dirección
                  </label>
                  <span className="text-[11px] font-mono text-editorial-chalk">
                    {dotGradient.rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={dotGradient.rotation}
                  onChange={(e) => onGradientChange({ rotation: Number(e.target.value) })}
                  className="w-full accent-persimmon cursor-pointer h-1.5 bg-obsidian-card rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background Color Config */}
      <div className="pt-2 border-t border-obsidian-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-medium text-editorial-chalk block">
              Fondo transparente
            </span>
            <span className="text-[11px] text-editorial-ash block">
              Ideal para stickers, corte o sobreponer en otros diseños
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={transparentBackground}
              onChange={(e) => onTransparentChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-obsidian-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-editorial-chalk after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-persimmon"></div>
          </label>
        </div>

        {!transparentBackground && (
          <div className="p-3 rounded-xl bg-obsidian-module border border-obsidian-border flex items-center justify-between animate-in fade-in duration-150">
            <span className="text-xs text-editorial-stone font-medium">
              Color de fondo
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-none"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-24 py-1 px-2 rounded-lg bg-obsidian-card border border-obsidian-border text-xs font-mono uppercase text-editorial-chalk focus:outline-none focus:border-persimmon"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
