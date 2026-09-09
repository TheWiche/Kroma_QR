import React, { useState } from 'react';
import { Wifi, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import type { WifiContent } from '../../types/qr';

interface WifiFormProps {
  data: WifiContent;
  onChange: (patch: Partial<WifiContent>) => void;
}

export const WifiForm: React.FC<WifiFormProps> = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      {/* SSID Network Name */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Nombre de la Red Wi-Fi (SSID)
        </label>
        <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
          <div className="pl-3.5 pr-2 text-editorial-stone">
            <Wifi className="w-4 h-4 text-amber-golden" />
          </div>
          <input
            type="text"
            value={data.ssid}
            onChange={(e) => onChange({ ssid: e.target.value })}
            placeholder="Mi_Red_Invitados_5G"
            className="w-full py-2.5 pr-4 bg-transparent text-sm text-editorial-chalk placeholder-editorial-ash focus:outline-none"
          />
        </div>
      </div>

      {/* Encryption Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
          Tipo de Seguridad / Cifrado
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'WPA', label: 'WPA / WPA2 / WPA3' },
              { id: 'WEP', label: 'WEP' },
              { id: 'nopass', label: 'Sin Clave (Abierta)' },
            ] as const
          ).map((item) => {
            const isSelected = data.encryption === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ encryption: item.id })}
                className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                  isSelected
                    ? 'bg-persimmon/15 border-persimmon text-editorial-chalk shadow-amber-sm'
                    : 'bg-obsidian-module border-obsidian-border text-editorial-stone hover:text-editorial-chalk hover:border-obsidian-elevated'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Password Field (hidden if nopass) */}
      {data.encryption !== 'nopass' && (
        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-2">
            Contraseña de la Red
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3.5 pr-2 text-editorial-stone">
              <KeyRound className="w-4 h-4 text-persimmon" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              placeholder="Contraseña de acceso"
              className="w-full py-2.5 pr-10 bg-transparent text-sm text-editorial-chalk placeholder-editorial-ash focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-editorial-stone hover:text-editorial-chalk"
              title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Hidden network switch */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-module border border-obsidian-border">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-editorial-stone" />
          <div>
            <span className="text-xs font-medium text-editorial-chalk block">Red Oculta</span>
            <span className="text-[11px] text-editorial-ash block">
              Activar si el SSID no se transmite públicamente
            </span>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={data.hidden}
            onChange={(e) => onChange({ hidden: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-obsidian-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-editorial-chalk after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-persimmon"></div>
        </label>
      </div>
    </div>
  );
};
