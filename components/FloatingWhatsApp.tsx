import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { getStorePaymentConfig } from '../config/paymentConfig';

export const FloatingWhatsApp: React.FC = () => {
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const config = getStorePaymentConfig();
  const cleanPhone = (config.whatsappNumber || '5511987654321').replace(/\D/g, '') || '5511987654321';

  const whatsappMessage = encodeURIComponent(
    "Olá! Estou navegando no site da AR Fragrance e gostaria de uma consultoria olfativa personalizada sobre perfumes das coleções."
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3">
      {/* Tooltip speech bubble */}
      {tooltipVisible && (
        <div className="hidden sm:flex items-center gap-2.5 bg-[#17161b] text-[#faf7f2] border border-[#c5a880]/40 py-2.5 px-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300 max-w-xs">
          <a
            href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-semibold text-[#e8c882]">Atendimento no WhatsApp</p>
            </div>
            <p className="text-[11px] text-[#ded8cb]">Tire dúvidas ou peça seu perfume agora mesmo!</p>
          </a>
          <button
            onClick={() => setTooltipVisible(false)}
            className="text-[#787163] hover:text-white p-1 ml-1 cursor-pointer"
            aria-label="Fechar dica do WhatsApp"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button with Real WhatsApp Icon */}
      <a
        href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar no WhatsApp"
        className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group drop-shadow-[0_10px_20px_rgba(37,211,102,0.45)] cursor-pointer"
      >
        <WhatsAppIcon className="w-14 h-14" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#e8c882] rounded-full border-2 border-[#121214] animate-pulse" />
      </a>
    </div>
  );
};
