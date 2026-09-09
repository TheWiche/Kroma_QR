import React, { useState, useRef } from 'react';
import {
  FileDown,
  Layers,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Globe,
  MapPin,
  Printer,
} from 'lucide-react';
import { exportToA4PDF } from './ExportPDF';

export type CardViewMode = 'perspective' | 'flat-crop';
export type CardTheme = 'obsidian' | 'chalk' | 'terracotta';

export interface MockupCardProps {
  /** Rendered QR element or canvas */
  qrElement?: React.ReactNode;
  /** QR Data URL */
  qrDataUrl?: string;
  /** Cardholder full name */
  name?: string;
  /** Professional title / position */
  title?: string;
  /** Company or organization */
  company?: string;
  /** Contact info */
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  /** Initial view mode */
  initialMode?: CardViewMode;
  /** Initial card color theme */
  initialTheme?: CardTheme;
  /** Show interactive control toolbar */
  showControls?: boolean;
  className?: string;
}

export const MockupCard: React.FC<MockupCardProps> = ({
  qrElement,
  qrDataUrl,
  name = 'Elena Ríos',
  title = 'Directora Creativa & Fundadora',
  company = 'KROMA STUDIO',
  email = 'elena@kromastudio.design',
  phone = '+57 300 123 4567',
  website = 'kroma-qr.studio',
  address = 'Carrera 7 # 112 - 45, Bogotá',
  initialMode = 'perspective',
  initialTheme = 'obsidian',
  showControls = true,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<CardViewMode>(initialMode);
  const [theme, setTheme] = useState<CardTheme>(initialTheme);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fallback vector QR placeholder
  const renderCardQr = () => (
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg p-1.5 bg-white flex items-center justify-center shadow-sm">
      <svg viewBox="0 0 100 100" className="w-full h-full text-obsidian-base" fill="currentColor">
        {/* Finders */}
        <rect x="8" y="8" width="26" height="26" rx="4" fill="#0D0C0E" />
        <rect x="13" y="13" width="16" height="16" rx="2" fill="#FFFFFF" />
        <rect x="17" y="17" width="8" height="8" rx="2" fill="#E85A2A" />

        <rect x="66" y="8" width="26" height="26" rx="4" fill="#0D0C0E" />
        <rect x="71" y="13" width="16" height="16" rx="2" fill="#FFFFFF" />
        <rect x="75" y="17" width="8" height="8" rx="2" fill="#E85A2A" />

        <rect x="8" y="66" width="26" height="26" rx="4" fill="#0D0C0E" />
        <rect x="13" y="71" width="16" height="16" rx="2" fill="#FFFFFF" />
        <rect x="17" y="75" width="8" height="8" rx="2" fill="#E85A2A" />

        {/* Modules */}
        <circle cx="44" cy="16" r="3" fill="#0D0C0E" />
        <circle cx="56" cy="16" r="3" fill="#E85A2A" />
        <circle cx="44" cy="28" r="3" fill="#E85A2A" />
        <circle cx="56" cy="28" r="3" fill="#0D0C0E" />

        <circle cx="44" cy="44" r="3.5" fill="#E85A2A" />
        <circle cx="56" cy="44" r="3.5" fill="#0D0C0E" />
        <circle cx="44" cy="56" r="3.5" fill="#0D0C0E" />
        <circle cx="56" cy="56" r="3.5" fill="#E85A2A" />

        <circle cx="72" cy="44" r="3" fill="#0D0C0E" />
        <circle cx="84" cy="44" r="3" fill="#E85A2A" />
        <circle cx="72" cy="56" r="3" fill="#E85A2A" />
        <circle cx="84" cy="56" r="3" fill="#0D0C0E" />

        <circle cx="74" cy="74" r="3.5" fill="#E85A2A" />
        <circle cx="86" cy="74" r="3.5" fill="#0D0C0E" />
        <circle cx="74" cy="86" r="3.5" fill="#0D0C0E" />
        <circle cx="86" cy="86" r="3.5" fill="#E85A2A" />
      </svg>
    </div>
  );

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const canvas = cardRef.current?.querySelector('canvas') || cardRef.current;
      if (!canvas) {
        alert('No se detectó un lienzo QR activo para exportar');
        return;
      }
      await exportToA4PDF(canvas, {
        fileName: `tarjetas-${name.toLowerCase().replace(/\s+/g, '-')}-A4.pdf`,
        title: company,
        subtitle: `Tarjetas de Visita (10-Up A4) • ${name}`,
        template: 'business-cards',
        includeCropMarks: true,
      });
    } catch (err) {
      console.error('Error exportando PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center w-full select-none ${className}`}>
      {/* Control Toolbar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-2xl mb-6 p-2.5 rounded-xl bg-obsidian-card/80 border border-obsidian-border/80 backdrop-blur-md text-xs">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-obsidian-substrate p-1 rounded-lg border border-obsidian-border">
            <button
              type="button"
              onClick={() => setViewMode('perspective')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                viewMode === 'perspective'
                  ? 'bg-persimmon text-obsidian-base font-bold shadow-sm'
                  : 'text-editorial-stone hover:text-editorial-chalk'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Perspectiva 3D</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('flat-crop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                viewMode === 'flat-crop'
                  ? 'bg-persimmon text-obsidian-base font-bold shadow-sm'
                  : 'text-editorial-stone hover:text-editorial-chalk'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Preprensa (Crop Marks)</span>
            </button>
          </div>

          {/* Theme & Face selectors */}
          <div className="flex items-center gap-2">
            {/* Front / Back Toggle */}
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border text-editorial-stone hover:text-editorial-chalk transition-colors"
              title="Voltear tarjeta"
            >
              <RotateCcw className="w-3 h-3 text-amber-golden" />
              <span>{isFlipped ? 'Ver Frente' : 'Ver Reverso'}</span>
            </button>

            {/* Theme Selector */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTheme('obsidian')}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  theme === 'obsidian'
                    ? 'border-persimmon scale-110 ring-2 ring-persimmon/30'
                    : 'border-white/20'
                } bg-[#141315]`}
                title="Obsidian Dark"
              />
              <button
                type="button"
                onClick={() => setTheme('chalk')}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  theme === 'chalk'
                    ? 'border-persimmon scale-110 ring-2 ring-persimmon/30'
                    : 'border-stone-400'
                } bg-[#F4F3EF]`}
                title="Chalk Cotton White"
              />
              <button
                type="button"
                onClick={() => setTheme('terracotta')}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  theme === 'terracotta'
                    ? 'border-white scale-110 ring-2 ring-amber-500/40'
                    : 'border-transparent'
                } bg-gradient-to-br from-[#E85A2A] to-[#B23812]`}
                title="Terracotta Sunset"
              />
            </div>

            {viewMode === 'flat-crop' && (
              <button
                type="button"
                onClick={() => setShowGuides((prev) => !prev)}
                className={`px-2 py-1 rounded border text-[11px] transition-colors ${
                  showGuides
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                    : 'bg-obsidian-module border-obsidian-border text-editorial-ash'
                }`}
                title="Alternar líneas de sangrado y zona de seguridad"
              >
                Guías {showGuides ? 'ON' : 'OFF'}
              </button>
            )}
          </div>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-persimmon hover:bg-persimmon-hover text-obsidian-base font-bold transition-all shadow-amber-sm disabled:opacity-50"
            title="Descargar pliego A4 con 10 tarjetas listas para imprenta"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generando...' : 'Hoja 10-Up A4'}</span>
          </button>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODE 1: PERSPECTIVE 3D PRESENTATION VIEW                           */}
      {/* ================================================================== */}
      {viewMode === 'perspective' && (
        <div className="relative w-full max-w-xl py-14 px-6 flex items-center justify-center perspective-[1200px]">
          {/* Dynamic Background Studio Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-persimmon/10 blur-3xl pointer-events-none -top-10" />

          {/* Stack Container with 3D Angles */}
          <div
            className="relative transition-all duration-700 ease-out"
            style={{
              transform: 'rotateX(20deg) rotateY(-22deg) rotateZ(4deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* UNDERLYING CARD IN THE STACK (Reverso con branding) */}
            <div
              className="absolute -top-4 -left-6 w-80 sm:w-96 aspect-[85/55] rounded-xl transition-all duration-500 pointer-events-none"
              style={{
                transform: 'translateZ(-28px) rotate(-3deg)',
                background:
                  theme === 'obsidian'
                    ? 'linear-gradient(135deg, #1A191E 0%, #0D0C0E 100%)'
                    : theme === 'chalk'
                    ? 'linear-gradient(135deg, #EAE8E3 0%, #DFDCD6 100%)'
                    : 'linear-gradient(135deg, #BA431B 0%, #872807 100%)',
                boxShadow: '-15px 25px 45px rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Monogram Pattern */}
              <div className="w-full h-full p-6 flex flex-col justify-between opacity-30">
                <div className="text-[10px] font-mono tracking-widest uppercase">
                  {company}
                </div>
                <div className="text-3xl font-black tracking-tighter self-center">
                  K
                </div>
                <div className="text-[8px] font-mono tracking-wider">
                  PREMIUM CARDSTOCK 400GSM
                </div>
              </div>
            </div>

            {/* FOREGROUND HERO CARD (Front Face or Flipped Face) */}
            <div
              ref={cardRef}
              onClick={() => setIsFlipped((prev) => !prev)}
              className="relative w-80 sm:w-96 aspect-[85/55] rounded-xl overflow-hidden cursor-pointer transition-all duration-500"
              style={{
                transform: isFlipped ? 'rotateY(180deg) translateZ(8px)' : 'translateZ(10px)',
                transformStyle: 'preserve-3d',
                boxShadow: `
                  -24px 34px 60px -10px rgba(0, 0, 0, 0.75),
                  -8px 12px 24px -5px rgba(0, 0, 0, 0.5),
                  inset 0 1px 1.5px rgba(255, 255, 255, 0.4),
                  inset 0 -1.5px 2px rgba(0, 0, 0, 0.6)
                `,
                border:
                  theme === 'chalk'
                    ? '1px solid #D6D3CD'
                    : theme === 'terracotta'
                    ? '1px solid rgba(255,255,255,0.2)'
                    : '1px solid rgba(244, 243, 239, 0.12)',
              }}
            >
              {/* FRONT FACE */}
              <div
                className={`w-full h-full p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 ${
                  theme === 'obsidian'
                    ? 'bg-gradient-to-br from-[#1E1D22] via-[#161519] to-[#0D0C0E] text-editorial-chalk'
                    : theme === 'chalk'
                    ? 'bg-gradient-to-br from-[#FDFCFA] via-[#F7F6F2] to-[#ECEAE4] text-[#1C1917]'
                    : 'bg-gradient-to-br from-[#F06543] via-[#E85A2A] to-[#B53C14] text-white'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Paper texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />

                {/* Top Row: Company & NFC Glyph */}
                <div className="relative flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center font-black text-xs ${
                        theme === 'chalk'
                          ? 'bg-stone-900 text-stone-100'
                          : theme === 'terracotta'
                          ? 'bg-stone-950 text-amber-200'
                          : 'bg-persimmon text-obsidian-base'
                      }`}
                    >
                      K
                    </div>
                    <span
                      className={`text-[11px] font-bold tracking-widest uppercase font-outfit ${
                        theme === 'chalk' ? 'text-stone-700' : 'text-editorial-stone'
                      }`}
                    >
                      {company}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono tracking-wider opacity-60">
                    <Sparkles className="w-3 h-3" />
                    <span>DIGITAL VCARD</span>
                  </div>
                </div>

                {/* Middle Row: Information + Dedicated QR Zone */}
                <div className="relative flex items-center justify-between gap-3 z-10 my-auto">
                  {/* Personal info column */}
                  <div className="flex flex-col">
                    <h3
                      className={`text-base sm:text-lg font-extrabold tracking-tight leading-snug font-outfit ${
                        theme === 'chalk' ? 'text-stone-900' : 'text-editorial-chalk'
                      }`}
                    >
                      {name}
                    </h3>
                    <p
                      className={`text-[10px] sm:text-[11px] font-medium mb-3 ${
                        theme === 'chalk'
                          ? 'text-persimmon-dark'
                          : theme === 'terracotta'
                          ? 'text-amber-100'
                          : 'text-persimmon'
                      }`}
                    >
                      {title}
                    </p>

                    {/* Contact Badges */}
                    <div className="space-y-1 text-[9px] sm:text-[10px]">
                      <div className="flex items-center gap-1.5 opacity-80">
                        <Mail className="w-2.5 h-2.5 text-persimmon" />
                        <span className="truncate max-w-[130px]">{email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-80">
                        <Phone className="w-2.5 h-2.5 text-amber-golden" />
                        <span>{phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-80">
                        <Globe className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{website}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Container with Crisp Contrast Box */}
                  <div className="flex flex-col items-center">
                    <div className="p-1 rounded-xl bg-white shadow-md border border-stone-200">
                      {qrElement ? (
                        <div className="w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center overflow-hidden">
                          {qrElement}
                        </div>
                      ) : qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="QR Code"
                          className="w-22 h-22 sm:w-26 sm:h-26 object-contain"
                        />
                      ) : (
                        renderCardQr()
                      )}
                    </div>
                    <span
                      className={`text-[8px] font-bold tracking-widest uppercase mt-1 ${
                        theme === 'chalk' ? 'text-stone-500' : 'text-editorial-stone'
                      }`}
                    >
                      Escanea contacto
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Location & Hairline Brand Tag */}
                <div className="relative flex items-center justify-between text-[9px] pt-1.5 border-t border-white/10 z-10">
                  <div className="flex items-center gap-1 opacity-70">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{address}</span>
                  </div>
                  <span className="font-mono text-[8px] opacity-40">vCard 3.0</span>
                </div>
              </div>

              {/* BACK FACE (Shown when flipped) */}
              <div
                className={`absolute inset-0 w-full h-full p-6 flex flex-col items-center justify-between rotate-y-180 transition-colors duration-300 ${
                  theme === 'obsidian'
                    ? 'bg-gradient-to-br from-[#151418] via-[#0E0D10] to-[#080709] text-editorial-chalk'
                    : theme === 'chalk'
                    ? 'bg-gradient-to-br from-[#FDFCFA] via-[#F4F2EB] to-[#EBE8E0] text-[#1C1917]'
                    : 'bg-gradient-to-br from-[#C8461E] via-[#A83713] to-[#782408] text-white'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="text-[10px] font-mono tracking-widest uppercase opacity-60">
                  {company}
                </div>

                {/* Large Monogram */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl ${
                      theme === 'chalk'
                        ? 'bg-stone-900 text-stone-100'
                        : theme === 'terracotta'
                        ? 'bg-stone-950 text-amber-200 ring-2 ring-white/20'
                        : 'bg-gradient-to-br from-persimmon to-amber-golden text-obsidian-base'
                    }`}
                  >
                    K
                  </div>
                  <span className="text-xs font-bold tracking-widest font-outfit uppercase">
                    KROMA STUDIO
                  </span>
                  <span className="text-[10px] opacity-60 tracking-wider">
                    {website}
                  </span>
                </div>

                <div className="text-[9px] font-mono opacity-40">
                  DISEÑADO CON KROMA QR STUDIO
                </div>
              </div>
            </div>

            {/* Thickness Edge Highlights (Card stock 3D edge) */}
            <div
              className="absolute top-0 right-[-2px] w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none"
              style={{ transform: 'rotateY(90deg) translateZ(1px)' }}
            />
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODE 2: FLAT PREPRESS VIEW WITH CROP MARKS & BLEED GUIDES         */}
      {/* ================================================================== */}
      {viewMode === 'flat-crop' && (
        <div className="relative flex flex-col items-center w-full max-w-xl p-6">
          {/* Prepress Header Info */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-editorial-stone mb-4 pb-2 border-b border-obsidian-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>FORMATO PREPRENSA • 85 × 55 mm</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-coral-400">Sangrado: +3 mm</span>
              <span>•</span>
              <span className="text-cyan-400">Zona Segura: -3 mm</span>
              <span>•</span>
              <span>300 DPI</span>
            </div>
          </div>

          {/* Canvas Wrapper with Prepress Guides & Vector Crop Marks */}
          <div className="relative p-10 bg-[#0B0A0C] rounded-2xl border border-obsidian-border/80 shadow-2xl flex items-center justify-center">
            {/* CORNER CROP MARKS (High-precision prepress orthogonal ticks) */}
            {/* Top-Left */}
            <div className="absolute top-4 left-10 w-[1px] h-5 bg-white/70" />
            <div className="absolute top-10 left-4 w-5 h-[1px] bg-white/70" />

            {/* Top-Right */}
            <div className="absolute top-4 right-10 w-[1px] h-5 bg-white/70" />
            <div className="absolute top-10 right-4 w-5 h-[1px] bg-white/70" />

            {/* Bottom-Left */}
            <div className="absolute bottom-4 left-10 w-[1px] h-5 bg-white/70" />
            <div className="absolute bottom-10 left-4 w-5 h-[1px] bg-white/70" />

            {/* Bottom-Right */}
            <div className="absolute bottom-4 right-10 w-[1px] h-5 bg-white/70" />
            <div className="absolute bottom-10 right-4 w-5 h-[1px] bg-white/70" />

            {/* Center Registration Crosshairs */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
              <div className="w-full h-[1px] bg-white/40" />
              <div className="h-full w-[1px] bg-white/40 absolute" />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
              <div className="w-full h-[1px] bg-white/40" />
              <div className="h-full w-[1px] bg-white/40 absolute" />
            </div>

            {/* BLEED CONTAINER (+3mm outer bleed area) */}
            <div
              className={`relative p-2 rounded-sm transition-all ${
                showGuides ? 'outline-dashed outline-1 outline-rose-500/60' : ''
              }`}
            >
              {/* Bleed label indicator */}
              {showGuides && (
                <span className="absolute -top-3.5 left-2 text-[8px] font-mono text-rose-400 font-semibold uppercase">
                  Línea de Sangrado (+3mm)
                </span>
              )}

              {/* TRIM BOX (Exact 85 x 55 mm Cut Line) */}
              <div
                ref={cardRef}
                className={`relative w-80 sm:w-96 aspect-[85/55] rounded-none overflow-hidden transition-all duration-300 ${
                  showGuides ? 'ring-1 ring-white/80' : ''
                } ${
                  theme === 'obsidian'
                    ? 'bg-gradient-to-br from-[#1E1D22] via-[#161519] to-[#0D0C0E] text-editorial-chalk'
                    : theme === 'chalk'
                    ? 'bg-gradient-to-br from-[#FDFCFA] via-[#F7F6F2] to-[#ECEAE4] text-[#1C1917]'
                    : 'bg-gradient-to-br from-[#F06543] via-[#E85A2A] to-[#B53C14] text-white'
                }`}
              >
                {/* SAFETY MARGIN (-3mm inside trim line) */}
                <div
                  className={`w-full h-full p-4 sm:p-5 flex flex-col justify-between ${
                    showGuides ? 'outline-dashed outline-1 outline-cyan-400/50 m-0' : ''
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center font-black text-xs ${
                          theme === 'chalk'
                            ? 'bg-stone-900 text-stone-100'
                            : theme === 'terracotta'
                            ? 'bg-stone-950 text-amber-200'
                            : 'bg-persimmon text-obsidian-base'
                        }`}
                      >
                        K
                      </div>
                      <span className="text-[11px] font-bold tracking-widest uppercase font-outfit">
                        {company}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono opacity-60">VCARD DIGITAL</span>
                  </div>

                  {/* Center Content */}
                  <div className="flex items-center justify-between gap-3 my-auto">
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight font-outfit">
                        {name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-persimmon mb-2">
                        {title}
                      </p>
                      <div className="space-y-0.5 text-[9px]">
                        <div className="opacity-80">{email}</div>
                        <div className="opacity-80">{phone}</div>
                        <div className="opacity-80">{website}</div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center">
                      <div className="p-1 rounded-lg bg-white shadow-sm">
                        {qrElement ? (
                          <div className="w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center overflow-hidden">
                            {qrElement}
                          </div>
                        ) : qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt="QR Code"
                            className="w-22 h-22 sm:w-26 sm:h-26 object-contain"
                          />
                        ) : (
                          renderCardQr()
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="flex items-center justify-between text-[8px] opacity-60 pt-1 border-t border-white/10 font-mono">
                    <span>{address}</span>
                    <span>300 DPI PREPRESS READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prepress Color Wedge Bar & Legend */}
          <div className="w-full max-w-md mt-5 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-6 h-3 bg-cyan-400 border border-white/20" title="Cyan" />
              <div className="w-6 h-3 bg-fuchsia-500 border border-white/20" title="Magenta" />
              <div className="w-6 h-3 bg-yellow-400 border border-white/20" title="Yellow" />
              <div className="w-6 h-3 bg-black border border-white/20" title="Key (Black)" />
              <div className="w-6 h-3 bg-persimmon border border-white/20" title="Spot Persimmon" />
              <div className="w-6 h-3 bg-amber-golden border border-white/20" title="Spot Amber" />
              <div className="w-6 h-3 bg-neutral-600 border border-white/20" title="50% Gray" />
              <div className="w-6 h-3 bg-neutral-300 border border-white/20" title="20% Gray" />
            </div>
            <p className="text-[10px] text-editorial-ash text-center font-mono">
              Las marcas de corte indican la posición exacta de las cuchillas. Los textos se encuentran protegidos dentro de la zona segura de 3mm.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
