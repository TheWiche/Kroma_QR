import React from 'react';
import { Globe, Link2 } from 'lucide-react';
import type { UrlContent } from '../../types/qr';

interface UrlFormProps {
  data: UrlContent;
  onChange: (patch: Partial<UrlContent>) => void;
}

export const UrlForm: React.FC<UrlFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Dirección URL o Enlace Web
        </label>
        <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
          <div className="pl-3.5 pr-2 text-editorial-stone">
            <Globe className="w-4 h-4 text-persimmon" />
          </div>
          <input
            type="url"
            value={data.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://tu-dominio.com o https://instagram.com/..."
            className="w-full py-2.5 pr-4 bg-transparent text-sm text-editorial-chalk placeholder-editorial-ash focus:outline-none font-mono"
          />
        </div>
        <p className="mt-2 text-[11px] text-editorial-ash flex items-center gap-1.5">
          <Link2 className="w-3.5 h-3.5 text-persimmon/70" />
          Cualquier enlace es compatible (sitios web, redes sociales, menús digitales, Google Maps).
        </p>
      </div>

      {/* Quick shortcuts */}
      <div className="pt-1">
        <span className="text-[11px] text-editorial-stone block mb-2 font-medium">
          Plantillas de prueba rápida:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            'https://kroma-qr-studio.vercel.app/',
            'https://instagram.com/kroma_design',
            'https://maps.app.goo.gl/kroma-hq',
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => onChange({ url: sample })}
              className="text-xs px-2.5 py-1 rounded-lg bg-obsidian-elevated/70 hover:bg-obsidian-elevated text-editorial-stone hover:text-editorial-chalk border border-obsidian-border transition-colors font-mono"
            >
              {sample.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
