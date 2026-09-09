import React from 'react';
import { MessageSquare, PhoneCall, Send } from 'lucide-react';
import type { WhatsAppContent } from '../../types/qr';

interface WhatsAppFormProps {
  data: WhatsAppContent;
  onChange: (patch: Partial<WhatsAppContent>) => void;
}

const COMMON_COUNTRY_CODES = [
  { code: '+57', label: 'Colombia (+57)' },
  { code: '+52', label: 'México (+52)' },
  { code: '+34', label: 'España (+34)' },
  { code: '+1', label: 'EE.UU. / Canadá (+1)' },
  { code: '+54', label: 'Argentina (+54)' },
  { code: '+56', label: 'Chile (+56)' },
  { code: '+51', label: 'Perú (+51)' },
];

export const WhatsAppForm: React.FC<WhatsAppFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Phone Number with country code */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Número de Teléfono WhatsApp
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <select
            value={data.countryCode}
            onChange={(e) => onChange({ countryCode: e.target.value })}
            className="col-span-1 py-2.5 px-3 rounded-xl bg-obsidian-module border border-obsidian-border text-xs text-editorial-chalk focus:outline-none focus:border-persimmon/70 font-mono"
          >
            {COMMON_COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="bg-obsidian-card">
                {c.code}
              </option>
            ))}
          </select>

          <div className="col-span-2 sm:col-span-3 relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3.5 pr-2 text-editorial-stone">
              <PhoneCall className="w-4 h-4 text-persimmon" />
            </div>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value.replace(/[^0-9\s-]/g, '') })}
              placeholder="300 123 4567"
              className="w-full py-2.5 pr-4 bg-transparent text-sm text-editorial-chalk placeholder-editorial-ash focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Predefined message */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Mensaje Predeterminado (Opcional)
        </label>
        <div className="relative rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
          <textarea
            rows={3}
            value={data.message}
            onChange={(e) => onChange({ message: e.target.value })}
            placeholder="¡Hola! Quisiera más información sobre sus servicios..."
            className="w-full p-3 bg-transparent text-sm text-editorial-chalk placeholder-editorial-ash focus:outline-none resize-none"
          />
          <div className="absolute bottom-2.5 right-3 text-editorial-ash text-[10px] font-mono flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-persimmon/70" />
            {data.message.length} caracteres
          </div>
        </div>
      </div>

      {/* Message Quick Presets */}
      <div>
        <span className="text-[11px] text-editorial-stone block mb-2 font-medium">
          Sugerencias de mensajes:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            '¡Hola! Me gustaría cotizar un proyecto.',
            'Hola, quiero agendar una reserva.',
            '¡Hola! Vi su código QR en el mostrador.',
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => onChange({ message: sample })}
              className="text-xs px-2.5 py-1 rounded-lg bg-obsidian-elevated/70 hover:bg-obsidian-elevated text-editorial-stone hover:text-editorial-chalk border border-obsidian-border transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3 h-3 text-persimmon" />
              <span>{sample}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
