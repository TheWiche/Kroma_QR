/**
 * Custom React hook for generating and managing styled QR codes using qr-code-styling.
 * Enforces Error Correction Level 'H' (High) for maximum damage tolerance and logo support.
 */

import { useEffect, useState, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type {
  Options,
  DotType,
  CornerDotType,
  CornerSquareType,
  DrawType,
  ShapeType,
  Gradient,
  FileExtension,
  DownloadOptions,
} from 'qr-code-styling';

export type {
  DotType,
  CornerDotType,
  CornerSquareType,
  DrawType,
  ShapeType,
  Gradient,
  FileExtension,
  DownloadOptions,
};

/**
 * Options accepted by the useQRCode hook.
 * Allows nested qr-code-styling options or ergonomic top-level convenience properties.
 * Error correction level is always forced to 'H'.
 */
export interface UseQRCodeOptions {
  /** Output element type: 'canvas' or 'svg' */
  type?: DrawType;
  /** Global shape: 'square' or 'circle' */
  shape?: ShapeType;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Outer quiet zone margin */
  margin?: number;
  /** Text or URL payload encoded inside the QR */
  data?: string;

  // --- DOT PATTERNS (Modules) ---
  /** Shape style of internal QR dots */
  dotsType?: DotType;
  /** Foreground color of dots */
  dotsColor?: string;
  /** Gradient styling for dots */
  dotsGradient?: Gradient;
  /** Complete dotsOptions object */
  dotsOptions?: Options['dotsOptions'];

  // --- CORNER SQUARES (Position Detection Outer Rings) ---
  /** Shape style of outer corner squares */
  cornersSquareType?: CornerSquareType;
  /** Color of outer corner squares */
  cornersSquareColor?: string;
  /** Gradient styling for outer corner squares */
  cornersSquareGradient?: Gradient;
  /** Complete cornersSquareOptions object */
  cornersSquareOptions?: Options['cornersSquareOptions'];

  // --- CORNER DOTS (Position Detection Inner Dots) ---
  /** Shape style of inner corner dots */
  cornersDotType?: CornerDotType;
  /** Color of inner corner dots */
  cornersDotColor?: string;
  /** Gradient styling for inner corner dots */
  cornersDotGradient?: Gradient;
  /** Complete cornersDotOptions object */
  cornersDotOptions?: Options['cornersDotOptions'];

  // --- LOGO / EMBEDDED IMAGE ---
  /** URL or Base64 string of the center logo */
  logo?: string | null;
  /** Alias for logo (standard qr-code-styling option) */
  image?: string;
  /** Relative scale of the logo (0.1 to 0.5, default 0.35) */
  logoSize?: number;
  /** Margin space around the logo in pixels */
  logoMargin?: number;
  /** Hide QR modules behind the logo to prevent visual clash (default true) */
  hideBackgroundDots?: boolean;
  /** CORS attribute for external logo URLs */
  crossOrigin?: string;
  /** Complete imageOptions object */
  imageOptions?: Options['imageOptions'];

  // --- BACKGROUND ---
  /** Background fill color (default #ffffff) */
  backgroundColor?: string;
  /** Background gradient fill */
  backgroundGradient?: Gradient;
  /** Background corner radius in pixels */
  backgroundRound?: number;
  /** Complete backgroundOptions object */
  backgroundOptions?: Options['backgroundOptions'];

  // --- QR ENGINE CORE OPTIONS ---
  /** Additional QR core options (errorCorrectionLevel is locked to 'H') */
  qrOptions?: Omit<NonNullable<Options['qrOptions']>, 'errorCorrectionLevel'>;
}

/**
 * Normalizes user options into a strict qr-code-styling Options configuration,
 * unconditionally locking errorCorrectionLevel to 'H'.
 */
export function buildQRCodeOptions(options: UseQRCodeOptions = {}): Options {
  const {
    width = 300,
    height = 300,
    margin = 10,
    type = 'canvas',
    shape = 'square',
    data = '',
    dotsType,
    dotsColor,
    dotsGradient,
    dotsOptions,
    cornersSquareType,
    cornersSquareColor,
    cornersSquareGradient,
    cornersSquareOptions,
    cornersDotType,
    cornersDotColor,
    cornersDotGradient,
    cornersDotOptions,
    backgroundColor,
    backgroundGradient,
    backgroundRound,
    backgroundOptions,
    image,
    logo,
    logoSize,
    logoMargin,
    hideBackgroundDots,
    crossOrigin,
    imageOptions,
    qrOptions,
  } = options;

  const resolvedImage = (logo ?? image) || undefined;

  return {
    width,
    height,
    margin,
    type,
    shape,
    data,
    image: resolvedImage,
    // Error correction is strictly forced to 'H' (High ~30% recovery)
    qrOptions: {
      ...qrOptions,
      errorCorrectionLevel: 'H',
    },
    dotsOptions: {
      type: dotsType || dotsOptions?.type || 'square',
      color: dotsColor || dotsOptions?.color || '#000000',
      gradient: dotsGradient || dotsOptions?.gradient,
      ...dotsOptions,
      ...(dotsType ? { type: dotsType } : {}),
      ...(dotsColor ? { color: dotsColor } : {}),
      ...(dotsGradient ? { gradient: dotsGradient } : {}),
    },
    cornersSquareOptions: {
      type: cornersSquareType || cornersSquareOptions?.type,
      color:
        cornersSquareColor ||
        cornersSquareOptions?.color ||
        dotsColor ||
        dotsOptions?.color ||
        '#000000',
      gradient: cornersSquareGradient || cornersSquareOptions?.gradient,
      ...cornersSquareOptions,
      ...(cornersSquareType ? { type: cornersSquareType } : {}),
      ...(cornersSquareColor ? { color: cornersSquareColor } : {}),
      ...(cornersSquareGradient ? { gradient: cornersSquareGradient } : {}),
    },
    cornersDotOptions: {
      type: cornersDotType || cornersDotOptions?.type,
      color:
        cornersDotColor ||
        cornersDotOptions?.color ||
        dotsColor ||
        dotsOptions?.color ||
        '#000000',
      gradient: cornersDotGradient || cornersDotOptions?.gradient,
      ...cornersDotOptions,
      ...(cornersDotType ? { type: cornersDotType } : {}),
      ...(cornersDotColor ? { color: cornersDotColor } : {}),
      ...(cornersDotGradient ? { gradient: cornersDotGradient } : {}),
    },
    backgroundOptions: {
      color: backgroundColor || backgroundOptions?.color || '#ffffff',
      gradient: backgroundGradient || backgroundOptions?.gradient,
      round: backgroundRound ?? backgroundOptions?.round ?? 0,
      ...backgroundOptions,
      ...(backgroundColor ? { color: backgroundColor } : {}),
      ...(backgroundGradient ? { gradient: backgroundGradient } : {}),
      ...(backgroundRound !== undefined ? { round: backgroundRound } : {}),
    },
    imageOptions: {
      hideBackgroundDots:
        hideBackgroundDots ?? imageOptions?.hideBackgroundDots ?? true,
      imageSize: logoSize ?? imageOptions?.imageSize ?? 0.35,
      margin: logoMargin ?? imageOptions?.margin ?? 4,
      crossOrigin: crossOrigin || imageOptions?.crossOrigin || 'anonymous',
      ...imageOptions,
      ...(hideBackgroundDots !== undefined ? { hideBackgroundDots } : {}),
      ...(logoSize !== undefined ? { imageSize: logoSize } : {}),
      ...(logoMargin !== undefined ? { margin: logoMargin } : {}),
      ...(crossOrigin ? { crossOrigin } : {}),
    },
  };
}

/**
 * Return type of useQRCode: an initialized instance of QRCodeStyling.
 * Includes bound methods and a self-referential `qrCode` property so callers
 * can use either `const qr = useQRCode(...)` or `const { qrCode } = useQRCode(...)`.
 */
export type QRCodeStylingInstance = QRCodeStyling & {
  /** Self-reference to the QRCodeStyling instance for destructuring convenience */
  qrCode: QRCodeStyling;
};

/**
 * Custom React hook returning an initialized instance of QRCodeStyling from qr-code-styling.
 *
 * - Accepts customizable dot styles, corner styles, and center logos.
 * - Forces errorCorrectionLevel to 'H' (High) for reliable decoding even with overlaid logos.
 * - Automatically updates the QR code canvas/SVG when options change.
 *
 * @example
 * ```tsx
 * const qrCode = useQRCode({
 *   data: 'https://wa.me/1234567890',
 *   dotsType: 'rounded',
 *   cornersSquareType: 'extra-rounded',
 *   logo: '/logo.png',
 * });
 *
 * useEffect(() => {
 *   if (containerRef.current) {
 *     qrCode.append(containerRef.current);
 *   }
 * }, [qrCode]);
 * ```
 */
export function useQRCode(options: UseQRCodeOptions = {}): QRCodeStylingInstance {
  // Compute resolved options memoized against individual config options
  const resolvedOptions = useMemo(() => {
    return buildQRCodeOptions({
      type: options.type,
      shape: options.shape,
      width: options.width,
      height: options.height,
      margin: options.margin,
      data: options.data,
      dotsType: options.dotsType,
      dotsColor: options.dotsColor,
      dotsGradient: options.dotsGradient,
      dotsOptions: options.dotsOptions,
      cornersSquareType: options.cornersSquareType,
      cornersSquareColor: options.cornersSquareColor,
      cornersSquareGradient: options.cornersSquareGradient,
      cornersSquareOptions: options.cornersSquareOptions,
      cornersDotType: options.cornersDotType,
      cornersDotColor: options.cornersDotColor,
      cornersDotGradient: options.cornersDotGradient,
      cornersDotOptions: options.cornersDotOptions,
      backgroundColor: options.backgroundColor,
      backgroundGradient: options.backgroundGradient,
      backgroundRound: options.backgroundRound,
      backgroundOptions: options.backgroundOptions,
      logo: options.logo,
      image: options.image,
      logoSize: options.logoSize,
      logoMargin: options.logoMargin,
      hideBackgroundDots: options.hideBackgroundDots,
      crossOrigin: options.crossOrigin,
      imageOptions: options.imageOptions,
      qrOptions: options.qrOptions,
    });
  }, [
    options.type,
    options.shape,
    options.width,
    options.height,
    options.margin,
    options.data,
    options.dotsType,
    options.dotsColor,
    options.dotsGradient,
    options.dotsOptions,
    options.cornersSquareType,
    options.cornersSquareColor,
    options.cornersSquareGradient,
    options.cornersSquareOptions,
    options.cornersDotType,
    options.cornersDotColor,
    options.cornersDotGradient,
    options.cornersDotOptions,
    options.backgroundColor,
    options.backgroundGradient,
    options.backgroundRound,
    options.backgroundOptions,
    options.logo,
    options.image,
    options.logoSize,
    options.logoMargin,
    options.hideBackgroundDots,
    options.crossOrigin,
    options.imageOptions,
    options.qrOptions,
  ]);

  // Initialize QRCodeStyling instance via useState once
  const [instance] = useState<QRCodeStylingInstance>(() => {
    const qr = new QRCodeStyling(resolvedOptions);

    // Bind methods to preserve `this` context
    qr.append = qr.append.bind(qr);
    qr.update = qr.update.bind(qr);
    qr.download = qr.download.bind(qr);
    qr.getRawData = qr.getRawData.bind(qr);

    // Attach self-reference
    Object.defineProperty(qr, 'qrCode', {
      value: qr,
      writable: false,
      enumerable: false,
    });

    return qr as QRCodeStylingInstance;
  });

  // Keep QR instance updated whenever options change
  useEffect(() => {
    instance.update(resolvedOptions);
  }, [instance, resolvedOptions]);

  return instance;
}
