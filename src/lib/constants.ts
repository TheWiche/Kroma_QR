import type { KromaQRStudioState } from '../types/qr';

export const LOCAL_STORAGE_KEY = 'kroma_qr_studio_state_v1';

export const DEFAULT_QR_STATE: KromaQRStudioState = {
  content: {
    type: 'url',
    url: {
      url: 'https://kroma-qr.studio',
    },
    wifi: {
      ssid: 'Kroma_Studio_5G',
      password: '',
      encryption: 'WPA',
      hidden: false,
    },
    whatsapp: {
      countryCode: '+57',
      phone: '3001234567',
      message: '¡Hola! Escaneé este código QR generado con Kroma Studio.',
    },
    vcard: {
      firstName: 'Elena',
      lastName: 'Ríos',
      organization: 'Kroma Studio Corp',
      jobTitle: 'Directora Creativa',
      phone: '+57 300 123 4567',
      email: 'elena@kromastudio.design',
      website: 'https://kroma-qr.studio',
      address: 'Carrera 7 # 112 - 45, Bogotá',
    },
  },
  style: {
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    colorMode: 'gradient',
    dotColor: '#E85A2A',
    dotGradient: {
      type: 'linear',
      rotation: 45,
      color1: '#E85A2A',
      color2: '#F97316',
    },
    backgroundColor: '#0D0C0E',
    transparentBackground: false,
    customCornerColors: false,
    cornerSquareColor: '#E85A2A',
    cornerDotColor: '#F97316',
    logoUrl: null,
    logoSize: 0.35,
    logoMargin: 6,
    hideBackgroundDots: true,
    errorCorrectionLevel: 'Q',
    margin: 12,
    size: 340,
  },
};

export const COLOR_PALETTES = [
  {
    name: 'Persimmon Hearth',
    color1: '#E85A2A',
    color2: '#F97316',
    bg: '#0D0C0E',
  },
  {
    name: 'Amber Glow',
    color1: '#F59E0B',
    color2: '#D97706',
    bg: '#0D0C0E',
  },
  {
    name: 'Cyber Cyan',
    color1: '#06B6D4',
    color2: '#3B82F6',
    bg: '#0D0C0E',
  },
  {
    name: 'Emerald Matrix',
    color1: '#10B981',
    color2: '#059669',
    bg: '#0D0C0E',
  },
  {
    name: 'Electric Violet',
    color1: '#8B5CF6',
    color2: '#EC4899',
    bg: '#0D0C0E',
  },
  {
    name: 'Chalk Minimal',
    color1: '#F4F3EF',
    color2: '#A8A29E',
    bg: '#0D0C0E',
  },
  {
    name: 'Inverted Ink',
    color1: '#0D0C0E',
    color2: '#201F21',
    bg: '#FFFFFF',
  },
];
