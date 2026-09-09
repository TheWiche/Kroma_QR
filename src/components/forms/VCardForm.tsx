import React from 'react';
import { User, Building, Briefcase, Phone, Mail, Globe, MapPin } from 'lucide-react';
import type { VCardContent } from '../../types/qr';

interface VCardFormProps {
  data: VCardContent;
  onChange: (patch: Partial<VCardContent>) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-3.5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Nombre
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <User className="w-3.5 h-3.5 text-persimmon" />
            </div>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="Elena"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Apellidos
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <User className="w-3.5 h-3.5 text-editorial-stone" />
            </div>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Ríos"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Organization & Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Empresa / Organización
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <Building className="w-3.5 h-3.5 text-editorial-stone" />
            </div>
            <input
              type="text"
              value={data.organization}
              onChange={(e) => onChange({ organization: e.target.value })}
              placeholder="Kroma Studio"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Cargo / Puesto
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <Briefcase className="w-3.5 h-3.5 text-editorial-stone" />
            </div>
            <input
              type="text"
              value={data.jobTitle}
              onChange={(e) => onChange({ jobTitle: e.target.value })}
              placeholder="Directora Creativa"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Teléfono Móvil
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <Phone className="w-3.5 h-3.5 text-persimmon" />
            </div>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+57 300 123 4567"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Correo Electrónico
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <Mail className="w-3.5 h-3.5 text-amber-golden" />
            </div>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="contacto@kromastudio.design"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Website & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Sitio Web
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <Globe className="w-3.5 h-3.5 text-editorial-stone" />
            </div>
            <input
              type="url"
              value={data.website}
              onChange={(e) => onChange({ website: e.target.value })}
              placeholder="https://kromastudio.design"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-editorial-stone uppercase tracking-wider mb-1.5">
            Ubicación / Dirección
          </label>
          <div className="relative flex items-center rounded-xl bg-obsidian-module border border-obsidian-border focus-within:border-persimmon/70 focus-within:ring-1 focus-within:ring-persimmon/50 transition-all">
            <div className="pl-3 pr-2 text-editorial-stone">
              <MapPin className="w-3.5 h-3.5 text-editorial-stone" />
            </div>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="Bogotá, Colombia"
              className="w-full py-2 pr-3 bg-transparent text-xs text-editorial-chalk placeholder-editorial-ash focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
