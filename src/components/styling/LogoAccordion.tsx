import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Sliders, ShieldAlert, Clipboard } from 'lucide-react';

interface LogoAccordionProps {
  logoUrl: string | null;
  logoSize: number;
  logoMargin: number;
  hideBackgroundDots: boolean;
  onLogoChange: (url: string | null) => void;
  onSizeChange: (size: number) => void;
  onMarginChange: (margin: number) => void;
  onHideBackgroundDotsChange: (hide: boolean) => void;
  onOptimizeForLogo: () => void;
}

// Preset vector SVG icons encoded as Data URIs for instant 1-click test
const PRESET_LOGOS = [
  {
    name: 'Kroma Brand',
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%23E85A2A"/><text x="50" y="68" font-family="sans-serif" font-size="52" font-weight="900" fill="%230D0C0E" text-anchor="middle">K</text></svg>',
  },
  {
    name: 'WhatsApp',
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%2325D366"/><path d="M50 20C33.4 20 20 33.4 20 50c0 5.7 1.6 11 4.4 15.6L20 80l15-3.9C39.4 78.6 44.5 80 50 80c16.6 0 30-13.4 30-30S66.6 20 50 20zm14.7 41.5c-.6 1.7-3.5 3.3-4.9 3.4-.9.1-2 .3-6.6-1.6-5.8-2.4-9.6-8.3-9.9-8.7-.3-.4-2.4-3.2-2.4-6.1s1.5-4.3 2.1-4.9c.5-.6 1.2-.7 1.6-.7.4 0 .8 0 1.2.1.4.1.9.4 1.3 1.5.5 1.2 1.7 4.1 1.8 4.4.2.3.3.7.1 1.1-.2.4-.4.7-.7.9-.3.3-.6.6-.9.8-.3.3-.6.7-.3 1.2.4.6 1.6 2.6 3.4 4.2 2.3 2.1 4.3 2.7 4.9 3 .6.3 1 .3 1.3-.1.4-.4 1.7-2 2.2-2.7.5-.7 1-.6 1.6-.4.7.2 4.3 2 5 2.4.8.4 1.3.5 1.5.9.2.4.2 2.3-.4 4z" fill="white"/></svg>',
  },
  {
    name: 'Instagram',
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="ig" cx="25%" cy="105%" r="120%"><stop offset="0%" stop-color="%23fed373"/><stop offset="30%" stop-color="%23f15245"/><stop offset="60%" stop-color="%23d92e7f"/><stop offset="100%" stop-color="%234c68d7"/></radialGradient></defs><rect width="100" height="100" rx="28" fill="url(%23ig)"/><rect x="24" y="24" width="52" height="52" rx="14" fill="none" stroke="white" stroke-width="6"/><circle cx="50" cy="50" r="13" fill="none" stroke="white" stroke-width="6"/><circle cx="65" cy="35" r="3.5" fill="white"/></svg>',
  },
  {
    name: 'Wi-Fi Hotspot',
    dataUri:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23F97316"/><path d="M50 66a6 6 0 100 12 6 6 0 000-12zm-15-13a21 21 0 0130 0l-4.5 4.5a15 15 0 00-21 0L35 53zm-10-10a35 35 0 0150 0l-4.5 4.5a29 29 0 00-41 0L25 43z" fill="%230D0C0E"/></svg>',
  },
];

export const LogoAccordion: React.FC<LogoAccordionProps> = ({
  logoUrl,
  logoSize,
  logoMargin,
  hideBackgroundDots,
  onLogoChange,
  onSizeChange,
  onMarginChange,
  onHideBackgroundDotsChange,
  onOptimizeForLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const processImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onLogoChange(result);
          onOptimizeForLogo();
        }
      };
      reader.readAsDataURL(file);
    },
    [onLogoChange, onOptimizeForLogo]
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Clipboard paste handler
  const handlePasteEvent = useCallback(
    (e: ClipboardEvent | React.ClipboardEvent) => {
      const clipboardData =
        'clipboardData' in e ? e.clipboardData : (e as any).originalEvent?.clipboardData;
      if (!clipboardData) return;

      const items = clipboardData.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            break;
          }
        }
      }
    },
    [processImageFile]
  );

  // Global window paste listener when inside or focusing the studio
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Do not hijack text paste inside regular text inputs or textareas
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
        return;
      }
      handlePasteEvent(e);
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [handlePasteEvent]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  return (
    <div className="space-y-4 pt-2" onPaste={handlePasteEvent}>
      {/* Upload Zone & Active Preview */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Logotipo Central
        </label>

        {logoUrl ? (
          <div
            onPaste={handlePasteEvent}
            className="p-3.5 rounded-xl bg-obsidian-module border border-persimmon/40 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-obsidian-card p-1 flex items-center justify-center border border-obsidian-border overflow-hidden">
                <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <span className="text-xs font-semibold text-editorial-chalk block">
                  Logo Activo
                </span>
                <span className="text-[11px] text-persimmon block">
                  Incrustado en el centro del vector
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-obsidian-card hover:bg-obsidian-elevated text-editorial-stone hover:text-editorial-chalk border border-obsidian-border"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={() => onLogoChange(null)}
                className="p-1.5 text-editorial-stone hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onPaste={handlePasteEvent}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all group focus:outline-none focus:border-persimmon ${
              isDragging
                ? 'border-persimmon bg-persimmon/10 ring-2 ring-persimmon/20'
                : 'border-obsidian-border hover:border-persimmon/60 hover:bg-obsidian-elevated/20'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-obsidian-module text-editorial-stone group-hover:text-persimmon flex items-center justify-center mx-auto mb-2.5 transition-colors border border-obsidian-border">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-editorial-chalk block group-hover:text-persimmon transition-colors">
              Haz clic para cargar imagen o pega desde el portapapeles
            </span>
            <span className="text-[11px] text-editorial-ash block mt-1">
              Soporta PNG transparente, SVG, WebP y JPEG (Recomendado: ratio 1:1)
            </span>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-obsidian-card text-persimmon border border-obsidian-border shadow-xs">
                <Clipboard className="w-3 h-3 text-persimmon" />
                Ctrl + V para pegar
              </span>
              <span className="text-[10px] text-editorial-ash">o arrastra un archivo aquí</span>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Preset Badges */}
      <div>
        <span className="text-[11px] text-editorial-stone block mb-2 font-medium">
          Logotipos de ejemplo rápido:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_LOGOS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                onLogoChange(preset.dataUri);
                onOptimizeForLogo();
              }}
              className="p-2 rounded-xl bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border text-left flex items-center gap-2 group transition-all"
            >
              <img src={preset.dataUri} alt="" className="w-5 h-5 rounded shrink-0" />
              <span className="text-xs text-editorial-stone group-hover:text-editorial-chalk truncate">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logo Controls */}
      {logoUrl && (
        <div className="p-3.5 rounded-xl bg-obsidian-module border border-obsidian-border space-y-3.5 animate-in fade-in duration-150">
          {/* Hide Background Dots */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-editorial-chalk block">
                Limpiar fondo tras el logo
              </span>
              <span className="text-[11px] text-editorial-ash block">
                Oculta los puntos del QR detrás del logo para máxima legibilidad
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hideBackgroundDots}
                onChange={(e) => onHideBackgroundDotsChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-obsidian-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-editorial-chalk after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-persimmon"></div>
            </label>
          </div>

          {/* Logo Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-editorial-stone flex items-center gap-1">
                <Sliders className="w-3 h-3 text-persimmon" />
                Tamaño del logo
              </label>
              <span className="text-[11px] font-mono text-editorial-chalk">
                {Math.round(logoSize * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.45"
              step="0.01"
              value={logoSize}
              onChange={(e) => onSizeChange(parseFloat(e.target.value))}
              className="w-full accent-persimmon cursor-pointer h-1.5 bg-obsidian-card rounded-lg"
            />
          </div>

          {/* Logo Margin Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-editorial-stone">
                Espacio alrededor del logo (px)
              </label>
              <span className="text-[11px] font-mono text-editorial-chalk">
                {logoMargin} px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              step="1"
              value={logoMargin}
              onChange={(e) => onMarginChange(parseInt(e.target.value, 10))}
              className="w-full accent-persimmon cursor-pointer h-1.5 bg-obsidian-card rounded-lg"
            />
          </div>

          {/* Security alert indicator */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-persimmon/10 border border-persimmon/20 text-persimmon text-[11px] leading-snug">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              La resistencia a daños se optimiza automáticamente a nivel Alto (30%) para asegurar que se pueda escanear sin problemas.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
