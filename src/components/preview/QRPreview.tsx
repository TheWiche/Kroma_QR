import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  FileCode,
  FileText,
  Layers,
  Check,
  Copy,
  Info,
  Maximize,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import type { QRCodeStylingInstance } from '../../hooks/useQRCode';
import type { KromaQRStudioState } from '../../types/qr';
import { encodeQRData, getContrastRatio } from '../../lib/qr-engine';

interface QRPreviewProps {
  qrCode: QRCodeStylingInstance;
  state: KromaQRStudioState;
  onTriggerBulkPlaceholder: () => void;
  onTriggerPdfPlaceholder: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  qrCode,
  state,
  onTriggerBulkPlaceholder,
  onTriggerPdfPlaceholder,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportingPng, setExportingPng] = useState(false);
  const [exportingSvg, setExportingSvg] = useState(false);
  const [resolution, setResolution] = useState<number>(1024);

  // Mount/append QR code to DOM container
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !qrCode) return;

    container.innerHTML = '';
    qrCode.append(container);
  }, [qrCode]);

  const rawData = encodeQRData(state.content);

  // Calculate real-time contrast ratio between dots and background
  const fgColor =
    state.style.colorMode === 'solid'
      ? state.style.dotColor
      : state.style.dotGradient.color1;
  const bgColor = state.style.transparentBackground
    ? '#0D0C0E'
    : state.style.backgroundColor;
  const contrast = getContrastRatio(fgColor, bgColor);

  const handleCopyRawData = async () => {
    try {
      await navigator.clipboard.writeText(rawData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handlePngDownload = async () => {
    try {
      setExportingPng(true);
      await qrCode.download({
        name: `kroma-qr-${Date.now()}`,
        extension: 'png',
      });
    } finally {
      setExportingPng(false);
    }
  };

  const handleSvgDownload = async () => {
    try {
      setExportingSvg(true);
      await qrCode.download({
        name: `kroma-qr-${Date.now()}`,
        extension: 'svg',
      });
    } finally {
      setExportingSvg(false);
    }
  };

  return (
    <div className="w-full lg:sticky lg:top-24 space-y-4">
      {/* Main Preview Card with Obsidian & Amber Aesthetics */}
      <div className="relative rounded-3xl bg-obsidian-card border border-obsidian-border/90 p-5 shadow-obsidian-elevated overflow-hidden group">
        {/* Amber Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-persimmon/15 rounded-full blur-3xl pointer-events-none group-hover:bg-persimmon/25 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-amber-golden/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header telemetry / status */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-obsidian-border/80 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-editorial-chalk tracking-wide uppercase">
              Vista Previa en Tiempo Real
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-obsidian-module text-editorial-stone border border-obsidian-border">
              ECC: H (30%)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-persimmon/10 text-persimmon border border-persimmon/20 uppercase">
              {state.content.type}
            </span>
          </div>
        </div>

        {/* The QR Canvas Viewport */}
        <div className="relative flex items-center justify-center p-6 rounded-2xl bg-obsidian-base border border-obsidian-border min-h-[360px] overflow-hidden shadow-inner">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* The Actual QR Code Canvas mounted here */}
          <div
            ref={containerRef}
            className="qr-render-target flex items-center justify-center relative z-10 max-w-full [&>canvas]:max-w-full [&>canvas]:h-auto [&>svg]:max-w-full [&>svg]:h-auto transition-transform duration-200"
          />
        </div>

        {/* Contrast Legibility Indicator Bar */}
        <div className="mt-3.5 flex items-center justify-between px-3 py-2 rounded-xl bg-obsidian-module border border-obsidian-border text-xs">
          <div className="flex items-center gap-2">
            {contrast.isLegible ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-golden" />
            )}
            <span className="text-editorial-stone text-[11px]">
              Contraste WCAG: <strong className="text-editorial-chalk">{contrast.ratio}:1</strong> ({contrast.score === 'excellent' ? 'Excelente' : contrast.score === 'good' ? 'Óptimo' : 'Bajo'})
            </span>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              contrast.isLegible
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-golden/10 text-amber-golden border border-amber-golden/20'
            }`}
          >
            {contrast.isLegible ? 'Legible' : 'Revisar Contraste'}
          </span>
        </div>

        {/* Data Telemetry Info Bar */}
        <div className="mt-2 px-3 py-2 rounded-xl bg-obsidian-module border border-obsidian-border/80 flex items-center justify-between text-xs text-editorial-stone">
          <div className="flex items-center gap-2 truncate pr-2 font-mono text-[11px]">
            <Info className="w-3.5 h-3.5 text-persimmon shrink-0" />
            <span className="truncate" title={rawData}>
              {rawData}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyRawData}
            className="shrink-0 text-editorial-stone hover:text-persimmon transition-colors p-1 rounded hover:bg-obsidian-elevated"
            title="Copiar contenido codificado"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Primary Export Actions */}
        <div className="mt-4 space-y-2.5">
          {/* Resolution Selector for PNG */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-editorial-stone font-medium flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5 text-persimmon" />
              Resolución de Descarga:
            </span>
            <div className="flex items-center gap-1">
              {[
                { size: 512, label: '512px' },
                { size: 1024, label: '1024px' },
                { size: 2048, label: '2048px (HD)' },
              ].map((r) => (
                <button
                  key={r.size}
                  type="button"
                  onClick={() => setResolution(r.size)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    resolution === r.size
                      ? 'bg-persimmon text-obsidian-base font-bold'
                      : 'bg-obsidian-module text-editorial-stone hover:text-editorial-chalk'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* PNG Download Button */}
            <button
              type="button"
              onClick={handlePngDownload}
              disabled={exportingPng}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-persimmon to-amber-golden hover:from-persimmon-hover hover:to-amber-golden text-obsidian-base font-bold text-xs flex items-center justify-center gap-2 shadow-amber-glow hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{exportingPng ? 'Generando...' : 'Descargar PNG'}</span>
            </button>

            {/* SVG Download Button */}
            <button
              type="button"
              onClick={handleSvgDownload}
              disabled={exportingSvg}
              className="w-full py-3 px-4 rounded-xl bg-obsidian-elevated hover:bg-obsidian-highlight border border-obsidian-border text-editorial-chalk font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:border-persimmon/50 disabled:opacity-50"
            >
              <FileCode className="w-4 h-4 text-persimmon stroke-[2.2]" />
              <span>{exportingSvg ? 'Generando...' : 'Descargar SVG'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subagente D Placeholders Card */}
      <div className="rounded-2xl bg-obsidian-card/60 border border-obsidian-border/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-editorial-stone uppercase tracking-wider">
            Módulos de Producción & Masivo
          </span>
          <span className="text-[10px] font-mono text-amber-golden bg-amber-golden/10 px-2 py-0.5 rounded border border-amber-golden/20">
            Subagente D
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onTriggerPdfPlaceholder}
            className="p-2.5 rounded-xl bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border/80 text-left flex items-center gap-2.5 group transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-obsidian-card text-persimmon group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-editorial-chalk block group-hover:text-persimmon transition-colors">
                Plantilla PDF
              </span>
              <span className="text-[10px] text-editorial-ash block">
                Etiquetas & Hojas A4
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onTriggerBulkPlaceholder}
            className="p-2.5 rounded-xl bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border/80 text-left flex items-center gap-2.5 group transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-obsidian-card text-amber-golden group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-editorial-chalk block group-hover:text-amber-golden transition-colors">
                Lote CSV / ZIP
              </span>
              <span className="text-[10px] text-editorial-ash block">
                Generación masiva
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
