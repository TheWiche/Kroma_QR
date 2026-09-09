import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Layers,
  CreditCard,
  Grid,
  Sparkles,
  Printer,
  Download,
  Check,
  CheckCircle2,
  Loader2,
  Settings2,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { exportToA4PDF, type PDFTemplateType } from './ExportPDF';
import type { QRCodeStylingInstance } from '../../hooks/useQRCode';
import type { KromaQRStudioState } from '../../types/qr';

export interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode?: QRCodeStylingInstance;
  previewCanvas?: HTMLCanvasElement | HTMLElement | null;
  state?: KromaQRStudioState;
  onSuccess?: (fileName: string) => void;
}

interface TemplateOption {
  id: PDFTemplateType;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'single',
    title: 'Hoja Cartel Individual (A4)',
    subtitle: '1 QR gigante (12 cm) centrado con instrucción y marcas',
    badge: '1 por hoja',
    description:
      'Ideal para carteles de pared, puertas de acceso, vitrinas y exposiciones de arte.',
    icon: FileText,
  },
  {
    id: 'acrylic-tent',
    title: 'Display Acrílico de Mesa (10 × 15 cm)',
    subtitle: 'Encarte con banner Obsidian, QR de 64 mm y soporte acrílico',
    badge: 'Mesa / Display',
    description:
      'Perfecto para mesas de restaurante, recepción de hoteles, barras y mostradores.',
    icon: Layers,
  },
  {
    id: 'business-cards',
    title: 'Tarjetas de Presentación (10-Up)',
    subtitle: '10 tarjetas estándar 85 × 55 mm con vCard digital y líneas de corte',
    badge: '10 por pliego',
    description:
      'Distribución de 2 columnas × 5 filas con marcas de guillotina para imprenta.',
    icon: CreditCard,
  },
  {
    id: 'stickers-grid',
    title: 'Cuadrícula de Stickers (12-Up)',
    subtitle: '12 stickers cuadrados 48 × 48 mm con esquinas redondeadas',
    badge: '12 por pliego',
    description:
      'Distribución de 3 columnas × 4 filas para rotulación, empaques y adhesivos.',
    icon: Grid,
  },
];

const getDefaultTexts = (contentType?: string) => {
  if (contentType === 'wifi') {
    return {
      title: 'ZONA WI-FI DE ALTA VELOCIDAD',
      subtitle: 'Acceso inalámbrico para clientes y visitantes',
      label: 'Apunta tu cámara para conectarte al instante',
    };
  }
  if (contentType === 'vcard') {
    return {
      title: 'TARJETA DIGITAL DE CONTACTO',
      subtitle: 'Kroma Creative Studio • Red de Contactos',
      label: 'Escanea para guardar contacto en tu agenda',
    };
  }
  if (contentType === 'whatsapp') {
    return {
      title: 'ATENCIÓN DIRECTA POR WHATSAPP',
      subtitle: 'Soporte, cotizaciones y pedidos en tiempo real',
      label: 'Inicia una conversación directa sin agregar número',
    };
  }
  return {
    title: 'KROMA QR STUDIO',
    subtitle: 'Plantilla de Impresión de Alta Precisión',
    label: 'Escanea con la cámara de tu teléfono móvil',
  };
};

export const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  qrCode,
  previewCanvas,
  state,
  onSuccess,
}) => {
  const initialTexts = getDefaultTexts(state?.content.type);
  const [selectedTemplate, setSelectedTemplate] = useState<PDFTemplateType>('single');
  const [docTitle, setDocTitle] = useState<string>(initialTexts.title);
  const [docSubtitle, setDocSubtitle] = useState<string>(initialTexts.subtitle);
  const [docLabel, setDocLabel] = useState<string>(initialTexts.label);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [includeCropMarks, setIncludeCropMarks] = useState<boolean>(true);
  const [includeCalibrationBar, setIncludeCalibrationBar] = useState<boolean>(true);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [downloadedName, setDownloadedName] = useState<string>('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGenerating) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isGenerating, onClose]);

  const handleExportPDF = async () => {
    try {
      setIsGenerating(true);
      setIsDone(false);

      // Resolve high-resolution image data from qrCode or DOM
      let exportSource: HTMLCanvasElement | HTMLElement | string | null = null;

      if (qrCode) {
        try {
          const rawBlob = await qrCode.getRawData('png');
          if (rawBlob) {
            const blob =
              rawBlob instanceof Blob
                ? rawBlob
                : new Blob([rawBlob as unknown as BlobPart], { type: 'image/png' });
            exportSource = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        } catch (err) {
          console.warn('No se pudo extraer blob directo de qrCode:', err);
        }
      }

      if (!exportSource) {
        const domCanvas =
          previewCanvas ||
          (document.querySelector('.qr-render-target canvas') as HTMLCanvasElement);
        if (domCanvas) {
          exportSource = domCanvas;
        } else {
          const domWrapper = document.querySelector('.qr-render-target') as HTMLElement;
          if (domWrapper) {
            exportSource = domWrapper;
          }
        }
      }

      if (!exportSource) {
        alert(
          'No se encontró el lienzo QR activo para exportar. Asegúrate de que el visor esté visible.'
        );
        return;
      }

      const fileName = `kroma-impresion-${selectedTemplate}-${Date.now()}.pdf`;

      await exportToA4PDF(exportSource, {
        fileName,
        title: docTitle.trim() || 'KROMA QR STUDIO',
        subtitle: docSubtitle.trim(),
        label: docLabel.trim(),
        orientation,
        template: selectedTemplate,
        includeCropMarks,
        includeCalibrationBar,
        marginMm: 15,
        note: 'Generado con Kroma QR Studio • Alta Fidelidad Pre-prensa',
      });

      setDownloadedName(fileName);
      setIsDone(true);
      onSuccess?.(fileName);
    } catch (err) {
      console.error('Error generando documento PDF:', err);
      alert('Ocurrió un error al generar el PDF. Revisa la consola para más detalles.');
    } finally {
      setIsGenerating(false);
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
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-editorial-chalk font-outfit">
                  Exportar a Plantillas de Impresión PDF (A4)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-persimmon/10 text-persimmon border border-persimmon/20">
                  Pre-prensa 300 DPI
                </span>
              </div>
              <p className="text-xs text-editorial-stone">
                Genera documentos en formato universal A4 con marcas de corte profesionales y calibración CMYK.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-lg text-editorial-stone hover:text-editorial-chalk hover:bg-obsidian-elevated transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* MODAL BODY (Scrollable Layout)                                 */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Template Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-editorial-stone flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-persimmon" />
                <span>1. Selecciona la Plantilla de Pliego</span>
              </label>
              <span className="text-[11px] text-editorial-ash">
                Formato estándar ISO 216 (A4: 210 × 297 mm)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;

                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tmpl.id);
                      setIsDone(false);
                    }}
                    disabled={isGenerating}
                    className={`relative p-4 rounded-xl text-left border transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-obsidian-module border-persimmon shadow-amber-sm ring-1 ring-persimmon/40'
                        : 'bg-obsidian-substrate/80 border-obsidian-border hover:border-persimmon/40 hover:bg-obsidian-panel/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-2 rounded-lg border transition-colors ${
                              isSelected
                                ? 'bg-persimmon/20 text-persimmon border-persimmon/40'
                                : 'bg-obsidian-card text-editorial-stone border-obsidian-border group-hover:text-editorial-chalk'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4
                              className={`text-xs font-bold transition-colors ${
                                isSelected ? 'text-editorial-chalk' : 'text-editorial-chalk'
                              }`}
                            >
                              {tmpl.title}
                            </h4>
                            <span className="text-[10px] font-mono text-editorial-ash block">
                              {tmpl.subtitle}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            isSelected
                              ? 'bg-persimmon text-obsidian-base'
                              : 'bg-obsidian-card text-editorial-stone border border-obsidian-border'
                          }`}
                        >
                          {tmpl.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-editorial-stone leading-relaxed pl-1 mt-1">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Active Checkmark Pill */}
                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-persimmon/20 flex items-center justify-between text-[10px] text-persimmon font-semibold">
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Plantilla Activa
                        </span>
                        <span className="text-editorial-ash font-mono">300 DPI Ready</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Custom Text Fields */}
          <div className="p-4 rounded-xl bg-obsidian-panel/60 border border-obsidian-border space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-editorial-chalk">
              <Sliders className="w-4 h-4 text-persimmon" />
              <span>2. Textos & Encabezados del Documento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-editorial-stone font-medium mb-1.5">
                  Título Principal del Documento
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  disabled={isGenerating}
                  placeholder="Ej: KROMA QR STUDIO o MENÚ DIGITAL"
                  className="w-full py-2 px-3 rounded-lg bg-obsidian-module border border-obsidian-border text-editorial-chalk text-xs focus:outline-none focus:border-persimmon"
                />
              </div>

              <div>
                <label className="block text-editorial-stone font-medium mb-1.5">
                  Subtítulo / Información de Lugar
                </label>
                <input
                  type="text"
                  value={docSubtitle}
                  onChange={(e) => setDocSubtitle(e.target.value)}
                  disabled={isGenerating}
                  placeholder="Ej: Mesa 05 • Terraza Principal"
                  className="w-full py-2 px-3 rounded-lg bg-obsidian-module border border-obsidian-border text-editorial-chalk text-xs focus:outline-none focus:border-persimmon"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-editorial-stone font-medium mb-1.5">
                  Instrucción de Escaneo (Call to Action)
                </label>
                <input
                  type="text"
                  value={docLabel}
                  onChange={(e) => setDocLabel(e.target.value)}
                  disabled={isGenerating}
                  placeholder="Ej: Escanea con la cámara de tu teléfono móvil"
                  className="w-full py-2 px-3 rounded-lg bg-obsidian-module border border-obsidian-border text-editorial-chalk text-xs focus:outline-none focus:border-persimmon"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Prepress & Technical Print Settings */}
          <div className="p-4 rounded-xl bg-obsidian-panel/60 border border-obsidian-border space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-editorial-chalk">
              <Settings2 className="w-4 h-4 text-persimmon" />
              <span>3. Ajustes Técnicos de Pre-prensa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Orientation */}
              <div>
                <label className="block text-editorial-stone font-medium mb-1.5">
                  Orientación de Hoja
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    disabled={isGenerating}
                    className={`py-1.5 px-2 rounded-lg font-bold uppercase text-[10px] border transition-all ${
                      orientation === 'portrait'
                        ? 'bg-persimmon text-obsidian-base border-persimmon shadow-amber-sm'
                        : 'bg-obsidian-module text-editorial-stone border-obsidian-border hover:text-editorial-chalk'
                    }`}
                  >
                    Vertical (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    disabled={isGenerating}
                    className={`py-1.5 px-2 rounded-lg font-bold uppercase text-[10px] border transition-all ${
                      orientation === 'landscape'
                        ? 'bg-persimmon text-obsidian-base border-persimmon shadow-amber-sm'
                        : 'bg-obsidian-module text-editorial-stone border-obsidian-border hover:text-editorial-chalk'
                    }`}
                  >
                    Horizontal
                  </button>
                </div>
              </div>

              {/* Crop Marks Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-obsidian-module border border-obsidian-border sm:col-span-1">
                <div>
                  <span className="text-xs font-medium text-editorial-chalk block">
                    Marcas de Corte (Crop Marks)
                  </span>
                  <span className="text-[10px] text-editorial-ash block">
                    Guías para guillotina
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCropMarks}
                    onChange={(e) => setIncludeCropMarks(e.target.checked)}
                    disabled={isGenerating}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-obsidian-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-editorial-chalk after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-persimmon"></div>
                </label>
              </div>

              {/* Calibration Bar Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-obsidian-module border border-obsidian-border sm:col-span-1">
                <div>
                  <span className="text-xs font-medium text-editorial-chalk block">
                    Barra de Color CMYK
                  </span>
                  <span className="text-[10px] text-editorial-ash block">
                    Calibración de imprenta
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCalibrationBar}
                    onChange={(e) => setIncludeCalibrationBar(e.target.checked)}
                    disabled={isGenerating}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-obsidian-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-editorial-chalk after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-persimmon"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Banner When Finished */}
          {isDone && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-editorial-chalk">
                    ¡Documento PDF exportado exitosamente!
                  </h4>
                  <p className="text-xs text-editorial-stone font-mono">
                    Archivo generado: <span className="text-emerald-400">{downloadedName}</span>
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
          <div className="text-xs text-editorial-stone hidden sm:flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-persimmon" />
            <span>
              Generado con <strong>jsPDF</strong> en formato vectorial a 300 DPI
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-obsidian-module hover:bg-obsidian-elevated border border-obsidian-border text-editorial-chalk transition-colors disabled:opacity-50"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-persimmon hover:bg-persimmon-hover text-obsidian-base transition-all shadow-amber-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Construyendo PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Descargar PDF A4</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;
