import React from 'react';
import { Heart, X } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface StorySectionProps {
  onOpenModal?: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onOpenModal }) => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#0b0b0d] via-[#121013] to-[#0a0a0c] border-t border-[#23201a]">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#c5a880]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.06),transparent_65%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Top Emblem / Brand Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#1b1915] border border-[#c5a880]/30 text-[#e8c882] text-[11px] uppercase tracking-[0.25em] font-medium mb-5 shadow-sm">
              <span>Inspiração & Propósito</span>
            </div>

            {/* AR FRAGRANCE Elegant Logo */}
            <div className="flex flex-col items-center leading-none mb-4">
              <span className="font-serif italic text-4xl sm:text-5xl text-[#f3e5ab] tracking-wider font-light drop-shadow-sm">
                AR
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#c5a880] mt-1 font-light">
                FRAGRANCE
              </span>
            </div>

            {/* Separator Line with Title */}
            <div className="flex items-center justify-center gap-4 w-full max-w-md my-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#8a724d] to-[#c5a880]" />
              <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#e8c882] font-serif font-light">
                NOSSA
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#8a724d] to-[#c5a880]" />
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif text-[#faf7f2] tracking-[0.1em] font-normal uppercase my-1">
              HISTÓRIA
            </h2>

            <div className="flex items-center justify-center gap-2 text-[#c5a880] my-3">
              <div className="h-[1px] w-8 bg-[#8a724d]" />
              <Heart className="w-3.5 h-3.5 text-[#e8c882] fill-[#e8c882]/20" />
              <div className="h-[1px] w-8 bg-[#8a724d]" />
            </div>
          </div>
        </ScrollReveal>

        {/* Narrative Card */}
        <ScrollReveal animation="fade-up" delay={80} duration={750}>
          <div className="relative rounded-3xl bg-gradient-to-b from-[#16141a]/90 via-[#131117]/80 to-[#0e0d12]/90 border border-[#2e2920] p-7 sm:p-12 shadow-2xl backdrop-blur-sm">
            
            {/* Corner Decorative Accents */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#c5a880]/40" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#c5a880]/40" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#c5a880]/40" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#c5a880]/40" />

            {/* Main Text Content */}
            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="text-sm sm:text-base text-[#cfc8bd] font-light leading-relaxed">
                O nome <strong className="text-[#faf7f2] font-medium">AR</strong> nasceu da pessoa mais importante das nossas vidas:
              </p>

              {/* Asafe Ravi Highlight */}
              <div className="py-2">
                <span className="block font-serif italic text-3xl sm:text-5xl text-[#f3e5ab] tracking-wide leading-tight drop-shadow-sm font-normal">
                  Asafe Ravi,
                </span>
                <span className="text-xs sm:text-sm text-[#b5aa99] tracking-[0.2em] uppercase font-light mt-1.5 block">
                  nosso filho.
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#b8b0a2] font-light leading-relaxed">
                Ele é a inspiração por trás da nossa marca e representa tudo o que queremos transmitir: <span className="text-[#f0eae0] font-normal">amor, cuidado e momentos inesquecíveis.</span>
              </p>

              <div className="w-12 h-[1px] bg-[#3a352b] mx-auto my-4" />

              <p className="text-sm sm:text-base text-[#c4bcae] font-light leading-relaxed italic">
                &ldquo;Assim como um perfume marca uma lembrança, nosso desejo é que cada fragrância da AR Fragrance faça parte da sua história.&rdquo;
              </p>

              {/* Identity Pillar */}
              <div className="py-3">
                <p className="text-xs sm:text-sm text-[#9c9384] uppercase tracking-[0.18em] mb-2 font-light">
                  Porque, para nós, perfume não é apenas um aroma:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-serif text-[#faf7f2]">
                  <span className="flex items-center gap-1.5 text-[#e8c882]">
                    <span>É identidade.</span>
                  </span>
                  <span className="text-[#5a5448] hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5 text-[#ded8cb]">
                    <span>É memória.</span>
                  </span>
                  <span className="text-[#5a5448] hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5 text-[#e8c882]">
                    <span>É emoção.</span>
                  </span>
                </div>
              </div>

              {/* Bottom Heart & Signature */}
              <div className="pt-4 border-t border-[#26231c]">
                <Heart className="w-4 h-4 text-[#e8c882] fill-[#e8c882]/20 mx-auto mb-3" />
                <span className="font-serif italic text-2xl sm:text-3xl text-[#f3e5ab] tracking-wide block">
                  AR Fragrance
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#a89f90] mt-1.5 block font-light">
                  Inspirada no amor que deu origem ao nosso maior sonho.
                </span>
              </div>

              {/* Perfume Bottle Silhouette Icon */}
              <div className="pt-2 flex justify-center">
                <svg
                  className="w-8 h-10 text-[#c5a880]/70"
                  viewBox="0 0 40 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  {/* Cap */}
                  <rect x="15" y="4" width="10" height="6" rx="1" />
                  {/* Neck */}
                  <rect x="17" y="10" width="6" height="4" />
                  {/* Bottle Body */}
                  <rect x="8" y="14" width="24" height="30" rx="3" />
                  {/* Inner Label */}
                  <rect x="12" y="20" width="16" height="18" rx="1.5" strokeDasharray="1 2" strokeWidth="0.8" />
                  <line x1="15" y1="26" x2="25" y2="26" strokeWidth="0.8" />
                  <line x1="16" y1="30" x2="24" y2="30" strokeWidth="0.8" />
                </svg>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
