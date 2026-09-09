import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import QRCodeStyling, { type Options, type FileExtension } from 'qr-code-styling';
import {
  X,
  Layers,
  Upload,
  FileArchive,
  Check,
  AlertCircle,
  Sparkles,
  FileText,
  Loader2,
  Trash2,
  Settings2,
  CheckCircle2,
} from 'lucide-react';
import type { QRStyleState } from '../../types/qr';

export interface BulkItem {
  id: string;
  filename: string;
  data: string;
  label?: string;
  type: 'url' | 'wifi' | 'vcard' | 'text';
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

export interface BulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional active style passed from main editor so bulk QRs share current aesthetic */
  activeStyle?: Partial<QRStyleState>;
  onSuccess?: (totalCount: number) => void;
}

// Quick CSV Example Presets
const PRESETS = [
  {
    title: 'Mesas Restaurante',
    description: '10 mesas con URLs dinámicas',
    data: `nombre,url,etiqueta
mesa-01,https://kroma-bistro.com/m/1,Mesa 01 - Salón Principal
mesa-02,https://kroma-bistro.com/m/2,Mesa 02 - Salón Principal
mesa-03,https://kroma-bistro.com/m/3,Mesa 03 - Terraza
mesa-04,https://kroma-bistro.com/m/4,Mesa 04 - Terraza
mesa-05,https://kroma-bistro.com/m/5,Mesa 05 - VIP Lounge`,
  },
  {
    title: 'Zonas Wi-Fi',
    description: 'Credenciales de acceso para visitantes',
    data: `nombre,wifi,etiqueta
wifi-lobby,WIFI:S:Kroma_Lobby;T:WPA;P:Kroma2026!;;,Wi-Fi Lobby
wifi-restaurante,WIFI:S:Kroma_Bistro;T:WPA;P:BistroGuest2026;;,Wi-Fi Bistro
wifi-coworking,WIFI:S:Kroma_Hub_5G;T:WPA;P:HubPass#2026;;,Wi-Fi Coworking`,
  },
  {
    title: 'Tarjetas Empleados',
    description: 'vCards v3.0 con datos de contacto',
    data: `nombre,url,etiqueta
elena-rios,https://kroma-qr-studio.vercel.app//c/elena,Elena Ríos - Directora Creativa
carlos-mora,https://kroma-qr-studio.vercel.app//c/carlos,Carlos Mora - Diseñador Senior
ana-valdez,https://kroma-qr-studio.vercel.app//c/ana,Ana Valdez - Desarrolladora`,
  },
];

/**
 * Sanitizes strings for safe cross-platform file names
 */
function sanitizeFileName(name: string): string {
  return (
    name
      .trim()
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '-')
      .replace(/_{2,}/g, '_')
      .toLowerCase() || 'qr-codigo'
  );
}

/**
 * Auto-detects content type from payload string
 */
function detectContentType(payload: string): 'url' | 'wifi' | 'vcard' | 'text' {
  const trimmed = payload.trim();
  if (trimmed.startsWith('WIFI:')) return 'wifi';
  if (trimmed.startsWith('BEGIN:VCARD')) return 'vcard';
  if (/^https?:\/\//i.test(trimmed) || trimmed.includes('.')) return 'url';
  return 'text';
}

/**
 * Parses raw multiline CSV, TSV, or plain list
 */
function parseBulkInput(rawText: string): BulkItem[] {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  const items: BulkItem[] = [];
  let hasHeader = false;

  // Check if line 1 looks like a header
  const firstLine = lines[0].toLowerCase();
  if (
    firstLine.includes('nombre') ||
    firstLine.includes('filename') ||
    firstLine.includes('url') ||
    firstLine.includes('data') ||
    firstLine.includes('link')
  ) {
    hasHeader = true;
  }

  const dataLines = hasHeader ? lines.slice(1) : lines;

  dataLines.forEach((line, index) => {
    // Delimiter heuristic: semicolon, tab, or comma
    let delimiter = ',';
    if (line.includes(';') && !line.startsWith('WIFI:')) {
      delimiter = ';';
    } else if (line.includes('\t')) {
      delimiter = '\t';
    }

    // Split taking quotes into account
    const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

    let filename = '';
    let data = '';
    let label = '';

    if (parts.length === 1) {
      // Just a URL / data string
      data = parts[0];
      filename = `qr-${String(index + 1).padStart(3, '0')}`;
    } else if (parts.length === 2) {
      filename = parts[0];
      data = parts[1];
    } else {
      filename = parts[0];
      data = parts[1];
      label = parts.slice(2).join(' ');
    }

    if (!data) return;

    items.push({
      id: `item-${index}-${Date.now()}`,
      filename: sanitizeFileName(filename || `qr-${index + 1}`),
      data: data,
      label: label || undefined,
      type: detectContentType(data),
      status: 'pending',
    });
  });

  return items;
}

export const BulkModal: React.FC<BulkModalProps> = ({
  isOpen,
  onClose,
  activeStyle,
  onSuccess,
}) => {
  const [inputText, setInputText] = useState<string>(PRESETS[0].data);
  const [items, setItems] = useState<BulkItem[]>(() => parseBulkInput(PRESETS[0].data));
  const [outputFormat, setOutputFormat] = useState<FileExtension>('png');
  const [outputSize, setOutputSize] = useState<number>(1024);
  const [colorPreset, setColorPreset] = useState<'current' | 'persimmon' | 'obsidian' | 'amber'>('current');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const [currentFileLabel, setCurrentFileLabel] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  // Update parsed items when text changes
  const handleTextChange = (text: string) => {
    setInputText(text);
    const parsed = parseBulkInput(text);
    setItems(parsed);
    setIsDone(false);
  };

  // Load a preset
  const handleLoadPreset = (presetData: string) => {
    handleTextChange(presetData);
  };

  // Handle file upload (.csv or .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleTextChange(content);
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  // Batch Generation & ZIP Packaging
  const handleGenerateZip = async () => {
    if (!items.length) return;

    try {
      setIsProcessing(true);
      setProgressIndex(0);
      setIsDone(false);

      const zip = new JSZip();
      const qrFolder = zip.folder('qrs');
      const manifestList: Array<{ filename: string; data: string; label?: string; type: string }> = [];

      // Determine styling configuration
      let dotColor = activeStyle?.dotColor || '#E85A2A';
      let bgColor = activeStyle?.transparentBackground ? 'transparent' : activeStyle?.backgroundColor || '#0D0C0E';

      if (colorPreset === 'persimmon') {
        dotColor = '#E85A2A';
        bgColor = '#0D0C0E';
      } else if (colorPreset === 'obsidian') {
        dotColor = '#0D0C0E';
        bgColor = '#FFFFFF';
      } else if (colorPreset === 'amber') {
        dotColor = '#F97316';
        bgColor = '#0D0C0E';
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setProgressIndex(i + 1);
        setCurrentFileLabel(`${item.filename}.${outputFormat}`);

        // Construct QRCodeStyling options
        const qrOptions: Partial<Options> = {
          width: outputSize,
          height: outputSize,
          data: item.data,
          margin: activeStyle?.margin ?? 12,
          qrOptions: {
            errorCorrectionLevel: activeStyle?.errorCorrectionLevel || 'H',
          },
          dotsOptions: {
            type: activeStyle?.dotType || 'rounded',
            color: dotColor,
          },
          cornersSquareOptions: {
            type: activeStyle?.cornerSquareType || 'extra-rounded',
            color: dotColor,
          },
          cornersDotOptions: {
            type: activeStyle?.cornerDotType || 'dot',
            color: dotColor,
          },
          backgroundOptions: {
            color: bgColor,
          },
          image: activeStyle?.logoUrl || undefined,
          imageOptions: {
            hideBackgroundDots: activeStyle?.hideBackgroundDots ?? true,
            imageSize: activeStyle?.logoSize ?? 0.35,
            margin: activeStyle?.logoMargin ?? 6,
            crossOrigin: 'anonymous',
          },
        };

        const qrInstance = new QRCodeStyling(qrOptions);
        const rawBlob = await qrInstance.getRawData(outputFormat);

        if (rawBlob) {
          qrFolder?.file(`${item.filename}.${outputFormat}`, rawBlob);
          manifestList.push({
            filename: `${item.filename}.${outputFormat}`,
            data: item.data,
            label: item.label,
            type: item.type,
          });
        }
      }

      // Add Manifest JSON and CSV summary
      zip.file(
        'manifest.json',
        JSON.stringify(
          {
            generator: 'Kroma QR Studio - Obsidian Edition',
            timestamp: new Date().toISOString(),
            totalQRs: manifestList.length,
            format: outputFormat,
            size: `${outputSize}x${outputSize}`,
            items: manifestList,
          },
          null,
          2
        )
      );

      const csvSummary = [
        'Archivo,Contenido_Data,Etiqueta,Tipo',
        ...manifestList.map(
          (m) => `"${m.filename}","${m.data.replace(/"/g, '""')}","${(m.label || '').replace(/"/g, '""')}","${m.type}"`
        ),
      ].join('\n');
      zip.file('resumen.csv', csvSummary);

      // Package and trigger download with FileSaver
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const zipName = `kroma-lote-qr-${Date.now()}.zip`;
      const saveFunction = typeof saveAs === 'function' ? saveAs : (saveAs as any)?.saveAs || saveAs;
      saveFunction(zipBlob, zipName);

      setIsDone(true);
      onSuccess?.(items.length);
    } catch (err) {
      console.error('Error generando lote masivo de QR:', err);
      alert('Ocurrió un error al procesar el lote. Revisa la consola para más detalles.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-obsidian-surface border border-obsidian-border shadow-obsidian-elevated overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-persimmon via-amber-golden to-persimmon" />

        {/* ============================================================== */}
        {/* MODAL HEADER                                                   */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-border bg-obsidian-panel/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-persimmon/20 to-amber-container/20 text-persimmon border border-persimmon/30 shadow-amber-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-editorial-chalk font-outfit">
                  Generador de Códigos QR por Lotes (CSV)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-persimmon/10 text-persimmon border border-persimmon/20">
                  Bulk Studio
                </span>
              </div>
              <p className="text-xs text-editorial-stone">
                Pega listas o sube un archivo CSV para exportar cientos de códigos QR en un único archivo ZIP.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg text-editorial-stone hover:text-editorial-chalk hover:bg-obsidian-elevated transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* MODAL BODY (Scrollable Split Views)                            */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Presets & File Upload Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-obsidian-panel/70 border border-obsidian-border text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-editorial-stone font-semibold mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-golden" />
                Ejemplos Rápidos:
              </span>
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadPreset(preset.data)}
                  disabled={isProcessing}
                  className="px-2.5 py-1 rounded-md bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border text-editorial-chalk font-medium transition-colors hover:border-persimmon/40 disabled:opacity-50"
                  title={preset.description}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            {/* File Upload Input */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.tsv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-card hover:bg-obsidian-elevated border border-obsidian-border text-editorial-chalk font-medium transition-colors disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-persimmon" />
                <span>Cargar .CSV o .TXT</span>
              </button>
            </div>
          </div>

          {/* Dual Panel: Input Textarea & Live Parsed Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Multiline Text Input */}
            <div className="lg:col-span-6 flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-editorial-chalk flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-persimmon" />
                  Entrada de Datos (CSV / Texto)
                </label>
                <span className="text-[11px] font-mono text-editorial-stone">
                  {inputText.split(/\r?\n/).filter(Boolean).length} líneas
                </span>
              </div>

              <div className="relative flex-1 min-h-[220px]">
                <textarea
                  value={inputText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  disabled={isProcessing}
                  placeholder={`nombre,url,etiqueta\nmesa-01,https://example.com/1,Mesa 1\nmesa-02,https://example.com/2,Mesa 2`}
                  rows={10}
                  className="w-full h-full p-3 font-mono text-xs rounded-xl bg-obsidian-substrate border border-obsidian-border text-editorial-chalk placeholder:text-editorial-ash focus:outline-none focus:border-persimmon focus:ring-1 focus:ring-persimmon resize-y leading-relaxed disabled:opacity-50"
                />
              </div>

              <p className="text-[11px] text-editorial-stone leading-relaxed">
                Formato soportado: <code className="text-amber-sunset font-mono">nombre,url,etiqueta</code> o simplemente una URL por línea. Las comas, puntos y coma y tabuladores son detectados automáticamente.
              </p>
            </div>

            {/* Right Column: Live Parsed Items Table */}
            <div className="lg:col-span-6 flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-editorial-chalk flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Vista Previa del Lote
                </label>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
                  {items.length} detectados
                </span>
              </div>

              <div className="flex-1 min-h-[220px] max-h-[270px] overflow-y-auto rounded-xl bg-obsidian-substrate border border-obsidian-border divide-y divide-obsidian-border/50">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center text-editorial-stone">
                    <AlertCircle className="w-8 h-8 text-editorial-ash mb-2" />
                    <p className="text-xs">No hay elementos válidos todavía.</p>
                    <p className="text-[11px] text-editorial-ash">
                      Pega tu lista en el panel izquierdo o usa un ejemplo rápido.
                    </p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-2.5 flex items-center justify-between gap-3 text-xs hover:bg-obsidian-panel/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[10px] font-mono text-editorial-ash w-5 text-right">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-editorial-chalk truncate">
                              {item.filename}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-obsidian-module text-editorial-stone uppercase border border-obsidian-border">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-editorial-stone truncate font-mono">
                            {item.data}
                          </p>
                        </div>
                      </div>

                      {item.label && (
                        <span className="hidden sm:inline-block text-[10px] text-editorial-ash truncate max-w-[120px]">
                          {item.label}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="flex items-center justify-between text-[11px] text-editorial-stone pt-1">
                  <span>Los archivos se nombrarán automáticamente según la primera columna.</span>
                  <button
                    type="button"
                    onClick={() => handleTextChange('')}
                    className="text-editorial-ash hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* EXPORT CONFIGURATION BAR                                       */}
          {/* ============================================================== */}
          <div className="p-4 rounded-xl bg-obsidian-panel/60 border border-obsidian-border space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-editorial-chalk">
              <Settings2 className="w-4 h-4 text-persimmon" />
              <span>Opciones del Paquete ZIP</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Output Format */}
              <div>
                <label className="block text-editorial-stone font-medium mb-1.5">
                  Formato de Imagen
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['png', 'svg', 'jpeg'] as FileExtension[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setOutputFormat(fmt)}
                      disabled={isProcessing}
                      className={`py-1.5 px-2 rounded-lg font-bold uppercase text-[11px] border transition-all ${
                        outputFormat === fmt
                          ? 'bg-persimmon text-obsidian-base border-persimmon shadow-amber-sm'
                          : 'bg-obsidian-module text-editorial-stone border-obsidian-border hover:text-editorial-chalk'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Resolution */}
              <div>
                <label className="block text-editorial-stone font-medium mb-1.5">
                  Resolución por QR
                </label>
                <select
                  value={outputSize}
                  onChange={(e) => setOutputSize(Number(e.target.value))}
                  disabled={isProcessing || outputFormat === 'svg'}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-obsidian-module border border-obsidian-border text-editorial-chalk font-mono text-xs focus:outline-none focus:border-persimmon"
                >
                  <option value={512}>512 × 512 px (Estándar Web)</option>
                  <option value={1024}>1024 × 1024 px (Impresión HD)</option>
                  <option value={2048}>2048 × 2048 px (Pre-prensa 300 DPI)</option>
                </select>
              </div>

              {/* Aesthetic Palette */}
              <div>
                <label className="block text-editorial-stone font-medium mb-1.5">
                  Paleta de Color
                </label>
                <select
                  value={colorPreset}
                  onChange={(e) => setColorPreset(e.target.value as any)}
                  disabled={isProcessing}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-obsidian-module border border-obsidian-border text-editorial-chalk text-xs focus:outline-none focus:border-persimmon"
                >
                  <option value="current">Heredar Estilo Actual del Editor</option>
                  <option value="persimmon">Persimmon Glow (Naranja/Negro)</option>
                  <option value="obsidian">Inverted Ink (Negro sobre Blanco)</option>
                  <option value="amber">Amber Sunset (Ámbar Cálido)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PROGRESS OR SUCCESS BANNER                                     */}
          {/* ============================================================== */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-obsidian-substrate border border-persimmon/30 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-editorial-chalk font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin text-persimmon" />
                  <span>
                    Generando códigos QR ({progressIndex} de {items.length})...
                  </span>
                </div>
                <span className="font-mono text-amber-golden text-xs">
                  {Math.round((progressIndex / (items.length || 1)) * 100)}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 rounded-full bg-obsidian-elevated overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-persimmon to-amber-golden transition-all duration-150"
                  style={{
                    width: `${Math.round((progressIndex / (items.length || 1)) * 100)}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-editorial-stone font-mono truncate">
                Procesando: {currentFileLabel}
              </p>
            </div>
          )}

          {isDone && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-editorial-chalk">
                    ¡Paquete ZIP descargado exitosamente!
                  </h4>
                  <p className="text-xs text-editorial-stone">
                    Se empaquetaron {items.length} archivos QR junto con el resumen CSV y manifest.json.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* MODAL FOOTER ACTIONS                                           */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-obsidian-border bg-obsidian-panel/80">
          <div className="text-xs text-editorial-stone hidden sm:block">
            <span>Incluye resumen <code className="text-editorial-chalk font-mono">resumen.csv</code> y <code className="text-editorial-chalk font-mono">manifest.json</code></span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border text-editorial-chalk transition-colors disabled:opacity-50"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleGenerateZip}
              disabled={isProcessing || items.length === 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-persimmon hover:bg-persimmon-hover text-obsidian-base transition-all shadow-amber-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando ZIP...</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-4 h-4" />
                  <span>Generar ZIP ({items.length} QRs)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
