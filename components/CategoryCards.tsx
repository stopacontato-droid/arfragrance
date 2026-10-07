import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Pencil } from 'lucide-react';
import { PageView } from '../types/perfume';
import { getBannersConfig, DEFAULT_COLLECTION_IMAGES } from '../config/bannersConfig';
import { ScrollReveal } from './ScrollReveal';

interface CategoryCardsProps {
  onNavigate: (page: PageView) => void;
  onEditCollection?: (collectionId: 'importados' | 'arabes' | 'lab8', title: string) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onNavigate, onEditCollection }) => {
  const [banners, setBanners] = useState(() => getBannersConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setBanners(getBannersConfig());
    };
    window.addEventListener('arfragrance_banners_updated', handleUpdate);
    return () => window.removeEventListener('arfragrance_banners_updated', handleUpdate);
  }, []);

  const categories = [
    {
      id: 'importados',
      page: 'importados' as PageView,
      title: 'IMPORTADOS',
      subtitle: 'Fragrâncias internacionais consagradas para quem busca sofisticação e presença.',
      image: banners.collections.importados || DEFAULT_COLLECTION_IMAGES.importados
    },
    {
      id: 'arabes',
      page: 'arabes' as PageView,
      title: 'ÁRABES',
      subtitle: 'Perfumes orientais opulentos, exóticos e com projeção lendária.',
      image: banners.collections.arabes || DEFAULT_COLLECTION_IMAGES.arabes
    },
    {
      id: 'lab8',
      page: 'lab8' as PageView,
      title: 'LAB8',
      subtitle: 'Alta perfumaria autoral com 35% de essência pura (Extrait de Parfum).',
      image: banners.collections.lab8 || DEFAULT_COLLECTION_IMAGES.lab8,
      badge: 'NOVIDADE'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#0c0c0e] relative border-b border-[#21201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f4eee4] font-normal tracking-tight">
              Explore Nossas Coleções
            </h2>
            <div className="w-10 h-[1px] bg-[#33302a] mx-auto mt-4" />
          </div>
        </ScrollReveal>

        {/* 3 Large Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, idx) => (
            <ScrollReveal
              key={cat.id}
              animation="fade-up"
              delay={idx * 130}
              duration={800}
            >
              <div
                onClick={() => onNavigate(cat.page)}
                className="group relative h-[430px] sm:h-[490px] rounded-xl overflow-hidden cursor-pointer border border-[#2b2823] hover:border-[#c5a880]/60 transition-all duration-500 shadow-2xl bg-[#09090b]"
              >
              {/* Real Photography Background Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#121214]">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={`Coleção ${cat.title}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.82] group-hover:brightness-95"
                  />
                ) : null}
              </div>

              {/* Multi-layer Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/45 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />

              {/* Content Container */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                {/* Top action, optional badge & Edit Tool */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cat.badge ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#c5a880] to-[#dfc5a0] text-black px-3 py-1 rounded-full shadow-lg border border-[#f5e6cc]/40">
                        {cat.badge}
                      </span>
                    ) : null}

                    {onEditCollection && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCollection(cat.id as any, cat.title);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 hover:bg-[#c5a880] text-white hover:text-black border border-white/20 text-[11px] font-medium backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105"
                        title={`Editar imagem do card ${cat.title}`}
                      >
                        <Pencil className="w-3 h-3 text-[#e8c882]" />
                        <span>Editar Imagem</span>
                      </button>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#121214]/85 backdrop-blur-md border border-[#3b372f] flex items-center justify-center text-[#ded8cb] group-hover:bg-[#ded7cc] group-hover:text-[#141312] group-hover:scale-110 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Title & Subtitle */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-brand font-semibold text-[#faf7f2] tracking-[0.04em] mb-2 group-hover:text-[#ded8cb] transition-colors drop-shadow-sm">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[#b8b0a1] font-light leading-relaxed drop-shadow">
                    {cat.subtitle}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-xs text-[#ded8cb] font-medium tracking-wider uppercase group-hover:text-[#f3e5ab] transition-colors">
                    <span>Acessar coleção</span>
                    <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

