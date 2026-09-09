import React from 'react';
import { Globe, Wifi, MessageSquare, Contact } from 'lucide-react';
import type { QRContentType } from '../../types/qr';

interface ContentTabsProps {
  activeType: QRContentType;
  onSelect: (type: QRContentType) => void;
}

interface TabDefinition {
  id: QRContentType;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ activeType, onSelect }) => {
  const tabs: TabDefinition[] = [
    {
      id: 'url',
      label: 'Enlace URL',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: 'wifi',
      label: 'Red Wi-Fi',
      icon: <Wifi className="w-4 h-4" />,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'vcard',
      label: 'Contacto vCard',
      icon: <Contact className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-obsidian-module border border-obsidian-border/90 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeType === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`flex-1 min-w-[105px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all select-none ${
              isActive
                ? 'bg-persimmon text-obsidian-base shadow-amber-sm font-bold'
                : 'text-editorial-stone hover:text-editorial-chalk hover:bg-obsidian-elevated/60'
            }`}
          >
            <span className={isActive ? 'text-obsidian-base' : 'text-persimmon'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
