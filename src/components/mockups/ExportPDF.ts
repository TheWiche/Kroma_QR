import jsPDF from 'jspdf';

export type PDFTemplateType = 'single' | 'acrylic-tent' | 'business-cards' | 'stickers-grid';

export interface ExportPDFOptions {
  /** Output file name (default: 'kroma-qr-sheet.pdf') */
  fileName?: string;
  /** Title header on the document */
  title?: string;
  /** Subtitle or venue info */
  subtitle?: string;
  /** Page orientation: 'portrait' (default) or 'landscape' */
  orientation?: 'portrait' | 'landscape';
  /** Page layout template */
  template?: PDFTemplateType;
  /** Draw professional prepress crop marks and trim lines (default: true) */
  includeCropMarks?: boolean;
  /** Draw CMYK/gray calibration bar at the bottom margin (default: true) */
  includeCalibrationBar?: boolean;
  /** Custom margin in mm (default: 15) */
  marginMm?: number;
  /** QR or artwork label text */
  label?: string;
  /** Technical note or URL text */
  note?: string;
  /** Document metadata */
  metadata?: {
    author?: string;
    creator?: string;
    subject?: string;
    keywords?: string;
  };
}

export interface PDFExportResult {
  success: boolean;
  fileName: string;
  pdf: jsPDF;
  blob: Blob;
  dataUri: string;
}

/**
 * Extracts a high-res DataURL image from a DOM canvas, image, or raw string.
 */
export function resolveCanvasDataUrl(
  source: HTMLCanvasElement | HTMLImageElement | HTMLElement | string
): string {
  if (typeof source === 'string') {
    return source;
  }

  if (source instanceof HTMLCanvasElement) {
    return source.toDataURL('image/png', 1.0);
  }

  if (source instanceof HTMLImageElement) {
    if (source.src.startsWith('data:')) {
      return source.src;
    }
    // Create a temporary canvas to extract pixel data from image
    const canvas = document.createElement('canvas');
    canvas.width = source.naturalWidth || source.width || 512;
    canvas.height = source.naturalHeight || source.height || 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(source, 0, 0);
      return canvas.toDataURL('image/png', 1.0);
    }
    return source.src;
  }

  // If a wrapper HTMLElement was provided, look for a canvas or img inside
  if (source instanceof HTMLElement) {
    const childCanvas = source.querySelector('canvas');
    if (childCanvas) {
      return childCanvas.toDataURL('image/png', 1.0);
    }
    const childImg = source.querySelector('img');
    if (childImg && childImg.src) {
      return childImg.src;
    }
  }

  throw new Error('No valid canvas or image element found to export to PDF');
}

/**
 * Draws standard prepress orthogonal crop marks at a given bounding box.
 * @param pdf jsPDF document instance
 * @param x Box X in mm
 * @param y Box Y in mm
 * @param w Box width in mm
 * @param h Box height in mm
 * @param markLength Length of crop marks in mm (default: 5mm)
 * @param offset Distance from trim edge in mm (default: 3mm)
 */
export function drawCropMarks(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  markLength = 5,
  offset = 3
): void {
  pdf.setDrawColor(30, 30, 30);
  pdf.setLineWidth(0.15); // Hairline 0.15mm standard

  const x2 = x + w;
  const y2 = y + h;

  // Top-Left Corner
  pdf.line(x, y - offset, x, y - offset - markLength); // vertical
  pdf.line(x - offset, y, x - offset - markLength, y); // horizontal

  // Top-Right Corner
  pdf.line(x2, y - offset, x2, y - offset - markLength); // vertical
  pdf.line(x2 + offset, y, x2 + offset + markLength, y); // horizontal

  // Bottom-Left Corner
  pdf.line(x, y2 + offset, x, y2 + offset + markLength); // vertical
  pdf.line(x - offset, y2, x - offset - markLength, y2); // horizontal

  // Bottom-Right Corner
  pdf.line(x2, y2 + offset, x2, y2 + offset + markLength); // vertical
  pdf.line(x2 + offset, y2, x2 + offset + markLength, y2); // horizontal
}

/**
 * Draws prepress registration target (crosshair inside circle)
 */
export function drawRegistrationMark(pdf: jsPDF, cx: number, cy: number, radius = 2.5): void {
  pdf.setDrawColor(50, 50, 50);
  pdf.setLineWidth(0.1);
  pdf.circle(cx, cy, radius, 'S');
  pdf.line(cx - radius - 1.5, cy, cx + radius + 1.5, cy);
  pdf.line(cx, cy - radius - 1.5, cx, cy + radius + 1.5);
}

/**
 * Draws CMYK & Gray calibration color swatches along the bottom margin
 */
export function drawCalibrationBar(pdf: jsPDF, x: number, y: number, swatchWidth = 5, swatchHeight = 3): void {
  const swatches = [
    [0, 255, 255],   // Cyan
    [255, 0, 255],   // Magenta
    [255, 255, 0],   // Yellow
    [0, 0, 0],       // Black
    [232, 90, 42],   // Kroma Persimmon
    [249, 115, 22],  // Kroma Amber
    [60, 60, 60],    // 80% Gray
    [120, 120, 120], // 50% Gray
    [200, 200, 200], // 20% Gray
    [240, 240, 240], // 5% Gray
  ];

  swatches.forEach(([r, g, b], i) => {
    pdf.setFillColor(r, g, b);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.08);
    pdf.rect(x + i * swatchWidth, y, swatchWidth, swatchHeight, 'FD');
  });
}

/**
 * Generates an A4 print-ready PDF from a canvas element or DataURI.
 * Supports multiple templates:
 * - 'single': 1 Large centerpiece QR with scan instructions and crop marks
 * - 'acrylic-tent': Foldable table tent card for acrylic stands
 * - 'business-cards': 10-up business cards sheet (85x55mm) with cut lines
 * - 'stickers-grid': 12-up square stickers sheet (50x50mm)
 *
 * @param source Canvas, Image, HTMLElement, or DataURI string
 * @param options Export configuration
 */
export async function exportToA4PDF(
  source: HTMLCanvasElement | HTMLImageElement | HTMLElement | string,
  options: ExportPDFOptions = {}
): Promise<PDFExportResult> {
  const {
    fileName = 'kroma-qr-sheet.pdf',
    title = 'KROMA QR STUDIO',
    subtitle = 'Plantilla de Impresión de Alta Precisión',
    orientation = 'portrait',
    template = 'single',
    includeCropMarks = true,
    includeCalibrationBar = true,
    marginMm = 15,
    label = 'Escanea con la cámara de tu teléfono',
    note = 'Generado con Kroma QR Studio • kroma-qr.studio',
    metadata = {},
  } = options;

  // Resolve source to clean Data URL
  const imgDataUrl = resolveCanvasDataUrl(source);

  // Initialize jsPDF with A4 standard (210 x 297 mm)
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  // Set document metadata
  pdf.setProperties({
    title: title || 'Kroma QR Code Print Sheet',
    subject: metadata.subject || 'High-Resolution Vector QR Code Print Proof',
    author: metadata.author || 'Kroma QR Studio',
    creator: metadata.creator || 'Kroma Obsidian & Amber Studio',
    keywords: metadata.keywords || 'qr, print, vector, kroma, prepress',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Draw technical prepress document header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(30, 28, 32);
  pdf.text(title.toUpperCase(), marginMm, 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(110, 105, 115);
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  pdf.text(
    `${subtitle}  |  A4 (210 × 297 mm)  |  ${dateStr}`,
    marginMm,
    16
  );

  // Hairline rule below header
  pdf.setDrawColor(220, 218, 222);
  pdf.setLineWidth(0.2);
  pdf.line(marginMm, 18, pageWidth - marginMm, 18);

  // Render requested template layout
  switch (template) {
    case 'acrylic-tent': {
      // Table tent card designed to be printed, cut, and inserted into an acrylic stand
      // Insert width: 100mm, Height: 150mm
      const cardWidth = 100;
      const cardHeight = 150;
      const cardX = (pageWidth - cardWidth) / 2;
      const cardY = 32;

      // Card bounding box with subtle outline
      pdf.setDrawColor(210, 208, 212);
      pdf.setLineWidth(0.25);
      pdf.rect(cardX, cardY, cardWidth, cardHeight, 'S');

      // Top decorative brand banner
      pdf.setFillColor(20, 19, 21); // Obsidian base
      pdf.rect(cardX, cardY, cardWidth, 24, 'F');

      pdf.setTextColor(244, 243, 239);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.text(title, cardX + cardWidth / 2, cardY + 13, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(232, 90, 42); // Persimmon accent
      pdf.text('MESA / TABLE ACRYLIC DISPLAY', cardX + cardWidth / 2, cardY + 19, { align: 'center' });

      // QR Image centered in card
      const qrSize = 64;
      const qrX = cardX + (cardWidth - qrSize) / 2;
      const qrY = cardY + 36;
      pdf.addImage(imgDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Call to action text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(20, 19, 21);
      pdf.text(label, cardX + cardWidth / 2, qrY + qrSize + 10, { align: 'center' });

      // Secondary instruction
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(110, 105, 115);
      pdf.text('Abre la cámara de tu smartphone para escanear', cardX + cardWidth / 2, qrY + qrSize + 15, {
        align: 'center',
      });
      pdf.text('Sin necesidad de instalar aplicaciones adicionales', cardX + cardWidth / 2, qrY + qrSize + 20, {
        align: 'center',
      });

      // Bottom acrylic insertion guide note
      pdf.setFontSize(6.5);
      pdf.setTextColor(160, 155, 165);
      pdf.text('Inserción para soporte acrílico estándar 10 × 15 cm', cardX + cardWidth / 2, cardY + cardHeight - 6, {
        align: 'center',
      });

      if (includeCropMarks) {
        drawCropMarks(pdf, cardX, cardY, cardWidth, cardHeight, 6, 3);
        drawRegistrationMark(pdf, cardX + cardWidth / 2, cardY - 7);
        drawRegistrationMark(pdf, cardX + cardWidth / 2, cardY + cardHeight + 7);
      }
      break;
    }

    case 'business-cards': {
      // 10-up standard European Business Cards (85mm x 55mm)
      // 2 columns x 5 rows = 10 cards per sheet
      const cardWidth = 85;
      const cardHeight = 55;
      const startX = (pageWidth - cardWidth * 2 - 8) / 2;
      const startY = 28;
      const gapX = 8;
      const gapY = 8;

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 2; col++) {
          const x = startX + col * (cardWidth + gapX);
          const y = startY + row * (cardHeight + gapY);

          // Card boundary
          pdf.setDrawColor(210, 208, 212);
          pdf.setLineWidth(0.2);
          pdf.rect(x, y, cardWidth, cardHeight, 'S');

          // Left mini accent bar
          pdf.setFillColor(232, 90, 42);
          pdf.rect(x, y, 2.5, cardHeight, 'F');

          // Right side: QR Code
          const qrSize = 34;
          const qrX = x + cardWidth - qrSize - 6;
          const qrY = y + (cardHeight - qrSize) / 2;
          pdf.addImage(imgDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

          // Left side: Text details
          pdf.setTextColor(20, 19, 21);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.text('KROMA STUDIO', x + 8, y + 14);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7);
          pdf.setTextColor(90, 85, 95);
          pdf.text('Tarjeta Digital • vCard', x + 8, y + 19);

          pdf.setFontSize(6.5);
          pdf.setTextColor(120, 115, 125);
          pdf.text('Escanea para guardar', x + 8, y + 26);
          pdf.text('contacto instantáneo', x + 8, y + 30);

          pdf.setFontSize(6);
          pdf.setTextColor(232, 90, 42);
          pdf.text('kroma-qr.studio', x + 8, y + 42);

          if (includeCropMarks) {
            drawCropMarks(pdf, x, y, cardWidth, cardHeight, 3.5, 2);
          }
        }
      }
      break;
    }

    case 'stickers-grid': {
      // 12-up square stickers (48mm x 48mm)
      // 3 columns x 4 rows
      const size = 48;
      const startX = (pageWidth - size * 3 - 12) / 2;
      const startY = 28;
      const gap = 6;

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const x = startX + col * (size + gap);
          const y = startY + row * (size + gap);

          // Sticker border with rounded corners effect
          pdf.setDrawColor(210, 208, 212);
          pdf.setLineWidth(0.18);
          pdf.roundedRect(x, y, size, size, 2, 2, 'S');

          // QR inside sticker
          const qrInner = 36;
          const qrX = x + (size - qrInner) / 2;
          const qrY = y + 4;
          pdf.addImage(imgDataUrl, 'PNG', qrX, qrY, qrInner, qrInner);

          // Sticker mini label
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(6.5);
          pdf.setTextColor(30, 28, 32);
          pdf.text('ESCANEA AQUÍ', x + size / 2, y + size - 3.5, { align: 'center' });

          if (includeCropMarks) {
            drawCropMarks(pdf, x, y, size, size, 3, 1.5);
          }
        }
      }
      break;
    }

    case 'single':
    default: {
      // Centerpiece layout: large, high-clarity QR for posters, signs, or direct framing
      const qrSizeMm = 120; // 12cm crisp center
      const qrX = (pageWidth - qrSizeMm) / 2;
      const qrY = 48;

      // Decorative frame around QR
      pdf.setDrawColor(230, 228, 232);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(qrX - 10, qrY - 10, qrSizeMm + 20, qrSizeMm + 20, 4, 4, 'S');

      // Embedded QR Code
      pdf.addImage(imgDataUrl, 'PNG', qrX, qrY, qrSizeMm, qrSizeMm);

      // Main Instruction Title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(20, 19, 21);
      pdf.text(label, pageWidth / 2, qrY + qrSizeMm + 24, { align: 'center' });

      // Subtitle
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 95, 105);
      pdf.text(
        'Apunta con la cámara de tu teléfono móvil para acceder al contenido de forma inmediata.',
        pageWidth / 2,
        qrY + qrSizeMm + 31,
        { align: 'center' }
      );
      pdf.text(
        'Compatible con iOS, Android y lectores de códigos QR estándar.',
        pageWidth / 2,
        qrY + qrSizeMm + 37,
        { align: 'center' }
      );

      // Prepress trim frame with crop marks
      if (includeCropMarks) {
        const frameW = qrSizeMm + 36;
        const frameH = qrSizeMm + 68;
        const frameX = (pageWidth - frameW) / 2;
        const frameY = qrY - 18;

        drawCropMarks(pdf, frameX, frameY, frameW, frameH, 6, 3.5);
        drawRegistrationMark(pdf, pageWidth / 2, frameY - 7);
        drawRegistrationMark(pdf, pageWidth / 2, frameY + frameH + 7);
        drawRegistrationMark(pdf, frameX - 7, frameY + frameH / 2);
        drawRegistrationMark(pdf, frameX + frameW + 7, frameY + frameH / 2);
      }
      break;
    }
  }

  // Prepress footer with calibration bar and metadata
  const footerY = pageHeight - 12;
  pdf.setDrawColor(220, 218, 222);
  pdf.setLineWidth(0.2);
  pdf.line(marginMm, footerY - 4, pageWidth - marginMm, footerY - 4);

  if (includeCalibrationBar) {
    drawCalibrationBar(pdf, marginMm, footerY - 1, 4.5, 2.5);
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(140, 135, 145);
  pdf.text(note, pageWidth - marginMm, footerY + 1, { align: 'right' });

  // Generate output files
  const blob = pdf.output('blob');
  const dataUri = pdf.output('datauristring');

  // Trigger download in browser if in client environment
  if (typeof window !== 'undefined') {
    pdf.save(fileName);
  }

  return {
    success: true,
    fileName,
    pdf,
    blob,
    dataUri,
  };
}
