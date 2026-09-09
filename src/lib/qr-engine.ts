import QRCodeStyling, { type Options } from 'qr-code-styling';
import type {
  KromaQRStudioState,
  QRContentData,
} from '../types/qr';

/**
 * Kroma QR Engine
 * RFC-compliant formatters and WCAG contrast validation for QR code generation.
 */

// ============================================================================
// 1. RFC FORMATTERS
// ============================================================================

/**
 * Escapes characters for vCard 3.0 / RFC 2426 format.
 * Special characters that require backslash escaping: \ ; , and newlines.
 */
function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Escapes special characters for ZXing Wi-Fi format.
 * Characters to escape: \ ; , : "
 */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * vCard contact data interface (RFC 2426 / RFC 6350).
 */
export interface VCardData {
  firstName?: string;
  lastName?: string;
  formattedName?: string;
  organization?: string;
  title?: string;
  jobTitle?: string;
  role?: string;
  phone?: string;
  cellPhone?: string;
  workPhone?: string;
  email?: string;
  workEmail?: string;
  url?: string;
  website?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  note?: string;
}

/**
 * Formats contact information into an RFC 2426 compliant vCard (vCard 3.0).
 * Widely recognized by iOS Camera, Android Camera, and QR code scanners.
 */
export function formatVCard(data: VCardData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const lastName = data.lastName?.trim() || '';
  const firstName = data.firstName?.trim() || '';

  if (lastName || firstName) {
    lines.push(`N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`);
  }

  const fn =
    data.formattedName?.trim() ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    data.organization?.trim() ||
    '';

  if (fn) {
    lines.push(`FN:${escapeVCard(fn)}`);
  }

  if (data.organization?.trim()) {
    lines.push(`ORG:${escapeVCard(data.organization.trim())}`);
  }

  const title = data.title?.trim() || data.jobTitle?.trim();
  if (title) {
    lines.push(`TITLE:${escapeVCard(title)}`);
  }

  if (data.role?.trim()) {
    lines.push(`ROLE:${escapeVCard(data.role.trim())}`);
  }

  if (data.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${data.phone.trim()}`);
  }

  if (data.cellPhone?.trim() && data.cellPhone.trim() !== data.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${data.cellPhone.trim()}`);
  }

  if (data.workPhone?.trim()) {
    lines.push(`TEL;TYPE=WORK,VOICE:${data.workPhone.trim()}`);
  }

  if (data.email?.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET,HOME:${data.email.trim()}`);
  }

  if (data.workEmail?.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET,WORK:${data.workEmail.trim()}`);
  }

  const url = data.url?.trim() || data.website?.trim();
  if (url) {
    lines.push(`URL:${url}`);
  }

  if (data.address?.trim()) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCard(data.address.trim())};;;;`);
  } else {
    const hasAddressParts =
      Boolean(data.street?.trim()) ||
      Boolean(data.city?.trim()) ||
      Boolean(data.state?.trim()) ||
      Boolean(data.zipCode?.trim()) ||
      Boolean(data.country?.trim());

    if (hasAddressParts) {
      lines.push(
        `ADR;TYPE=WORK:;;${escapeVCard(data.street?.trim() || '')};${escapeVCard(data.city?.trim() || '')};${escapeVCard(data.state?.trim() || '')};${escapeVCard(data.zipCode?.trim() || '')};${escapeVCard(data.country?.trim() || '')}`
      );
    }
  }

  if (data.note?.trim()) {
    lines.push(`NOTE:${escapeVCard(data.note.trim())}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Wi-Fi authentication types.
 */
export type WifiEncryption = 'WPA' | 'WEP' | 'WPA2' | 'WPA3' | 'nopass' | 'none';

/**
 * Wi-Fi network configuration.
 */
export interface WifiData {
  ssid: string;
  password?: string;
  encryption?: WifiEncryption;
  hidden?: boolean;
}

/**
 * Formats Wi-Fi configuration into standard ZXing / RFC format:
 * `WIFI:S:<SSID>;T:<WEP|WPA|nopass>;P:<PASSWORD>;H:<true|false>;;`
 */
export function formatWifi(data: WifiData): string {
  const ssid = escapeWifi(data.ssid || '');

  let enc = data.encryption || (data.password ? 'WPA' : 'nopass');
  if (enc === 'none') {
    enc = 'nopass';
  } else if (enc === 'WPA2' || enc === 'WPA3') {
    // WPA is the standard Wi-Fi barcode authentication token for WPA/WPA2/WPA3
    enc = 'WPA';
  }

  let result = `WIFI:S:${ssid};`;

  if (enc) {
    result += `T:${enc};`;
  }

  if (enc !== 'nopass' && data.password) {
    result += `P:${escapeWifi(data.password)};`;
  }

  if (data.hidden) {
    result += 'H:true;';
  }

  result += ';';
  return result;
}

/**
 * WhatsApp message data.
 */
export interface WhatsAppData {
  phone: string;
  countryCode?: string;
  message?: string;
}

/**
 * Formats WhatsApp direct link in standard format: `https://wa.me/<number>?text=<message>`
 * Automatically sanitizes phone numbers, stripping symbols, spaces, and non-numeric characters.
 */
export function formatWhatsApp(dataOrPhone: WhatsAppData | string, text?: string): string {
  let rawPhone = '';
  let message = '';

  if (typeof dataOrPhone === 'string') {
    rawPhone = dataOrPhone;
    message = text || '';
  } else {
    const cc = dataOrPhone.countryCode ? dataOrPhone.countryCode.replace(/\D/g, '') : '';
    const num = (dataOrPhone.phone || '').replace(/\D/g, '');
    rawPhone = cc ? `${cc}${num}` : num;
    message = dataOrPhone.message || text || '';
  }

  // Sanitize phone number to digits only (e.g. +1 (555) 234-5678 -> 15552345678)
  const cleanPhone = rawPhone.replace(/\D/g, '');

  if (!cleanPhone) {
    return message.trim() ? `https://wa.me/?text=${encodeURIComponent(message.trim())}` : 'https://wa.me/';
  }

  if (message.trim()) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
  }

  return `https://wa.me/${cleanPhone}`;
}

/**
 * Dispatches and formats QR payload according to its content type.
 */
export function formatQRContent(
  type: 'url' | 'wifi' | 'whatsapp' | 'vcard' | string,
  content: any
): string {
  switch (type) {
    case 'url':
      return typeof content === 'string' ? formatUrl(content) : formatUrl(content?.url || '');
    case 'wifi':
      return formatWifi(content);
    case 'whatsapp':
      return formatWhatsApp(content);
    case 'vcard':
      return formatVCard(content);
    default:
      return typeof content === 'string' ? content : JSON.stringify(content);
  }
}

/**
 * Encodes KromaQRStudio content state or generic content payload into an RFC-compliant QR string.
 */
export function encodeQRData(content: QRContentData | any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;

  // Handle QRContentData object { type: 'url' | 'wifi' | 'whatsapp' | 'vcard', url, wifi, whatsapp, vcard }
  if (content.type) {
    const contentType = content.type;
    const subContent = content[contentType] !== undefined ? content[contentType] : content;
    return formatQRContent(contentType, subContent);
  }

  return JSON.stringify(content);
}

/**
 * Formats standard URL, prepending https:// if missing.
 */
export function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Formats mailto: URI for emails.
 */
export interface EmailData {
  email: string;
  subject?: string;
  body?: string;
}

export function formatEmail(dataOrEmail: EmailData | string, subject?: string, body?: string): string {
  let email = '';
  let sub = '';
  let b = '';

  if (typeof dataOrEmail === 'string') {
    email = dataOrEmail.trim();
    sub = subject || '';
    b = body || '';
  } else {
    email = dataOrEmail.email.trim();
    sub = dataOrEmail.subject || subject || '';
    b = dataOrEmail.body || body || '';
  }

  const params = new URLSearchParams();
  if (sub) params.set('subject', sub);
  if (b) params.set('body', b);

  const qs = params.toString();
  return qs ? `mailto:${email}?${qs}` : `mailto:${email}`;
}

/**
 * Formats telephone tel: URI.
 */
export function formatPhone(phone: string): string {
  return `tel:${phone.trim()}`;
}

/**
 * Formats SMS smsto: URI.
 */
export function formatSMS(phone: string, message?: string): string {
  const cleanPhone = phone.trim();
  return message?.trim() ? `smsto:${cleanPhone}:${message.trim()}` : `smsto:${cleanPhone}`;
}

// ============================================================================
// 2. WCAG CONTRAST RATIO & LEGIBILITY CALCULATION
// ============================================================================

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Parses hexadecimal color string (#RGB, #RGBA, #RRGGBB, #RRGGBBAA or without #) to RGB object.
 * Returns null if the hex string is invalid.
 */
export function hexToRgb(hex: string): RGB | null {
  if (!hex || typeof hex !== 'string') return null;

  let clean = hex.trim().replace(/^#/, '');

  if (clean.length === 3 || clean.length === 4) {
    clean = clean
      .slice(0, 3)
      .split('')
      .map((char) => char + char)
      .join('');
  } else if (clean.length >= 6) {
    clean = clean.slice(0, 6);
  } else {
    return null;
  }

  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return null;
  }

  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Computes the relative luminance of an RGB color according to WCAG 2.1 specs.
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B, where sRGB components are gamma-expanded.
 */
export function getRelativeLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export type ContrastScore = 'poor' | 'acceptable' | 'good' | 'excellent';
export type WCAGLevel = 'AAA' | 'AA' | 'AA-Large' | 'Fail';

/**
 * Contrast calculation result including readability score and WCAG compliance.
 */
export interface ContrastResult {
  /** Contrast ratio from 1:1 up to 21:1 */
  ratio: number;
  /**
   * Legibility indicator for QR code scanners.
   * Under WCAG 2.1 SC 1.4.11 (Non-text Contrast), graphical symbols require a minimum of 3.0:1.
   */
  isLegible: boolean;
  /**
   * Optimal legibility indicator (ratio >= 4.5:1, matching WCAG AA normal text).
   * Ensures high-speed scan reliability under low light and various camera angles.
   */
  isOptimal: boolean;
  /** Qualitative score */
  score: ContrastScore;
  /** Highest WCAG criteria met */
  wcagLevel: WCAGLevel;
  /** Meets WCAG AA standard (4.5:1) */
  wcagAA: boolean;
  /** Meets WCAG Non-text / Graphical symbol standard (3.0:1) */
  wcagNonText: boolean;
}

/**
 * Calculates the WCAG 2.1 contrast ratio between two hex colors and assesses legibility for QR codes.
 *
 * @param hex1 Foreground or module color (e.g. dots)
 * @param hex2 Background color
 * @returns { ratio: number, isLegible: boolean, ... }
 */
export function getContrastRatio(hex1: string, hex2: string): ContrastResult {
  const rgb1 = hexToRgb(hex1) ?? { r: 0, g: 0, b: 0 };
  const rgb2 = hexToRgb(hex2) ?? { r: 255, g: 255, b: 255 };

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lMax = Math.max(lum1, lum2);
  const lMin = Math.min(lum1, lum2);

  const rawRatio = (lMax + 0.05) / (lMin + 0.05);
  const ratio = Math.round(rawRatio * 100) / 100;

  // QR codes are graphical objects. Per WCAG 2.1 SC 1.4.11, the minimum ratio is 3.0:1.
  const isLegible = ratio >= 3.0;
  const isOptimal = ratio >= 4.5;

  let score: ContrastScore = 'poor';
  let wcagLevel: WCAGLevel = 'Fail';

  if (ratio >= 7.0) {
    score = 'excellent';
    wcagLevel = 'AAA';
  } else if (ratio >= 4.5) {
    score = 'good';
    wcagLevel = 'AA';
  } else if (ratio >= 3.0) {
    score = 'acceptable';
    wcagLevel = 'AA-Large';
  }

  return {
    ratio,
    isLegible,
    isOptimal,
    score,
    wcagLevel,
    wcagAA: ratio >= 4.5,
    wcagNonText: ratio >= 3.0,
  };
}

// ============================================================================
// 3. QR DATA ENCODING & STYLING FACTORY
// ============================================================================

/**
 * Builds standard Options object for qr-code-styling library
 */
export function buildQROptions(
  state: KromaQRStudioState,
  overrideSize?: number
): Options {
  const data = encodeQRData(state.content);
  const size = overrideSize || state.style.size || 340;
  const { style } = state;

  const dotsOptions: Options['dotsOptions'] = {
    type: style.dotType,
  };

  if (style.colorMode === 'gradient') {
    const rad = ((style.dotGradient.rotation || 0) * Math.PI) / 180;
    dotsOptions.gradient = {
      type: style.dotGradient.type,
      rotation: rad,
      colorStops: [
        { offset: 0, color: style.dotGradient.color1 },
        { offset: 1, color: style.dotGradient.color2 },
      ],
    };
  } else {
    dotsOptions.color = style.dotColor;
  }

  const defaultCornerColor =
    style.colorMode === 'solid'
      ? style.dotColor
      : style.dotGradient.color1;

  const cornersSquareColor = style.customCornerColors
    ? style.cornerSquareColor
    : defaultCornerColor;

  const cornersDotColor = style.customCornerColors
    ? style.cornerDotColor
    : defaultCornerColor;

  return {
    width: size,
    height: size,
    margin: style.margin,
    data,
    qrOptions: {
      errorCorrectionLevel: style.errorCorrectionLevel,
    },
    image: style.logoUrl || undefined,
    imageOptions: {
      hideBackgroundDots: style.hideBackgroundDots,
      imageSize: style.logoSize,
      margin: style.logoMargin,
      crossOrigin: 'anonymous',
    },
    dotsOptions,
    cornersSquareOptions: {
      type: style.cornerSquareType,
      color: cornersSquareColor,
    },
    cornersDotOptions: {
      type: style.cornerDotType,
      color: cornersDotColor,
    },
    backgroundOptions: {
      color: style.transparentBackground ? 'transparent' : style.backgroundColor,
    },
  };
}

/**
 * Factory helper to instantiate QRCodeStyling
 */
export function createQRCodeInstance(options: Options): QRCodeStyling {
  return new QRCodeStyling(options);
}

