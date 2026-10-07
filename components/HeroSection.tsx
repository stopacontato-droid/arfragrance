import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Zap, 
  Tag, 
  Layers,
  Pencil
} from 'lucide-react';
import { PageView } from '../types/perfume';
import { getBannersConfig } from '../config/bannersConfig';

interface HeroSectionProps {
  onNavigate: (page: PageView) => void;
  onEditSlide?: (slideId: string, title: string, currentImg: string) => void;
}

interface PromoSlide {
  id: string;
  badge: string;
  badgeIcon?: React.ReactNode;
  tagline: string;
  title: string;
  highlightText: string;
  description: string;
  primaryButtonText: string;
  targetPage: PageView;
  tagOffer: string;
  backgroundImage: string;
  productImage: string;
  productAlt: string;
  discountBadge?: string;
  accentColor: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-arabes',
    badge: 'FESTIVAL DO ORIENTE • ATÉ 25% OFF',
    tagline: 'Fixação de Alta Performance',
    title: 'Perfumes Árabes Nobres',
    highlightText: '& Marcantes',
    description: 'Lattafa Asad, Khamrah e Club de Nuit com projeção incomparável. 5% OFF no PIX com autenticidade garantida.',
    primaryButtonText: 'Aproveitar Ofertas Árabes',
    targetPage: 'arabes',
    tagOffer: '5% OFF extra no PIX • Despacho Seguro',
    backgroundImage: '/products/arabes-collection-hero.jpg',
    productImage: '/products/lattafa-asad.png',
    productAlt: 'Perfume Árabe Lattafa Asad',
    discountBadge: 'ATÉ 25% OFF',
    accentColor: '#c5a880'
  },
  {
    id: 'promo-importados',
    badge: 'BEST-SELLERS MUNDIAIS • SELO ADIPEC',
    tagline: 'Frascos 100% Lacrados',
    title: 'Importados Mais Desejados',
    highlightText: 'do Mundo',
    description: 'Invictus, 212 VIP Men, Good Girl, Acqua Di Giò e Ferrari Black. Parcele suas fragrâncias de assinatura em até 10x sem juros.',
    primaryButtonText: 'Explorar Importados',
    targetPage: 'importados',
    tagOffer: '100% Selo ADIPEC • Até 10x Sem Juros',
    backgroundImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1600&q=80',
    productImage: '/products/invictus-nobg.png',
    productAlt: 'Perfume Importado Paco Rabanne Invictus',
    discountBadge: '10X SEM JUROS',
    accentColor: '#d4af37'
  },
  {
    id: 'promo-lab8',
    badge: 'LANÇAMENTO EXCLUSIVO • NOVIDADE',
    tagline: 'Extrait de Parfum (35% Essência)',
    title: 'Lab8 Alta Perfumaria',
    highlightText: 'Autoral',
    description: 'Criações exclusivas com matérias-primas de Grasse e fixação de até 16h na pele. Rouge Absolu, Noir Intense, Vanilla Smoke e Blanc Imperial.',
    primaryButtonText: 'Conhecer Coleção Lab8',
    targetPage: 'lab8',
    tagOffer: '35% de Concentração • Até 10x Sem Juros',
    backgroundImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=80',
    productImage: '/products/lab8-rouge-absolu.jpg',
    productAlt: 'Perfume Lab8 Rouge Absolu Extrait de Parfum',
    discountBadge: 'NOVIDADE',
    accentColor: '#c5a880'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onEditSlide }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [banners, setBanners] = useState(() => getBannersConfig());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setBanners(getBannersConfig());
    };
    window.addEventListener('arfragrance_banners_updated', handleUpdate);
    return () => window.removeEventListener('arfragrance_banners_updated', handleUpdate);
  }, []);

  // Handle slide change
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? PROMO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
  }, []);

  // Standard carousel rotation every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, handleNextSlide]);

  // Canvas Golden Mist / Particles Animation (60FPS luxury perfume vapor & embers)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating golden dust and perfume mist particles
    const particleCount = 36;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.65 - 0.25, // drifts upwards
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.4 + 0.2,
      pulseSpeed: Math.random() * 0.025 + 0.01,
      angle: Math.random() * Math.PI * 2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.angle) * 0.2;
        p.y += p.vy;
        p.angle += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.angle) * 0.15;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw soft glowing gold bokeh particle
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
        gradient.addColorStop(0, `rgba(245, 230, 195, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(212, 175, 55, ${p.alpha * 0.65})`);
        gradient.addColorStop(1, 'rgba(197, 168, 128, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNextSlide();
    } else if (diff < -45) {
      handlePrevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      aria-label="Apresentação e Promoções"
      className="relative bg-[#09090b] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* COMPACT HERO CAROUSEL CONTAINER */}
      <div className="relative overflow-hidden h-[390px] sm:h-[420px] md:h-[450px] lg:h-[460px] w-full bg-[#0a0a0c]">
        {/* SLIDES WITH GENTLE PHOTOGRAPHIC DEPTH */}
        {PROMO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const slideProductImage = banners.heroSlides[slide.id]?.productImage || slide.productImage;
          const slideBgImage = banners.heroSlides[slide.id]?.backgroundImage || slide.backgroundImage;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background photography */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {slideBgImage ? (
                  <img
                    src={slideBgImage}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center opacity-25"
                  />
                ) : null}
                
                {/* Natural dark gradient vignettes */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/85 to-[#0a0a0c]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/40" />
              </div>

              {/* Slide Content */}
              <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full pb-10 pt-4">
                  
                  {/* LEFT COLUMN: Promotional Texts & Call to Action (Col 7) */}
                  <div className="md:col-span-8 lg:col-span-7 flex flex-col justify-center max-w-2xl">
                    {/* Delicate brand signature & badge with font-brittany */}
                    <div className="flex items-center gap-2.5 mb-2 sm:mb-2.5">
                      <span className="font-brittany font-light text-2xl sm:text-[28px] text-[#f7efe5] tracking-normal leading-none select-none">
                        AR Fragrance
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#a8a194] font-medium pl-2.5 border-l border-[#3a352c]">
                        {slide.badge}
                      </span>
                    </div>

                    {/* Headline with delicate cursive highlight */}
                    <h1 className="text-2xl sm:text-4xl lg:text-[40px] text-[#faf7f2] font-normal leading-[1.14] tracking-tight mb-2 sm:mb-2.5">
                      {slide.title}{' '}
                      <span className="font-brittany font-light text-[#f0dfce] text-3xl sm:text-[42px] lg:text-[46px] block sm:inline tracking-normal ml-0.5">
                        {slide.highlightText}
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm text-[#b8b1a3] font-light leading-relaxed mb-4 sm:mb-5 line-clamp-2 max-w-xl">
                      {slide.description}
                    </p>

                    {/* Action Buttons & Value Tag */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => onNavigate(slide.targetPage)}
                        className="px-6 py-2.5 sm:py-3 bg-[#ded7cc] hover:bg-[#eae5dd] text-[#141312] font-semibold text-xs uppercase tracking-wider rounded-md transition-all shadow-sm flex items-center gap-2 group cursor-pointer"
                      >
                        <span>{slide.primaryButtonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#ded8cb] font-normal bg-[#141416] px-3 py-2 rounded-md border border-[#282622]">
                        <Tag className="w-3 h-3 text-[#9c9384]" />
                        <span>{slide.tagOffer}</span>
                      </div>

                      {onEditSlide && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditSlide(slide.id, slide.title, slideProductImage);
                          }}
                          className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#17161b] hover:bg-[#201f26] text-[11px] text-[#ded8cb] border border-[#33302a] cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 text-[#e8c882]" />
                          <span>Editar Imagem</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Flacon with Natural Ground Shadow & Edit Button */}
                  <div className="hidden md:flex md:col-span-4 lg:col-span-5 justify-center items-center relative">
                    <div className="relative w-56 lg:w-68 h-56 lg:h-68 flex items-center justify-center">
                      {/* Product Bottle Showcase */}
                      <div className="relative z-10 flex flex-col items-center">
                        {slideProductImage ? (
                          <img
                            src={slideProductImage}
                            alt={slide.productAlt}
                            className="max-h-52 lg:max-h-60 w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:scale-105"
                          />
                        ) : null}

                        {onEditSlide && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditSlide(slide.id, slide.title, slideProductImage);
                            }}
                            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 hover:bg-[#c5a880] text-[#ded8cb] hover:text-black border border-white/20 text-[11px] font-medium backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105"
                            title="Editar imagem deste produto no banner"
                          >
                            <Pencil className="w-3 h-3 text-[#e8c882]" />
                            <span>Editar Imagem do Banner</span>
                          </button>
                        )}
                      </div>

                      {/* Soft Shadow Underneath */}
                      <div className="absolute bottom-2 w-36 h-3 rounded-full bg-black/60 blur-md pointer-events-none" />

                      {/* Floating Discount Tag */}
                      {slide.discountBadge && (
                        <div className="absolute -top-1 -right-2 z-20 bg-gradient-to-br from-[#c5a880] to-[#9c7f53] text-black font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-[#f3e5c9]/40 flex items-center gap-1 animate-pulse">
                          <span>{slide.discountBadge}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* SIDE CONTROLS: Subtle Previous / Next Carousel Arrows */}
        <button
          onClick={handlePrevSlide}
          aria-label="Promoção anterior"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-25 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-[#ede7dc] hover:text-white border border-white/10 hover:border-white/30 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNextSlide}
          aria-label="Próxima promoção"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-25 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-[#ede7dc] hover:text-white border border-white/10 hover:border-white/30 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* BOLINHAS EMBAIXO: As 3 bolinhas de navegação do carrossel */}
        <div 
          role="tablist"
          aria-label="Indicadores das 3 Promoções"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-25 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#2b2823]"
        >
          {PROMO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={`bullet-${slide.id}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Ir para promoção ${idx + 1}: ${slide.title}`}
                aria-selected={isActive}
                role="tab"
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-7 h-2 bg-[#ded7cc]'
                    : 'w-2 h-2 bg-white/35 hover:bg-white/75'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* COMPACT TRUST BAR: Single slim line right below the carousel banner */}
      <div className="bg-[#0e0e11] border-y border-[#1e1c19] py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-y-2 gap-x-6 text-[11px] sm:text-xs text-[#b8b0a1]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#9c9384]" />
            <span><strong className="text-[#faf7f2]">100% Originais</strong> Lotes Lacrados com Selo ADIPEC</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#9c9384]" />
            <span><strong className="text-[#faf7f2]">Alta Fixação</strong> & Projeção Intensa</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#9c9384]" />
            <span><strong className="text-[#faf7f2]">Envio Rápido</strong> Despacho em até 24h</span>
          </div>
        </div>
      </div>
    </section>
  );
};
