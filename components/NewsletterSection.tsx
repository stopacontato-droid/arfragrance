import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { getStorePaymentConfig } from '../config/paymentConfig';
import { ScrollReveal } from './ScrollReveal';

export const NewsletterSection: React.FC = () => {
  const [desiredPerfume, setDesiredPerfume] = useState('');

  const handleOpenWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const config = getStorePaymentConfig();
    const cleanPhone = (config.whatsappNumber || '5511987654321').replace(/\D/g, '') || '5511987654321';
    
    let messageText = 'Olá! Estou procurando um perfume específico que não encontrei no site e gostaria de saber se vocês conseguem sob encomenda.';
    if (desiredPerfume.trim()) {
      messageText = `Olá! Gostaria de saber se vocês conseguem sob encomenda o perfume: *${desiredPerfume.trim()}*.`;
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0c0c0e] via-[#111014] to-[#0e0d11] relative overflow-hidden border-b border-[#21201d]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal animation="fade-up" duration={750}>
          {/* Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1c1b1f] border border-[#c5a880]/35 text-xs uppercase tracking-[0.2em] text-[#e8c882] mb-4 shadow-sm font-medium">
            <span>ENCOMENDAS & CONSULTORIA EXCLUSIVA</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl font-serif text-[#faf7f2] font-normal tracking-tight mb-3">
            Procurando Algum Outro Perfume?
          </h2>

          {/* Message requested by user */}
          <p className="text-sm sm:text-base text-[#c4bcae] font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Não encontrou a fragrância que você deseja no catálogo? Nos envie o nome ou foto do perfume desejado! Nossa equipe localiza frascos lacrados originais de perfumaria importada e árabe rara sob encomenda para você.
          </p>

          {/* Input + WhatsApp Redirect Button */}
          <form onSubmit={handleOpenWhatsApp} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#787163]" />
              <input
                type="text"
                value={desiredPerfume}
                onChange={(e) => setDesiredPerfume(e.target.value)}
                placeholder="Digite o perfume que você deseja..."
                className="w-full bg-[#18171d] border border-[#302d28] rounded-xl pl-10 pr-4 py-3.5 text-sm text-[#faf7f2] placeholder-[#787163] focus:border-[#c5a880] focus:outline-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-2.5 shrink-0 cursor-pointer active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Chame Aqui no WhatsApp</span>
            </button>
          </form>

          <p className="text-[11px] text-[#70695d] mt-4 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Atendimento rápido e personalizado via WhatsApp</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};
