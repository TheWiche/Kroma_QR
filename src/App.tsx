import { useState, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  Eye,
  Palette,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';

import { useStudioState } from './hooks/useStudioState';
import { useQRCode, type UseQRCodeOptions } from './hooks/useQRCode';
import { encodeQRData } from './lib/qr-engine';
import { Header } from './components/Header';
import { ContentTabs } from './components/tabs/ContentTabs';
import { UrlForm } from './components/forms/UrlForm';
import { WifiForm } from './components/forms/WifiForm';
import { WhatsAppForm } from './components/forms/WhatsAppForm';
import { VCardForm } from './components/forms/VCardForm';
import { AccordionItem } from './components/accordion/AccordionItem';
import { DotsAccordion } from './components/styling/DotsAccordion';
import { EyesAccordion } from './components/styling/EyesAccordion';
import { ColorsAccordion } from './components/styling/ColorsAccordion';
import { LogoAccordion } from './components/styling/LogoAccordion';
import { DimensionsAccordion } from './components/styling/DimensionsAccordion';
import { QRPreview } from './components/preview/QRPreview';
import { BulkModal } from './components/bulk/BulkModal';
import { PdfModal } from './components/mockups/PdfModal';

export function App() {
  const {
    state,
    setContentType,
    updateUrlContent,
    updateWifiContent,
    updateWhatsAppContent,
    updateVCardContent,
    updateStyle,
    resetToDefaults,
  } = useStudioState();

  // Accordion open/collapse states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    dots: true,
    eyes: false,
    colors: true,
    logo: false,
    dimensions: false,
  });

  // Active modal state ('bulk' | 'pdf' | null)
  const [activeModal, setActiveModal] = useState<'bulk' | 'pdf' | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Convert current state into UseQRCodeOptions for the QR engine
  const qrOptions: UseQRCodeOptions = useMemo(() => {
    const encoded = encodeQRData(state.content);
    const { style } = state;

    return {
      data: encoded,
      width: style.size || 340,
      height: style.size || 340,
      margin: style.margin,
      dotsType: style.dotType,
      dotsColor: style.colorMode === 'solid' ? style.dotColor : undefined,
      dotsGradient:
        style.colorMode === 'gradient'
          ? {
              type: style.dotGradient.type,
              rotation: (style.dotGradient.rotation * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: style.dotGradient.color1 },
                { offset: 1, color: style.dotGradient.color2 },
              ],
            }
          : undefined,
      cornersSquareType: style.cornerSquareType,
      cornersSquareColor: style.customCornerColors
        ? style.cornerSquareColor
        : style.colorMode === 'solid'
        ? style.dotColor
        : style.dotGradient.color1,
      cornersDotType: style.cornerDotType,
      cornersDotColor: style.customCornerColors
        ? style.cornerDotColor
        : style.colorMode === 'solid'
        ? style.dotColor
        : style.dotGradient.color1,
      backgroundColor: style.transparentBackground
        ? 'transparent'
        : style.backgroundColor,
      logo: style.logoUrl,
      logoSize: style.logoSize,
      logoMargin: style.logoMargin,
      hideBackgroundDots: style.hideBackgroundDots,
    };
  }, [state]);

  const qrCode = useQRCode(qrOptions);

  return (
    <div className="min-h-screen bg-obsidian-base text-editorial-chalk font-outfit antialiased selection:bg-persimmon selection:text-obsidian-base">
      {/* Top Navigation Header */}
      <Header onReset={resetToDefaults} />

      {/* Main Studio Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT PANEL: CONTENT TABS & STYLING ACCORDIONS           */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Content Card (Tabs & Forms) */}
            <section className="rounded-3xl bg-obsidian-card border border-obsidian-border p-6 shadow-obsidian-elevated space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-obsidian-border/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-persimmon" />
                  <h2 className="text-base font-bold tracking-tight text-editorial-chalk">
                    Contenido & Tipo de Dato
                  </h2>
                </div>
                <span className="text-xs text-editorial-stone font-medium">
                  Paso 1: Define tu destino
                </span>
              </div>

              {/* Tabs Switcher */}
              <ContentTabs
                activeType={state.content.type}
                onSelect={setContentType}
              />

              {/* Active Tab Form */}
              <div className="pt-2 animate-in fade-in duration-200">
                {state.content.type === 'url' && (
                  <UrlForm
                    data={state.content.url}
                    onChange={updateUrlContent}
                  />
                )}
                {state.content.type === 'wifi' && (
                  <WifiForm
                    data={state.content.wifi}
                    onChange={updateWifiContent}
                  />
                )}
                {state.content.type === 'whatsapp' && (
                  <WhatsAppForm
                    data={state.content.whatsapp}
                    onChange={updateWhatsAppContent}
                  />
                )}
                {state.content.type === 'vcard' && (
                  <VCardForm
                    data={state.content.vcard}
                    onChange={updateVCardContent}
                  />
                )}
              </div>
            </section>

            {/* 2. Styling Section (Accordions) */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-persimmon" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-editorial-stone">
                    Personalización Vectorial & Estilo
                  </h2>
                </div>
                <span className="text-xs text-editorial-ash">
                  Paso 2: Afina la estética
                </span>
              </div>

              {/* Accordion: Forma de Puntos (Dots) */}
              <AccordionItem
                id="dots"
                title="Forma de los Puntos"
                description="Matriz geométrica interior del código QR"
                badge={state.style.dotType}
                icon={<Sparkles className="w-4 h-4" />}
                isOpen={!!openAccordions.dots}
                onToggle={() => toggleAccordion('dots')}
              >
                <DotsAccordion
                  selected={state.style.dotType}
                  onChange={(type) => updateStyle({ dotType: type })}
                />
              </AccordionItem>

              {/* Accordion: Forma de Ojos (Corners) */}
              <AccordionItem
                id="eyes"
                title="Forma & Color de los Ojos"
                description="Los 3 marcos ancla de detección visual"
                badge={state.style.cornerSquareType}
                icon={<Eye className="w-4 h-4" />}
                isOpen={!!openAccordions.eyes}
                onToggle={() => toggleAccordion('eyes')}
              >
                <EyesAccordion
                  cornerSquareType={state.style.cornerSquareType}
                  cornerDotType={state.style.cornerDotType}
                  customCornerColors={state.style.customCornerColors}
                  cornerSquareColor={state.style.cornerSquareColor}
                  cornerDotColor={state.style.cornerDotColor}
                  onSquareTypeChange={(type) => updateStyle({ cornerSquareType: type })}
                  onDotTypeChange={(type) => updateStyle({ cornerDotType: type })}
                  onToggleCustomColors={(enabled) => updateStyle({ customCornerColors: enabled })}
                  onSquareColorChange={(color) => updateStyle({ cornerSquareColor: color })}
                  onDotColorChange={(color) => updateStyle({ cornerDotColor: color })}
                />
              </AccordionItem>

              {/* Accordion: Colores (Sólido / Degradado / Fondo) */}
              <AccordionItem
                id="colors"
                title="Cromática & Degradados"
                description="Paletas de acento Obsidian, degradados y fondo"
                badge={state.style.colorMode === 'gradient' ? 'Degradado' : 'Sólido'}
                icon={<Palette className="w-4 h-4" />}
                isOpen={!!openAccordions.colors}
                onToggle={() => toggleAccordion('colors')}
              >
                <ColorsAccordion
                  colorMode={state.style.colorMode}
                  dotColor={state.style.dotColor}
                  dotGradient={state.style.dotGradient}
                  backgroundColor={state.style.backgroundColor}
                  transparentBackground={state.style.transparentBackground}
                  onColorModeChange={(mode) => updateStyle({ colorMode: mode })}
                  onDotColorChange={(color) => updateStyle({ dotColor: color })}
                  onGradientChange={(grad) =>
                    updateStyle({
                      dotGradient: { ...state.style.dotGradient, ...grad },
                    })
                  }
                  onBackgroundColorChange={(color) =>
                    updateStyle({ backgroundColor: color })
                  }
                  onTransparentChange={(transparent) =>
                    updateStyle({ transparentBackground: transparent })
                  }
                  onApplyPalette={(palette) => {
                    updateStyle({
                      colorMode: 'gradient',
                      dotColor: palette.color1,
                      dotGradient: {
                        type: 'linear',
                        rotation: 45,
                        color1: palette.color1,
                        color2: palette.color2,
                      },
                      backgroundColor: palette.bg,
                      transparentBackground: false,
                    });
                  }}
                />
              </AccordionItem>

              {/* Accordion: Logotipo Central */}
              <AccordionItem
                id="logo"
                title="Logotipo Central"
                description="Incrusta tu isotipo, marca o icono central"
                badge={state.style.logoUrl ? 'Activo' : 'Sin logo'}
                icon={<ImageIcon className="w-4 h-4" />}
                isOpen={!!openAccordions.logo}
                onToggle={() => toggleAccordion('logo')}
              >
                <LogoAccordion
                  logoUrl={state.style.logoUrl}
                  logoSize={state.style.logoSize}
                  logoMargin={state.style.logoMargin}
                  hideBackgroundDots={state.style.hideBackgroundDots}
                  onLogoChange={(url) => updateStyle({ logoUrl: url })}
                  onSizeChange={(size) => updateStyle({ logoSize: size })}
                  onMarginChange={(margin) => updateStyle({ logoMargin: margin })}
                  onHideBackgroundDotsChange={(hide) =>
                    updateStyle({ hideBackgroundDots: hide })
                  }
                  onOptimizeForLogo={() => {
                    updateStyle({ errorCorrectionLevel: 'H' });
                  }}
                />
              </AccordionItem>

              {/* Accordion: Dimensiones & ECC */}
              <AccordionItem
                id="dimensions"
                title="Margen & Corrección de Error"
                description="Tolerancia de lectura y zona silenciosa"
                badge={`Margen: ${state.style.margin}px`}
                icon={<Maximize2 className="w-4 h-4" />}
                isOpen={!!openAccordions.dimensions}
                onToggle={() => toggleAccordion('dimensions')}
              >
                <DimensionsAccordion
                  errorCorrectionLevel={state.style.errorCorrectionLevel}
                  margin={state.style.margin}
                  onErrorCorrectionChange={(level) =>
                    updateStyle({ errorCorrectionLevel: level })
                  }
                  onMarginChange={(margin) => updateStyle({ margin })}
                />
              </AccordionItem>
            </section>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANEL: STICKY QR VIEWPORT & EXPORT ACTIONS         */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 self-start">
            <QRPreview
              qrCode={qrCode}
              state={state}
              onTriggerBulkPlaceholder={() => setActiveModal('bulk')}
              onTriggerPdfPlaceholder={() => setActiveModal('pdf')}
            />
          </div>
        </div>
      </main>

      {/* Modal Masivo (Bulk CSV / ZIP Generator) */}
      <BulkModal
        isOpen={activeModal === 'bulk'}
        onClose={() => setActiveModal(null)}
        activeStyle={state.style}
      />

      {/* Modal Plantillas de Impresión PDF A4 (Pre-prensa jsPDF) */}
      <PdfModal
        isOpen={activeModal === 'pdf'}
        onClose={() => setActiveModal(null)}
        qrCode={qrCode}
        state={state}
      />
    </div>
  );
}

export default App;
