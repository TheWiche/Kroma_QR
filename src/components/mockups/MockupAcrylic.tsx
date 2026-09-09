import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Wifi,
  Utensils,
  Maximize2,
  FileDown,
  Rotate3d,
} from 'lucide-react';
import { exportToA4PDF } from './ExportPDF';

export type AcrylicBaseType = 'wood' | 'metal' | 'acrylic';
export type AcrylicThemeType = 'obsidian' | 'chalk' | 'amber';

export interface MockupAcrylicProps {
  /** Optional rendered QR code element (e.g. canvas or SVG wrapper from useQRCode) */
  qrElement?: React.ReactNode;
  /** Optional QR image data URL */
  qrDataUrl?: string;
  /** Primary title on the table insert */
  title?: string;
  /** Subtitle / scan incentive */
  subtitle?: string;
  /** Table number or zone identifier */
  tableNumber?: string;
  /** Venue or restaurant name */
  venueName?: string;
  /** Stand base material */
  initialBase?: AcrylicBaseType;
  /** Printed insert theme */
  initialTheme?: AcrylicThemeType;
  /** Enable interactive controls toolbar */
  showControls?: boolean;
  /** Extra container className */
  className?: string;
}

export const MockupAcrylic: React.FC<MockupAcrylicProps> = ({
  qrElement,
  qrDataUrl,
  title = 'MENÚ DIGITAL & WI-FI',
  subtitle = 'Apunta con tu cámara para ordenar directamente desde tu móvil',
  tableNumber = 'MESA 08',
  venueName = 'KROMA BISTRO & LOUNGE',
  initialBase = 'wood',
  initialTheme = 'obsidian',
  showControls = true,
  className = '',
}) => {
  const [baseType, setBaseType] = useState<AcrylicBaseType>(initialBase);
  const [theme, setTheme] = useState<AcrylicThemeType>(initialTheme);
  const [is3D, setIs3D] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const acrylicRef = useRef<HTMLDivElement>(null);

  // Fallback vector QR placeholder if no QR element or image is provided
  const renderQrPlaceholder = () => (
    <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center rounded-xl bg-obsidian-base border border-persimmon/20 p-2 shadow-inner">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-editorial-chalk"
        fill="currentColor"
      >
        {/* Finder Pattern Top-Left */}
        <rect x="10" y="10" width="24" height="24" rx="4" fill="#E85A2A" />
        <rect x="14" y="14" width="16" height="16" rx="2" fill="#0D0C0E" />
        <rect x="18" y="18" width="8" height="8" rx="2" fill="#F97316" />

        {/* Finder Pattern Top-Right */}
        <rect x="66" y="10" width="24" height="24" rx="4" fill="#E85A2A" />
        <rect x="70" y="14" width="16" height="16" rx="2" fill="#0D0C0E" />
        <rect x="74" y="18" width="8" height="8" rx="2" fill="#F97316" />

        {/* Finder Pattern Bottom-Left */}
        <rect x="10" y="66" width="24" height="24" rx="4" fill="#E85A2A" />
        <rect x="14" y="70" width="16" height="16" rx="2" fill="#0D0C0E" />
        <rect x="18" y="74" width="8" height="8" rx="2" fill="#F97316" />

        {/* Stylized Data dots */}
        <circle cx="42" cy="18" r="2.5" fill="#E85A2A" />
        <circle cx="50" cy="18" r="2.5" fill="#F97316" />
        <circle cx="58" cy="18" r="2.5" fill="#E85A2A" />
        <circle cx="42" cy="26" r="2.5" fill="#E85A2A" />
        <circle cx="50" cy="26" r="2.5" fill="#F4F3EF" />
        <circle cx="58" cy="26" r="2.5" fill="#F97316" />

        <circle cx="42" cy="42" r="3" fill="#F97316" />
        <circle cx="50" cy="42" r="3" fill="#E85A2A" />
        <circle cx="58" cy="42" r="3" fill="#F4F3EF" />
        <circle cx="42" cy="50" r="3" fill="#F4F3EF" />
        <circle cx="50" cy="50" r="3" fill="#E85A2A" />
        <circle cx="58" cy="50" r="3" fill="#F97316" />
        <circle cx="42" cy="58" r="3" fill="#E85A2A" />
        <circle cx="50" cy="58" r="3" fill="#F97316" />
        <circle cx="58" cy="58" r="3" fill="#E85A2A" />

        <circle cx="70" cy="42" r="2.5" fill="#F4F3EF" />
        <circle cx="78" cy="42" r="2.5" fill="#E85A2A" />
        <circle cx="86" cy="42" r="2.5" fill="#F97316" />
        <circle cx="70" cy="50" r="2.5" fill="#E85A2A" />
        <circle cx="78" cy="50" r="2.5" fill="#F4F3EF" />
        <circle cx="86" cy="50" r="2.5" fill="#E85A2A" />

        <circle cx="18" cy="46" r="2.5" fill="#F97316" />
        <circle cx="26" cy="46" r="2.5" fill="#E85A2A" />
        <circle cx="18" cy="54" r="2.5" fill="#E85A2A" />
        <circle cx="26" cy="54" r="2.5" fill="#F4F3EF" />

        <circle cx="74" cy="74" r="3" fill="#E85A2A" />
        <circle cx="82" cy="74" r="3" fill="#F97316" />
        <circle cx="74" cy="82" r="3" fill="#F4F3EF" />
        <circle cx="82" cy="82" r="3" fill="#E85A2A" />
      </svg>
    </div>
  );

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      // Look for canvas inside acrylicRef or fallback to element screenshot
      const canvas = acrylicRef.current?.querySelector('canvas') || acrylicRef.current;
      if (!canvas) {
        alert('No se detectó un lienzo QR activo para exportar');
        return;
      }
      await exportToA4PDF(canvas, {
        fileName: `acrilico-${tableNumber.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        title: venueName,
        subtitle: title,
        template: 'acrylic-tent',
        label: subtitle,
      });
    } catch (err) {
      console.error('Error al exportar PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center w-full select-none ${className}`}>
      {/* Interactive Controls Bar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-lg mb-6 p-2.5 rounded-xl bg-obsidian-card/80 border border-obsidian-border/80 backdrop-blur-md text-xs">
          {/* Base Material Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-editorial-stone font-medium mr-1">Base:</span>
            <button
              type="button"
              onClick={() => setBaseType('wood')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                baseType === 'wood'
                  ? 'bg-amber-800/40 text-amber-200 border border-amber-600/40 font-semibold'
                  : 'text-editorial-ash hover:text-editorial-chalk hover:bg-obsidian-elevated'
              }`}
            >
              Nogal
            </button>
            <button
              type="button"
              onClick={() => setBaseType('metal')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                baseType === 'metal'
                  ? 'bg-zinc-700/50 text-editorial-chalk border border-zinc-500/40 font-semibold'
                  : 'text-editorial-ash hover:text-editorial-chalk hover:bg-obsidian-elevated'
              }`}
            >
              Aluminio
            </button>
            <button
              type="button"
              onClick={() => setBaseType('acrylic')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                baseType === 'acrylic'
                  ? 'bg-persimmon/20 text-persimmon-light border border-persimmon/40 font-semibold'
                  : 'text-editorial-ash hover:text-editorial-chalk hover:bg-obsidian-elevated'
              }`}
            >
              Acrílico
            </button>
          </div>

          {/* Theme Card Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-editorial-stone font-medium mr-1">Fondo:</span>
            <button
              type="button"
              onClick={() => setTheme('obsidian')}
              className={`px-2 py-1 rounded-md transition-colors ${
                theme === 'obsidian'
                  ? 'bg-obsidian-module text-persimmon border border-persimmon/30 font-semibold'
                  : 'text-editorial-ash hover:text-editorial-chalk'
              }`}
              title="Obsidian Dark"
            >
              Oscuro
            </button>
            <button
              type="button"
              onClick={() => setTheme('chalk')}
              className={`px-2 py-1 rounded-md transition-colors ${
                theme === 'chalk'
                  ? 'bg-stone-200 text-stone-900 font-semibold'
                  : 'text-editorial-ash hover:text-editorial-chalk'
              }`}
              title="Papel Chalk White"
            >
              Blanco
            </button>
            <button
              type="button"
              onClick={() => setTheme('amber')}
              className={`px-2 py-1 rounded-md transition-colors ${
                theme === 'amber'
                  ? 'bg-amber-container text-obsidian-base font-semibold'
                  : 'text-editorial-ash hover:text-editorial-chalk'
              }`}
              title="Resplandor Ámbar"
            >
              Ámbar
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => setIs3D((prev) => !prev)}
              className={`p-1.5 rounded-lg border transition-colors ${
                is3D
                  ? 'bg-persimmon/15 border-persimmon/40 text-persimmon'
                  : 'bg-obsidian-module border-obsidian-border text-editorial-stone hover:text-editorial-chalk'
              }`}
              title={is3D ? 'Desactivar perspectiva 3D' : 'Activar perspectiva 3D'}
            >
              <Rotate3d className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-persimmon hover:bg-persimmon-hover text-obsidian-base font-semibold transition-all shadow-amber-sm disabled:opacity-50"
              title="Descargar plantilla A4 de inserción para este acrílico"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exportando...' : 'PDF A4'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Stage for the Acrylic Stand */}
      <div className="relative w-full max-w-md flex flex-col items-center justify-end py-10 px-4 perspective-[1400px]">
        {/* Soft Ambient Light Halo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-persimmon/10 via-amber-golden/5 to-transparent blur-3xl pointer-events-none" />

        {/* 3D Acrylic Stand Container */}
        <div
          ref={acrylicRef}
          className="relative transition-transform duration-500 ease-out z-10"
          style={{
            transform: is3D
              ? 'rotateX(8deg) rotateY(-4deg) rotateZ(0.5deg) scale(0.96)'
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ============================================================== */}
          {/* ACRYLIC PLAQUE BODY (Glass slab with beveled refractive edges) */}
          {/* ============================================================== */}
          <div
            className="relative w-64 sm:w-72 rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 transition-all duration-300"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0.01) 70%, rgba(255, 255, 255, 0.08) 100%)',
              boxShadow: `
                0 30px 60px -12px rgba(0, 0, 0, 0.75),
                0 18px 36px -18px rgba(0, 0, 0, 0.5),
                inset 0 1.5px 2px rgba(255, 255, 255, 0.6),
                inset 1px 0 2px rgba(255, 255, 255, 0.3),
                inset -1px 0 2px rgba(255, 255, 255, 0.3),
                inset 0 -2px 4px rgba(0, 0, 0, 0.4)
              `,
              padding: '14px 14px 18px 14px',
            }}
          >
            {/* Top polished bevel highlight */}
            <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Specular Diagonal Reflection Beam (Realistic glass gloss) */}
            <div
              className="absolute -inset-y-20 -left-10 w-44 bg-gradient-to-r from-transparent via-white/12 to-transparent rotate-25 pointer-events-none blur-[1px]"
              style={{ transform: 'skewX(-20deg)' }}
            />
            <div
              className="absolute -inset-y-20 right-4 w-16 bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-25 pointer-events-none blur-sm"
              style={{ transform: 'skewX(-20deg)' }}
            />

            {/* Corner Light Glint */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-[2px] pointer-events-none" />

            {/* ============================================================== */}
            {/* PRINTED INSERT CARD (Trapped inside the acrylic sandwich)      */}
            {/* ============================================================== */}
            <div
              className={`relative rounded-xl p-5 flex flex-col items-center text-center transition-colors duration-300 ${
                theme === 'obsidian'
                  ? 'bg-gradient-to-b from-[#18171B] to-[#100F12] text-editorial-chalk border border-white/5 shadow-2xl'
                  : theme === 'chalk'
                  ? 'bg-[#FDFCFA] text-[#1C1917] border border-stone-200 shadow-md'
                  : 'bg-gradient-to-b from-[#251711] to-[#120B08] text-amber-50 border border-amber-500/20 shadow-2xl'
              }`}
            >
              {/* Header Badge: Table Number */}
              <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-persimmon animate-ping" />
                  <span
                    className={`text-[10px] font-bold tracking-widest font-mono uppercase ${
                      theme === 'chalk' ? 'text-stone-600' : 'text-editorial-stone'
                    }`}
                  >
                    {tableNumber}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-persimmon font-semibold tracking-wider">
                  <Utensils className="w-3 h-3" />
                  <span>MENU</span>
                </div>
              </div>

              {/* Venue Name */}
              <h4
                className={`text-[11px] font-bold tracking-widest uppercase mb-1 font-outfit ${
                  theme === 'chalk' ? 'text-stone-800' : 'text-editorial-stone'
                }`}
              >
                {venueName}
              </h4>

              {/* Title Header */}
              <h3
                className={`text-sm font-extrabold tracking-tight mb-3 ${
                  theme === 'chalk'
                    ? 'text-stone-900'
                    : theme === 'amber'
                    ? 'text-amber-sunset'
                    : 'text-editorial-chalk'
                }`}
              >
                {title}
              </h3>

              {/* QR Code Container */}
              <div
                className={`relative p-2.5 rounded-xl border mb-3.5 transition-all ${
                  theme === 'chalk'
                    ? 'bg-white border-stone-200 shadow-sm'
                    : 'bg-obsidian-substrate/90 border-white/10 shadow-inner'
                }`}
              >
                {/* Render live QR component, image, or crisp fallback */}
                {qrElement ? (
                  <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center overflow-hidden">
                    {qrElement}
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                  />
                ) : (
                  renderQrPlaceholder()
                )}

                {/* Micro Scan Prompt overlay on hover */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-persimmon text-obsidian-base font-bold text-[9px] uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Escanea Aquí</span>
                </div>
              </div>

              {/* Subtitle / Scan Instructions */}
              <p
                className={`text-[11px] leading-relaxed max-w-[200px] mb-3 ${
                  theme === 'chalk' ? 'text-stone-600' : 'text-editorial-stone'
                }`}
              >
                {subtitle}
              </p>

              {/* Footer Badges: Wi-Fi & Contactless */}
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/5 w-full text-[10px]">
                <div
                  className={`flex items-center gap-1 ${
                    theme === 'chalk' ? 'text-stone-500' : 'text-editorial-ash'
                  }`}
                >
                  <Wifi className="w-3 h-3 text-persimmon" />
                  <span>Wi-Fi Gratis</span>
                </div>
                <span className="text-editorial-ash/40">•</span>
                <div
                  className={`flex items-center gap-1 ${
                    theme === 'chalk' ? 'text-stone-500' : 'text-editorial-ash'
                  }`}
                >
                  <Maximize2 className="w-3 h-3 text-amber-golden" />
                  <span>Pago Móvil</span>
                </div>
              </div>
            </div>

            {/* Bottom edge reflection inside the acrylic slab */}
            <div className="absolute inset-x-4 bottom-1 h-2 bg-gradient-to-t from-white/10 to-transparent rounded-full pointer-events-none" />
          </div>

          {/* ============================================================== */}
          {/* STAND BASE (Material realistic slot stand)                     */}
          {/* ============================================================== */}
          <div className="relative -mt-2 flex flex-col items-center z-20">
            {/* Base Slot Inset Shadow (where acrylic enters base) */}
            <div className="w-48 h-1 bg-black/80 rounded-full blur-[0.5px] z-20" />

            {baseType === 'wood' && (
              /* Rich American Walnut Wood Base */
              <div
                className="relative w-60 sm:w-68 h-7 rounded-lg border border-amber-950/40 shadow-xl overflow-hidden flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(180deg, #4A2B1D 0%, #351C12 35%, #24130A 100%)',
                  boxShadow: `
                    0 10px 25px -4px rgba(0, 0, 0, 0.8),
                    inset 0 1px 1px rgba(245, 158, 11, 0.35),
                    inset 0 -2px 3px rgba(0, 0, 0, 0.8)
                  `,
                }}
              >
                {/* Woodgrain subtle streaks */}
                <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,rgba(0,0,0,0.4)_16px,transparent_30px)] pointer-events-none" />
                {/* Brass mini-plate branding */}
                <div className="px-3 py-0.5 rounded-sm bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 text-[8px] font-black tracking-widest text-stone-900 shadow-sm">
                  KROMA
                </div>
              </div>
            )}

            {baseType === 'metal' && (
              /* Anodized Brushed Gunmetal Aluminum Base */
              <div
                className="relative w-60 sm:w-68 h-7 rounded-lg border border-zinc-500/30 shadow-xl overflow-hidden flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(180deg, #3A393E 0%, #201F23 45%, #141316 100%)',
                  boxShadow: `
                    0 10px 25px -4px rgba(0, 0, 0, 0.85),
                    inset 0 1px 1.5px rgba(255, 255, 255, 0.4),
                    inset 0 -2px 4px rgba(0, 0, 0, 0.9)
                  `,
                }}
              >
                {/* Horizontal brushed metal sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />
                <div className="text-[8px] font-bold tracking-widest text-editorial-stone font-mono uppercase">
                  STUDIO EDITION
                </div>
              </div>
            )}

            {baseType === 'acrylic' && (
              /* Monolithic Solid Crystal Acrylic Block */
              <div
                className="relative w-60 sm:w-68 h-7 rounded-lg border border-white/30 backdrop-blur-md shadow-xl overflow-hidden flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.06) 60%, rgba(0, 0, 0, 0.3) 100%)',
                  boxShadow: `
                    0 12px 28px -4px rgba(0, 0, 0, 0.7),
                    inset 0 1.5px 2px rgba(255, 255, 255, 0.8),
                    inset 0 -1.5px 3px rgba(0, 0, 0, 0.5)
                  `,
                }}
              >
                <div className="w-12 h-1 bg-white/40 rounded-full blur-[1px]" />
              </div>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* TABLE SURFACE & CONTACT SHADOW (Studio Lighting Setup)           */}
        {/* ================================================================ */}
        <div className="relative w-full flex flex-col items-center mt-[-10px] z-0 pointer-events-none">
          {/* Main Contact Shadow (Sharp dark line right below base) */}
          <div className="w-56 sm:w-64 h-3 rounded-full bg-black/95 blur-[3px]" />
          {/* Ambient Occlusion Soft Spread Shadow */}
          <div className="w-72 sm:w-84 h-8 -mt-2 rounded-full bg-black/70 blur-xl" />
          {/* Subtle Ground Reflection of the Base */}
          <div className="w-52 h-4 -mt-3 rounded-full bg-persimmon/10 blur-lg" />
        </div>
      </div>
    </div>
  );
};
