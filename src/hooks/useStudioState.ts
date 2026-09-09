import { useState, useEffect, useCallback } from 'react';
import type {
  KromaQRStudioState,
  QRContentType,
  UrlContent,
  WifiContent,
  WhatsAppContent,
  VCardContent,
  QRStyleState,
} from '../types/qr';
import { DEFAULT_QR_STATE, LOCAL_STORAGE_KEY } from '../lib/constants';

export function useStudioState() {
  const [state, setState] = useState<KromaQRStudioState>(() => {
    if (typeof window === 'undefined') return DEFAULT_QR_STATE;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to guarantee all fields exist in case of schema updates
        return {
          content: {
            ...DEFAULT_QR_STATE.content,
            ...parsed.content,
            url: { ...DEFAULT_QR_STATE.content.url, ...(parsed.content?.url || {}) },
            wifi: { ...DEFAULT_QR_STATE.content.wifi, ...(parsed.content?.wifi || {}) },
            whatsapp: { ...DEFAULT_QR_STATE.content.whatsapp, ...(parsed.content?.whatsapp || {}) },
            vcard: { ...DEFAULT_QR_STATE.content.vcard, ...(parsed.content?.vcard || {}) },
          },
          style: {
            ...DEFAULT_QR_STATE.style,
            ...(parsed.style || {}),
            dotGradient: {
              ...DEFAULT_QR_STATE.style.dotGradient,
              ...(parsed.style?.dotGradient || {}),
            },
          },
        };
      }
    } catch (err) {
      console.warn('Failed to parse stored QR Studio state from localStorage', err);
    }
    return DEFAULT_QR_STATE;
  });

  // Save to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Could not persist QR Studio state to localStorage', err);
    }
  }, [state]);

  const setContentType = useCallback((type: QRContentType) => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        type,
      },
    }));
  }, []);

  const updateUrlContent = useCallback((patch: Partial<UrlContent>) => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        url: {
          ...prev.content.url,
          ...patch,
        },
      },
    }));
  }, []);

  const updateWifiContent = useCallback((patch: Partial<WifiContent>) => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        wifi: {
          ...prev.content.wifi,
          ...patch,
        },
      },
    }));
  }, []);

  const updateWhatsAppContent = useCallback((patch: Partial<WhatsAppContent>) => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        whatsapp: {
          ...prev.content.whatsapp,
          ...patch,
        },
      },
    }));
  }, []);

  const updateVCardContent = useCallback((patch: Partial<VCardContent>) => {
    setState((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        vcard: {
          ...prev.content.vcard,
          ...patch,
        },
      },
    }));
  }, []);

  const updateStyle = useCallback((patch: Partial<QRStyleState>) => {
    setState((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        ...patch,
      },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setState(DEFAULT_QR_STATE);
  }, []);

  return {
    state,
    setContentType,
    updateUrlContent,
    updateWifiContent,
    updateWhatsAppContent,
    updateVCardContent,
    updateStyle,
    resetToDefaults,
  };
}
