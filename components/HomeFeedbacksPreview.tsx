import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { FEEDBACKS_DATA, FEEDBACK_STATS } from '../data/feedbacksData';
import { PageView } from '../types/perfume';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface HomeFeedbacksPreviewProps {
  onNavigate: (page: PageView) => void;
}

export const HomeFeedbacksPreview: React.FC<HomeFeedbacksPreviewProps> = ({ onNavigate }) => {
  // Top 4 highlighted real feedbacks
  const highlighted = FEEDBACKS_DATA.slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-[#0c0c0e] via-[#111015] to-[#0c0c0e] border-t border-[#21201d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201d16] border border-[#c5a880]/40 text-xs font-semibold text-[#e8c882] uppercase tracking-wider mb-3">
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Clientes no WhatsApp • Prova Social Real</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#faf7f2] tracking-tight">
              O que nossos clientes dizem
            </h2>
            <p className="text-xs sm:text-sm text-[#9c9384] mt-1.5 max-w-xl">
              Prints de conversas reais de clientes que compraram com o Gabriel. Fixação comprovada, perfumes originais e embalagens impecáveis.
            </p>
          </div>

          <button
            onClick={() => onNavigate('feedbacks')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e1c24] hover:bg-[#282631] border border-[#c5a880]/40 text-xs font-semibold text-[#e8c882] hover:text-white transition-all self-start md:self-auto cursor-pointer shadow-md"
          >
            <span>Ver Todos os 37 Feedbacks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {highlighted.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('feedbacks')}
              className="p-4 rounded-2xl bg-[#141318] border border-[#2b2720] hover:border-[#c5a880] transition-all flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-xl"
            >
              <div>
                {/* Top Row: Rating Badge + Verification */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#e8c882] tracking-wider uppercase">
                    Avaliação 5.0
                  </span>
                  <span className="text-[10px] text-[#25d366] font-medium flex items-center gap-1 bg-[#132219] px-2 py-0.5 rounded-full border border-[#25d366]/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verificado</span>
                  </span>
                </div>

                {/* Speech Bubble */}
                <div className="p-3 rounded-xl bg-[#0b141a] border border-[#1f2c34] text-xs text-[#e9edef] leading-relaxed mb-3">
                  <p className="line-clamp-3 italic">
                    &ldquo;{item.message}&rdquo;
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#182229] text-[9px] text-[#8696a0]">
                    <span>{item.customerName}</span>
                    <span className="text-[#53bdeb]">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Perfume Reference - Clean & Elegant Text Badge (No artificial image) */}
              <div className="pt-3 border-t border-[#23201a] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-medium text-[#ded8cb] truncate group-hover:text-[#e8c882] transition-colors">
                    {item.perfumeMentioned}
                  </span>
                </div>
                <span className="text-[9.5px] px-2 py-0.5 rounded bg-[#1c1b22] text-[#8e8577] border border-[#2b2732] shrink-0">
                  {item.categoryLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#16151b] border border-[#2a261f] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/40 flex items-center justify-center text-[#e8c882] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#faf7f2]">
                Mais de 500 perfumes entregues com 100% de satisfação
              </div>
              <div className="text-[11px] text-[#8e8577]">
                Acesse a aba de Feedbacks para conferir a galeria completa de 37 prints organizados
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('feedbacks')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e6ca95] text-black font-semibold text-xs tracking-wider uppercase transition-opacity hover:opacity-90 shrink-0 cursor-pointer shadow-md"
          >
            Acessar Aba de Feedbacks
          </button>
        </div>

      </div>
    </section>
  );
};
