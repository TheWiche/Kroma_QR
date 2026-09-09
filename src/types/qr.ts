import type {
  DotType,
  CornerDotType,
  CornerSquareType,
  GradientType,
  ErrorCorrectionLevel,
} from 'qr-code-styling';

export type QRContentType = 'url' | 'wifi' | 'whatsapp' | 'vcard';

export interface UrlContent {
  url: string;
}

export interface WifiContent {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface WhatsAppContent {
  countryCode: string;
  phone: string;
  message: string;
}

export interface VCardContent {
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface QRContentData {
  type: QRContentType;
  url: UrlContent;
  wifi: WifiContent;
  whatsapp: WhatsAppContent;
  vcard: VCardContent;
}

export type ColorMode = 'solid' | 'gradient';

export interface GradientConfig {
  type: GradientType;
  rotation: number;
  color1: string;
  color2: string;
}

export interface QRStyleState {
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  
  // Colors
  colorMode: ColorMode;
  dotColor: string;
  dotGradient: GradientConfig;
  
  backgroundColor: string;
  transparentBackground: boolean;
  
  customCornerColors: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;
  
  // Logo
  logoUrl: string | null;
  logoSize: number;
  logoMargin: number;
  hideBackgroundDots: boolean;
  
  // Advanced options
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  size: number;
}

export interface KromaQRStudioState {
  content: QRContentData;
  style: QRStyleState;
}
