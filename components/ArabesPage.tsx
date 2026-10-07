import React, { useState, useMemo, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Crown, 
  ChevronRight, 
  ChevronLeft,
  Heart, 
  X, 
  ShieldCheck,
  Award, 
  Flame, 
  CheckCircle2,
  Pencil,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { Product } from '../types/perfume';
import { ProductCard } from './ProductCard';
import { LazyImage } from './LazyImage';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { ARABIC_PERFUMES } from '../data/arabicPerfumes';
import { getStorePaymentConfig } from '../config/paymentConfig';
import { ScrollReveal } from './ScrollReveal';

interface ArabesPageProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

type GenderOption = 'todos' | 'masculino' | 'feminino' | 'unissex';

// OS 3 PRINCIPAIS DESTAQUES PARA O CARROSSEL NO INÍCIO DA PÁGINA
const ARABES_TOP3_DESTAQUES = [
  {
    id: 'lattafa-asad',
    highlightBadge: 'DESTAQUE #01 • MAIS DESEJADO',
    tagline: 'O ícone dourado supremo com fixação imperial e aura magnética',
    signatureNotes: ['Pimenta Preta', 'Tabaco Caramelizado', 'Café Torrado', 'Âmbar Seco', 'Baunilha']
  },
  {
    id: 'armaf-club-de-nuit-intense-man',
    highlightBadge: 'DESTAQUE #02 • BEAST MODE',
    tagline: 'O fenômeno global de projeção monstruosa e rastro inesquecível',
    signatureNotes: ['Limão Siciliano', 'Groselha Preta', 'Bétula Defumada', 'Patchouli', 'Ambroxan']
  },
  {
    id: 'lattafa-khamrah',
    highlightBadge: 'DESTAQUE #03 • OBRA-PRIMA',
    tagline: 'Gourmand licoroso e conhaque nobre em cristal lapidado pesado',
    signatureNotes: ['Canela Quente', 'Tâmaras Orientais', 'Praliné Aveludado', 'Fava Tonka', 'Benjoim']
  }
];

export const ArabesPage: React.FC<ArabesPageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onEditProduct
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderOption>('todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('todas');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter arabian perfumes with real-time updates
  const allArabes = useMemo(() => {
    return products.filter((p) => p.category === 'arabes');
  }, [products]);

  // Top 3 Highlights Carousel State
  const [activeHighlightIdx, setActiveHighlightIdx] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // Match the 3 highlights to live product state (customizations/photos/prices)
  const top3Highlights = useMemo(() => {
    return ARABES_TOP3_DESTAQUES.map((destaque) => {
      const liveProduct = products.find((p) => p.id === destaque.id) || allArabes.find((p) => p.id === destaque.id);
      return {
        ...destaque,
        product: liveProduct
      };
    }).filter((d) => Boolean(d.product));
  }, [products, allArabes]);

  // Current active highlight
  const currentDestaque = top3Highlights[activeHighlightIdx] || top3Highlights[0];
  const activeProduct = currentDestaque?.product;

  // Auto-advance carousel every 6s unless hovered
  useEffect(() => {
    if (isCarouselHovered || top3Highlights.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHighlightIdx((prev) => (prev + 1) % top3Highlights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselHovered, top3Highlights.length]);

  const handlePrevSlide = () => {
    setActiveHighlightIdx((prev) => (prev - 1 + top3Highlights.length) % top3Highlights.length);
  };

  const handleNextSlide = () => {
    setActiveHighlightIdx((prev) => (prev + 1) % top3Highlights.length);
  };

  // SEO configuration for /arabes
  useEffect(() => {
    document.title = 'Perfumes Árabes | AR FRAGRANCE';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Descubra a seleção exclusiva de perfumes árabes da AR FRAGRANCE: Asad Le Parfum, Club de Nuit Intense, Hayaati, Bareeq Al Dhahab, Khamrah e Fakhar Black.'
      );
    }
  }, []);

  // Unique brands (filtering out empty names)
  const arabicBrands = useMemo(() => {
    const brands = Array.from(new Set(allArabes.map((p) => p.brand).filter((b) => Boolean(b && b.trim()))));
    return brands.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [allArabes]);

  // Signature premiere perfumes (top 6 icons)
  const signatureArabes = useMemo(() => {
    return allArabes.slice(0, 6);
  }, [allArabes]);

  // Asad original for "Destaque da Semana"
  const asadOriginal = useMemo(() => {
    return allArabes.find((p) => p.id === 'lattafa-asad') || allArabes[0];
  }, [allArabes]);

  // Filtered & sorted catalog
  const processedProducts = useMemo(() => {
    let result = allArabes.filter((item) => {
      if (selectedGender === 'masculino' && item.gender !== 'masculino') return false;
      if (selectedGender === 'feminino' && item.gender !== 'feminino') return false;
      if (selectedGender === 'unissex' && item.gender !== 'unissex') return false;
      if (selectedBrand !== 'todas' && item.brand !== selectedBrand) return false;
      return true;
    });

    return result;
  }, [allArabes, selectedGender, selectedBrand]);

  const formatPrice = (value: number) => {
    if (!value || value <= 0) return 'Consulte o preço';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleWhatsAppBuyDirect = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (product.inStock === false) return;
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      const config = getStorePaymentConfig();
      const cleanPhone = (config.whatsappNumber || '5511987654321').replace(/\D/g, '') || '5511987654321';
      const message = `Olá, tenho interesse no perfume árabe ${product.name} (${product.brand})`;
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-[#ede7dc]">
      {/* ========================================================= */}
      {/* 1. HERO CARROSSEL DOS 3 DESTAQUES (MESMO FUNDO)          */}
      {/* ========================================================= */}
      <section 
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
        className="relative bg-[#0c0c0e] border-b border-[#21201d] overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top category navigation: Centralizado, Fonte Natural, Sem Amarelado em volta */}
          <div className="flex flex-col items-center justify-center text-center mb-8 pb-5 border-b border-[#21201d]/60">
            <div className="flex items-center justify-center gap-2.5">
              <Crown className="w-4 h-4 text-[#9c9384]" />
              <h2 className="text-sm sm:text-base font-medium tracking-wider text-[#ded8cb] uppercase">
                AR FRAGRANCE • TOP 3 DESTAQUES DA PERFUMARIA ÁRABE
              </h2>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-[#8e877a] mt-2">
              <span className="text-[#ded8cb] font-semibold">0{activeHighlightIdx + 1}</span>
              <span>/</span>
              <span>0{top3Highlights.length}</span>
            </div>
          </div>

          {/* Main Stage Grid (Left: Narrative & Specs, Right: Floating Monumental Bottle) */}
          {activeProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
              {/* Left Content Column */}
              <div className="lg:col-span-7 text-left flex flex-col justify-center">
                {/* Highlight Badge */}
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-xs font-medium tracking-widest uppercase text-[#b8ad9e]">
                    {currentDestaque.highlightBadge}
                  </span>
                  <span className="text-xs text-[#736e65]">·</span>
                  <span className="text-xs text-[#8c8577] capitalize">
                    {activeProduct.gender === 'masculino' ? 'Masculino' : activeProduct.gender === 'feminino' ? 'Feminino' : 'Unissex'} • {activeProduct.concentration || 'Eau de Parfum'}
                  </span>
                </div>

                {/* Brand */}
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#9c9384] font-medium mb-1">
                  {activeProduct.brand}
                </p>

                {/* Perfume Name */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#faf7f2] font-normal tracking-tight leading-[1.1] mb-2">
                  {activeProduct.name}
                </h1>

                {/* Tagline */}
                <p className="text-base sm:text-lg text-[#ded8cb] font-light mb-4">
                  {currentDestaque.tagline}
                </p>

                {/* Fragrance Notes */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-[#a39b8d] mb-5">
                  <span className="text-[#736c60] text-[11px] uppercase tracking-wider">Notas:</span>
                  {currentDestaque.signatureNotes.map((note, idx) => (
                    <span key={note} className="flex items-center gap-2">
                      <span className="text-[#ded8cb]">{note}</span>
                      {idx < currentDestaque.signatureNotes.length - 1 && <span className="text-[#555047]">·</span>}
                    </span>
                  ))}
                </div>

                {/* Description Narrative */}
                <p className="text-xs sm:text-sm text-[#a8a194] font-light leading-relaxed max-w-xl mb-6 line-clamp-2 sm:line-clamp-3">
                  {activeProduct.description}
                </p>

                {/* Performance Meta (Without Origin) */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#ded8cb] mb-6 pt-3 border-t border-[#1f1e24]">
                  {activeProduct.longevity && (
                    <span className="flex items-center gap-1.5 text-[#ded8cb]">
                      <Clock className="w-3.5 h-3.5 text-[#9c9384]" />
                      <span>Fixação: {activeProduct.longevity}</span>
                    </span>
                  )}
                  {activeProduct.sillage && (
                    <span className="text-[#9c9384] hidden sm:inline">
                      Projeção: <strong className="text-[#ded8cb]">{activeProduct.sillage}</strong>
                    </span>
                  )}
                </div>

                {/* Pricing & CTA Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1f1e24]">
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-serif font-medium text-[#faf7f2]">
                        {formatPrice(activeProduct.price)}
                      </span>
                      {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                        <span className="text-sm text-[#787163] line-through">
                          {formatPrice(activeProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9c9384] mt-0.5">
                      Em até 10x de {formatPrice(activeProduct.price / 10)} sem juros • Pronta Entrega
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Primary Buy CTA */}
                    <button
                      onClick={(e) => handleWhatsAppBuyDirect(activeProduct, e)}
                      title={`Comprar ${activeProduct.name}`}
                      className="px-6 py-3 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#ded7cc] hover:bg-[#eae5dd] text-[#141312] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>COMPRAR AGORA</span>
                    </button>

                    {/* Secondary Details CTA */}
                    <button
                      onClick={() => onSelectProduct(activeProduct)}
                      title={`Ver especificações completas de ${activeProduct.name}`}
                      className="px-4 py-3 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#161518] hover:bg-[#201f24] text-[#ded8cb] border border-[#2b2a26] hover:border-[#4d483e] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>DETALHES</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#9c9384]" />
                    </button>

                    {/* Edit Tool Shortcut */}
                    {onEditProduct && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(activeProduct);
                        }}
                        title={`Editar foto, valor e descrição de ${activeProduct.name}`}
                        className="p-3 rounded-md bg-[#161518] hover:bg-[#201f24] text-[#d4cdbf] hover:text-[#ded8cb] border border-[#2b2a26] transition-all cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Monumental Bottle Floating Directly on the Shared Background */}
              <div className="lg:col-span-5 relative flex items-center justify-center py-4 lg:py-0">
                {/* Arrow Navigation: Previous Button */}
                <button
                  onClick={handlePrevSlide}
                  title="Destaque anterior"
                  aria-label="Destaque anterior"
                  className="absolute left-0 sm:-left-3 z-30 p-2.5 rounded-full bg-[#121215]/80 hover:bg-[#1c1b22] text-[#d4cdbf] hover:text-white border border-[#2b2a26] shadow-lg backdrop-blur-md transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Bottle Stage (Pure Product, NO Card Frame) */}
                <div 
                  onClick={() => onSelectProduct(activeProduct)}
                  className="relative w-full max-w-[340px] sm:max-w-[400px] flex flex-col items-center justify-center cursor-pointer group"
                >
                  <div className="relative w-full h-[320px] sm:h-[420px] flex items-center justify-center">
                    {top3Highlights.map((destaque, idx) => {
                      const prod = destaque.product;
                      if (!prod) return null;
                      const imgSrc = (prod.image && prod.image.trim() !== '') 
                        ? prod.image 
                        : (prod.images && prod.images[0] && prod.images[0].trim() !== '') 
                          ? prod.images[0] 
                          : null;
                      const isCurrent = idx === activeHighlightIdx;

                      return (
                        <div
                          key={destaque.id}
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                            isCurrent
                              ? 'opacity-100 scale-100 translate-y-0 z-20'
                              : 'opacity-0 scale-90 translate-y-4 pointer-events-none z-10'
                          }`}
                        >
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={`${prod.brand} ${prod.name}`}
                              className="max-h-[90%] max-w-[90%] w-auto h-auto object-contain object-center drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Soft Realistic Pedestal Shadow on the Shared Stage */}
                  <div className="w-56 sm:w-72 h-5 rounded-full bg-black/90 blur-xl -mt-2 pointer-events-none" />

                  {/* Quick Wishlist Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(activeProduct);
                    }}
                    title={wishlist.includes(activeProduct.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className={`absolute top-0 right-2 p-2.5 rounded-full backdrop-blur-md transition-all z-30 cursor-pointer ${
                      wishlist.includes(activeProduct.id)
                        ? 'bg-[#b99a62] text-black shadow-lg'
                        : 'bg-[#121215]/80 text-[#d4cdbf] hover:text-[#b99a62] border border-[#2f2b24]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(activeProduct.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Arrow Navigation: Next Button */}
                <button
                  onClick={handleNextSlide}
                  title="Próximo destaque"
                  aria-label="Próximo destaque"
                  className="absolute right-0 sm:-right-3 z-30 p-2.5 rounded-full bg-[#121215]/80 hover:bg-[#1c1b22] text-[#d4cdbf] hover:text-[#b99a62] border border-[#2f2b24] hover:border-[#b99a62] shadow-xl backdrop-blur-md transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Switcher: 3 Interactive Tabs on the Same Background */}
          <div className="mt-8 sm:mt-12 pt-6 border-t border-[#21201d]/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto">
              {top3Highlights.map((destaque, idx) => {
                const prod = destaque.product;
                const isCurrent = idx === activeHighlightIdx;

                return (
                  <button
                    key={destaque.id}
                    onClick={() => setActiveHighlightIdx(idx)}
                    className={`px-3 sm:px-5 py-3 rounded-xl transition-all text-left flex items-center gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#19181d] border border-[#b99a62] shadow-[0_0_20px_rgba(185,154,98,0.2)]'
                        : 'bg-[#101014]/60 hover:bg-[#17161b] border border-[#23211e] text-[#a5a5a5]'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isCurrent ? 'text-[#b99a62]' : 'text-[#736c61]'}`}>
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-xs font-serif font-medium truncate ${isCurrent ? 'text-[#f2efe8]' : 'text-[#a5a5a5]'}`}>
                        {prod?.name?.replace(' (Le Parfum)', '') || destaque.id}
                      </p>
                      <p className="text-[10px] text-[#736c61] uppercase tracking-wider truncate">
                        {prod?.brand} • {formatPrice(prod?.price || 0)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Slide Navigation Progress */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollToSection('linha-destaque')}
                className="text-xs font-semibold uppercase tracking-wider text-[#b99a62] hover:text-[#ede7dc] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Explorar Coleção Completa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex gap-1.5">
                {top3Highlights.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHighlightIdx(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeHighlightIdx ? 'w-8 bg-[#b99a62]' : 'w-2.5 bg-[#2d2a23]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. COLEÇÃO EXCLUSIVA — OS 6 ÍCONES SELECIONADOS           */}
      {/* ========================================================= */}
      <section id="linha-destaque" className="py-14 sm:py-20 border-b border-[#21201d] bg-[#0e0e11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#21201d]">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#9c9384] font-medium mb-2">
                  Coleção Exclusiva Selecionada
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#f2efe8] font-normal tracking-tight">
                  OS 6 ÍCONES DA PERFUMARIA ÁRABE
                </h2>
                <p className="text-base text-[#ded8cb] mt-1 font-light">
                  Obras-primas com design escultural, fixação imperial e matérias-primas nobres.
                </p>
                <p className="text-xs sm:text-sm text-[#9c9384] mt-2 max-w-2xl leading-relaxed">
                  Cada frasco desta coleção representa o ápice da alta perfumaria de prestígio, com lotes lacrados e garantia total de autenticidade.
                </p>
              </div>

              <button
                onClick={() => scrollToSection('catalogo-arabes')}
                className="px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#161518] hover:bg-[#201f24] text-[#ded8cb] border border-[#2b2a26] hover:border-[#4d483e] transition-all whitespace-nowrap self-start md:self-auto flex items-center gap-2 cursor-pointer"
              >
                <span>IR PARA O CATÁLOGO</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9c9384]" />
              </button>
            </div>
          </ScrollReveal>

          {/* Grid dos 6 Ícones Padronizados com ProductCard */}
          <ScrollReveal animation="fade-up" delay={120} duration={800}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {signatureArabes.map((item, index) => (
                <ProductCard
                  key={`destaque-${item.id}`}
                  product={item}
                  index={index}
                  isWishlisted={wishlist.includes(item.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                  onEditProduct={onEditProduct}
                />
              ))}
            </div>
          </ScrollReveal>

          {/* Título Centralizado: Fragrâncias Árabes */}
          <div className="mt-14 pt-8 text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="h-[1px] w-12 sm:w-16 bg-[#33302a]" />
              <span className="text-[#a8a194] text-[11px] font-medium uppercase tracking-[0.25em]">
                Catálogo Geral
              </span>
              <span className="h-[1px] w-12 sm:w-16 bg-[#33302a]" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#f2efe8] font-normal tracking-wide">
              Fragrâncias Árabes
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-[#b99a62]/60 rounded-full" />
              <span className="h-1.5 w-1.5 bg-[#b99a62] rotate-45" />
              <span className="h-[1px] w-8 bg-[#b99a62]/60 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PRODUTO EM DESTAQUE — DESTAQUE DA SEMANA (ASAD)        */}
      {/* ========================================================= */}
      {asadOriginal && (
        <section className="py-12 sm:py-16 border-b border-[#21201d] bg-[#0b0b0b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#b99a62]/40 bg-gradient-to-r from-[#141417] via-[#17161b] to-[#121215] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#b99a62]/10 to-transparent pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Imagem Grande à Esquerda */}
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div 
                    className="relative w-full max-w-sm aspect-square bg-gradient-to-b from-[#19181d] via-[#151419] to-[#101013] rounded-xl p-6 border border-[#2e2a22] flex items-center justify-center shadow-2xl group cursor-pointer overflow-hidden"
                    onClick={() => onSelectProduct(asadOriginal)}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,154,98,0.12)_0%,transparent_70%)] pointer-events-none" />
                    <div className="absolute bottom-6 w-32 h-3.5 bg-black/75 rounded-full blur-md pointer-events-none" />
                    <LazyImage
                      key={`${asadOriginal.id}-${asadOriginal.image || asadOriginal.images[0]}`}
                      src={asadOriginal.image || asadOriginal.images[0]}
                      alt={`${asadOriginal.brand} ${asadOriginal.name}`}
                      className="max-h-[250px] max-w-[78%] w-auto h-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.92)] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#b99a62] text-black text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider z-10 shadow">
                      DESTAQUE DA SEMANA
                    </div>
                  </div>
                </div>

                {/* Informações à Direita */}
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#b99a62] uppercase mb-2">
                    <span>{asadOriginal.brand}</span>
                    <span>•</span>
                    <span>Perfume Árabe Masculino</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f2efe8] font-normal tracking-tight mb-3">
                    {asadOriginal.name}
                  </h2>

                  <p className="text-sm sm:text-base text-[#d4cdbf] font-light leading-relaxed mb-6">
                    A versão mais refinada do clássico Asad com detalhes em couro marrom e anel dourado imperial. Notas quentes de pimenta, café arábica e tabaco com fundo aveludado de baunilha e âmbar.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-lg bg-[#111114] border border-[#262420]">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a5a5a5]">Volume</p>
                      <p className="text-xs font-semibold text-[#f2efe8]">100 ml</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a5a5a5]">Fixação</p>
                      <p className="text-xs font-semibold text-[#b99a62]">12 a 14 Horas</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl sm:text-3xl font-semibold text-[#f2efe8]">
                      {formatPrice(asadOriginal.price)}
                    </span>
                    {asadOriginal.originalPrice && (
                      <span className="text-sm text-[#787163] line-through">
                        {formatPrice(asadOriginal.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs text-[#a5a5a5]">
                      (10x de {formatPrice(asadOriginal.price / 10)} sem juros)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => onSelectProduct(asadOriginal)}
                      className="px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#b99a62] to-[#d6bc88] text-black hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center gap-2"
                    >
                      <span>VER PRODUTO</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleWhatsAppBuyDirect(asadOriginal, e)}
                      className="px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider bg-[#1d1c22] hover:bg-[#27252e] text-[#f2efe8] border border-[#33302a] hover:border-[#b99a62] transition-all flex items-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>COMPRAR NO WHATSAPP</span>
                    </button>

                    {onEditProduct && (
                      <button
                        onClick={() => onEditProduct(asadOriginal)}
                        className="px-5 py-3 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#1a191f] hover:bg-[#25232c] text-[#e8c882] border border-[#3b3427] hover:border-[#b99a62] transition-all flex items-center gap-2"
                        title="Editar foto, preço ou descrição de Asad"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>EDITAR PERFUME</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 4. CATÁLOGO COMPLETO — TODOS OS PERFUMES ÁRABES           */}
      {/* ========================================================= */}
      <section id="catalogo-arabes" className="py-14 sm:py-20 bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header do Catálogo */}
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#f2efe8] font-normal tracking-tight">
                CATÁLOGO DE PERFUMES ÁRABES
              </h2>
              <p className="text-xs sm:text-sm text-[#9c9384] mt-1">
                Catálogo oficial com autenticidade 100% garantida, frascos lacrados e fragrâncias exclusivas.
              </p>
            </div>
          </ScrollReveal>

          {/* Controls Bar: Tabs, Filters, Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#21201d]">
            {/* Gender Filters: TODOS, Masculinos, Femininos, Unisex */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'todos', label: 'TODOS' },
                { id: 'masculino', label: 'Masculinos' },
                { id: 'feminino', label: 'Femininos' },
                { id: 'unissex', label: 'Unisex' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGender(g.id as GenderOption)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    selectedGender === g.id
                      ? 'bg-[#ded7cc] text-[#141312] font-semibold'
                      : 'bg-[#18181c] text-[#9c9384] hover:text-[#ede7dc] border border-[#262420]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Brand Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9c9384]">Marca:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-[#1a191d] text-xs text-[#ede7dc] rounded-lg border border-[#33302a] px-3 py-2 focus:border-[#4d473d] focus:outline-none cursor-pointer"
              >
                <option value="todas">Todas as Marcas</option>
                {arabicBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count & Badges */}
          <div className="flex justify-between items-center mb-6 text-xs text-[#9c9384]">
            <p>
              Exibindo <span className="text-[#ede7dc] font-semibold">{processedProducts.length}</span> perfumes árabes
              {selectedBrand !== 'todas' && <span className="text-[#ded8cb]"> • {selectedBrand}</span>}
              {selectedGender !== 'todos' && <span className="text-[#ded8cb]"> • {selectedGender}</span>}
            </p>
            <div className="flex items-center gap-2 text-[#9c9384]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Selo de Autenticidade Garantida</span>
            </div>
          </div>

          {/* Catálogo Grid: 3 colunas desktop, 2 colunas mobile */}
          <ScrollReveal animation="fade-up" delay={120} duration={800}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {processedProducts.map((product, idx) => (
                <ProductCard
                  key={`${selectedGender}-${selectedBrand}-${product.id}`}
                  product={product}
                  index={idx}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                  onEditProduct={onEditProduct}
                />
              ))}
            </div>
          </ScrollReveal>

          {/* Empty State */}
          {processedProducts.length === 0 && (
            <div className="text-center py-16 px-4 rounded-xl border border-[#21201d] bg-[#121215]">
              <p className="text-base text-[#f2efe8] font-medium mb-1">Nenhum perfume encontrado com os filtros selecionados.</p>
              <p className="text-xs text-[#a5a5a5] mb-4">Tente selecionar outra marca ou gênero.</p>
              <button
                onClick={() => {
                  setSelectedGender('todos');
                  setSelectedBrand('todas');
                }}
                className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-[#b99a62] text-black"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SELOS DE CONFIANÇA E DIFERENCIAIS DA AR FRAGRANCE      */}
      {/* ========================================================= */}
      <section className="py-12 border-t border-[#1d1c1a] bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#111114] border border-[#22211e]">
              <ShieldCheck className="w-6 h-6 text-[#b99a62] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2efe8]">100% Originais</h4>
                <p className="text-[11px] text-[#a5a5a5] mt-0.5">Importação direta e lotes oficiais conferidos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#111114] border border-[#22211e]">
              <Award className="w-6 h-6 text-[#b99a62] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2efe8]">Frascos de Colecionador</h4>
                <p className="text-[11px] text-[#a5a5a5] mt-0.5">Embalagens pesadas e acabamentos imperiais.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#111114] border border-[#22211e]">
              <Flame className="w-6 h-6 text-[#b99a62] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2efe8]">Fixação Absoluta</h4>
                <p className="text-[11px] text-[#a5a5a5] mt-0.5">Concentrações potentes que duram o dia inteiro.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#111114] border border-[#22211e]">
              <CheckCircle2 className="w-6 h-6 text-[#b99a62] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2efe8]">Envio com Seguro</h4>
                <p className="text-[11px] text-[#a5a5a5] mt-0.5">Entrega rápida e rastreada para todo o Brasil.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. MODAL MOBILE DE FILTROS                                */}
      {/* ========================================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:hidden bg-black/80 backdrop-blur-sm">
          <div className="w-full bg-[#121215] border-t border-[#2d2a23] rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#262420] mb-5">
              <h3 className="text-base font-serif text-[#f2efe8]">Filtros do Catálogo Árabe</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-full bg-[#201f24] text-[#a5a5a5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categorias & Gênero */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b99a62] mb-3">
                Coleções & Gênero
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'todos', label: 'TODOS' },
                  { id: 'masculino', label: 'Masculinos' },
                  { id: 'feminino', label: 'Femininos' },
                  { id: 'unissex', label: 'Unisex' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id as GenderOption)}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-all ${
                      selectedGender === g.id
                        ? 'bg-[#b99a62] text-black border-[#b99a62] font-semibold'
                        : 'bg-[#1b1a1f] border-[#2c2923] text-[#a5a5a5]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b99a62] mb-3">
                Marca
              </p>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#1b1a1f] border border-[#2c2923] rounded-lg p-2.5 text-xs text-[#ede7dc] focus:outline-none focus:border-[#b99a62]"
              >
                <option value="todas">Todas as Marcas</option>
                {arabicBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#262420]">
              <button
                onClick={() => {
                  setSelectedGender('todos');
                  setSelectedBrand('todas');
                }}
                className="flex-1 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#1d1c22] text-[#a5a5a5] border border-[#2e2c26]"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#b99a62] text-black shadow-md"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
