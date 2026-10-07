import React, { useState, useEffect, useRef } from 'react';
import { Heart, Pencil } from 'lucide-react';
import { Product } from '../types/perfume';
import { getStorePaymentConfig } from '../config/paymentConfig';
import { getBrandConfig, getPerfumeTitleFontClass } from '../config/brandConfig';
import { LazyImage } from './LazyImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart?: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  priority?: boolean;
  index?: number;
  className?: string;
  variant?: 'default' | 'featured';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onEditProduct,
  priority = false,
  index,
  className = '',
  variant = 'default'
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [perfumeTitleFont, setPerfumeTitleFont] = useState(() => getBrandConfig().perfumeTitleFont || 'cormorant');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBrandUpdate = () => {
      setPerfumeTitleFont(getBrandConfig().perfumeTitleFont || 'cormorant');
    };
    window.addEventListener('brand_config_updated', handleBrandUpdate);
    return () => window.removeEventListener('brand_config_updated', handleBrandUpdate);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px -20px 0px'
      }
    );

    const currentEl = cardRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    // Safety fallback ensures cards appear even if scroll events are delayed
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 450);

    return () => {
      clearTimeout(timer);
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, [product.id]);

  const formatPrice = (value: number) => {
    if (!value || value <= 0) return 'Consulte o preço';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock === false) return;

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      const config = getStorePaymentConfig();
      const cleanPhone = (config.whatsappNumber || '5511987654321').replace(/\D/g, '') || '5511987654321';
      const message = `Olá, tenho interesse no perfume ${product.name}`;
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const staggerDelayMs = typeof index === 'number' ? Math.min(index % 8, 7) * 70 : 0;

  const isFeatured = variant === 'featured';

  return (
    <div
      ref={cardRef}
      style={{
        transitionDuration: '650ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${staggerDelayMs}ms`,
        willChange: 'opacity, transform'
      }}
      className={`h-full flex flex-col transition-all ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7 pointer-events-none'
      }`}
    >
      <div 
        onClick={() => {
          const isUnconfigured = (!product.name || !product.image || product.price <= 0) || product.id.startsWith('arabe-slot-');
          if (isUnconfigured && onEditProduct && (!product.name || !product.image || product.price <= 0)) {
            onEditProduct(product);
          } else {
            onSelectProduct(product);
          }
        }}
        className={`group relative flex flex-col cursor-pointer transition-all duration-500 ease-out h-full ${
          isFeatured
            ? 'bg-transparent border-0 shadow-none hover:-translate-y-2'
            : 'bg-[#131316] rounded-lg overflow-hidden border border-[#232220] hover:border-[#c5a880]/60 hover:scale-[1.02] shadow-md hover:shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(197,168,128,0.12)]'
        } ${className}`}
      >
      {/* Image Showcase Container */}
      <div 
        className={`relative w-full flex items-center justify-center transition-all duration-500 ${
          isFeatured 
            ? 'h-80 sm:h-96 md:h-[430px] bg-transparent p-3 sm:p-5 overflow-visible' 
            : 'aspect-square bg-gradient-to-b from-[#17171a] via-[#141417] to-[#111114] p-5 overflow-hidden border-b border-[#21201d]'
        }`}
        onMouseEnter={() => product.images && product.images.length > 1 && setActiveImageIndex(1)}
        onMouseLeave={() => setActiveImageIndex(0)}
      >
        {/* Bottle shadow */}
        {isFeatured ? (
          <div className="absolute bottom-4 w-3/4 max-w-[200px] h-4 rounded-full bg-black/75 blur-md pointer-events-none transform transition-transform duration-500 group-hover:scale-95" />
        ) : (
          <div className="absolute bottom-3 w-28 h-2.5 bg-black/60 rounded-full blur-sm pointer-events-none" />
        )}

        {/* Perfume Flacon Image OR Placeholder for empty customizable slots */}
        {(() => {
          const cardImg = (product.image && product.image.trim() !== '')
            ? product.image.trim()
            : (product.images && product.images[activeImageIndex] && product.images[activeImageIndex].trim() !== '')
              ? product.images[activeImageIndex].trim()
              : (product.images && product.images[0] && product.images[0].trim() !== '')
                ? product.images[0].trim()
                : null;

          return cardImg ? (
            <LazyImage
              key={`${product.id}-${cardImg}`}
              src={cardImg}
              alt={`${product.brand || ''} ${product.name || 'Perfume'}`}
              priority={priority}
              className={`object-contain object-center transition-all duration-700 ease-out ${
                isFeatured
                  ? 'max-h-72 sm:max-h-84 md:max-h-96 w-auto drop-shadow-[0_22px_35px_rgba(0,0,0,0.92)] group-hover:scale-110 group-hover:-translate-y-1'
                  : 'max-h-[78%] max-w-[76%] w-auto h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.8)] group-hover:scale-105'
              }`}
            />
          ) : (
            <div 
              onClick={(e) => {
                if (onEditProduct) {
                  e.stopPropagation();
                  onEditProduct(product);
                }
              }}
              className="w-full h-full flex flex-col items-center justify-center p-3 text-center border-2 border-dashed border-[#b99a62]/35 hover:border-[#b99a62] rounded-lg transition-all duration-300 bg-[#161619]/60 hover:bg-[#1d1c22] group/slot cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-[#1e1d23] border border-[#b99a62]/50 flex items-center justify-center text-[#e8c882] mb-2 group-hover/slot:scale-110 group-hover/slot:bg-[#b99a62] group-hover/slot:text-black transition-all shadow-md">
                <Pencil className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#f2efe8] group-hover/slot:text-[#e8c882] transition-colors">
                Adicionar Perfume
              </span>
              <span className="text-[10px] text-[#8e877c] mt-0.5 leading-tight">
                Clique para cadastrar foto, nome e preço
              </span>
            </div>
          );
        })()}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.brand && product.brand.trim() !== '' && (
            <span className="bg-[#1b1915]/90 backdrop-blur-sm border border-[#b99a62]/80 text-[#f2efe8] text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider uppercase shadow">
              {product.brand}
            </span>
          )}
          {discountPercentage && (
            <span className="bg-[#b93838] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow">
              -{discountPercentage}%
            </span>
          )}
          {product.badge ? (
            <span className="bg-[#b99a62] text-black text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-sm">
              {product.badge}
            </span>
          ) : (
            <>
              {product.isNew && (
                <span className="bg-[#c5a880] text-black text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow">
                  Novo
                </span>
              )}
              {product.isBestSeller && !discountPercentage && (
                <span className="bg-[#1e1d1a]/90 backdrop-blur-sm border border-[#c5a880]/50 text-[#e8c882] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
                  Best Seller
                </span>
              )}
            </>
          )}
        </div>

        {/* Actions (Edit Button + Wishlist) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {onEditProduct && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct(product);
              }}
              title={`Editar foto, valor e descrição de ${product.name || 'este perfume'}`}
              aria-label={`Editar ${product.name || 'este perfume'}`}
              className="p-2 rounded-full backdrop-blur-md transition-all bg-[#121214]/85 text-[#d4cdbf] hover:text-[#e8c882] hover:bg-[#1f1e26] border border-[#2e2a22] shadow cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            title={isWishlisted ? 'Remover dos favoritos' : 'Adicionar à wishlist'}
            aria-label={isWishlisted ? 'Remover dos favoritos' : 'Adicionar à wishlist'}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isWishlisted 
                ? 'bg-[#ded7cc] text-[#141312] shadow-md' 
                : 'bg-[#121214]/80 text-[#d4cdbf] hover:text-white hover:bg-[#121214] border border-[#2b2a26]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick Size options badge */}
        {product.isDecant && (
          <div className="absolute bottom-2 left-2.5 z-10">
            <span className="text-[10px] bg-black/70 backdrop-blur-sm text-[#e8c882] px-2 py-0.5 rounded border border-[#c5a880]/30 font-medium">
              Opções 2ml · 5ml · 10ml
            </span>
          </div>
        )}
      </div>

      {/* Info Container with strictly standardized grid & vertical hierarchy */}
      <div className={`p-4 sm:p-5 flex-1 flex flex-col justify-between ${
        isFeatured 
          ? 'bg-transparent' 
          : 'bg-gradient-to-b from-[#131316] to-[#101012]'
      }`}>
        <div>
          {/* Top Specification: Concentração & Gênero */}
          <div className="flex items-center justify-between text-[11px] text-[#9c9384] uppercase tracking-wider mb-1.5">
            <span className="font-medium text-[#ded8cb] truncate max-w-[65%]">
              {product.concentration || product.type || 'Eau de Parfum'}
            </span>
            <span className="text-[#bfa98e] font-medium capitalize shrink-0">
              {product.gender === 'masculino' ? 'Masculino' : product.gender === 'feminino' ? 'Feminino' : 'Unissex'}
            </span>
          </div>

          {/* Nome do Perfume: Uniform height h-7 truncate */}
          <h3 className={`${getPerfumeTitleFontClass(perfumeTitleFont)} text-[#faf7f2] group-hover:text-[#ded8cb] transition-colors truncate mb-1.5 ${
            isFeatured ? 'text-lg sm:text-2xl font-normal' : 'text-[15px] sm:text-[17px]'
          }`}>
            {product.name && product.name.trim() !== '' ? product.name : 'Perfume Exclusivo'}
          </h3>

          {/* Descrição do Perfume */}
          <p className="text-xs text-[#a8a39a] leading-relaxed line-clamp-2 mb-3 h-9 overflow-hidden">
            {product.description && product.description.trim() !== ''
              ? product.description
              : 'Fragrância exclusiva com fixação duradoura e matérias-primas nobres selecionadas.'}
          </p>

          {/* Avaliação & Total de Avaliações */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-semibold text-[#ded8cb]">
              Nota {(product.rating || 5).toFixed(1)}
            </span>
            <span className="text-[11px] text-[#787163]">
              ({product.reviewsCount || 0} avaliações)
            </span>
          </div>
        </div>

        {/* Pricing Block with Standardized Vertical Baseline */}
        <div className={`pt-3 border-t mt-auto ${isFeatured ? 'border-[#262420]' : 'border-[#21201e]'}`}>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-lg sm:text-xl font-semibold text-[#f7f2ea]">
                {product.price > 0 ? formatPrice(product.price) : 'Preço a definir'}
              </div>
              {product.originalPrice && product.originalPrice > product.price && product.price > 0 && (
                <span className="text-xs text-[#787163] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#a5a5a5] uppercase tracking-wider">
              {product.price > 0 ? '10x sem juros' : 'Sob consulta'}
            </span>
          </div>

          {/* Standardized Button Action Bar */}
          {product.inStock === false ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider bg-[#1c1b1e] text-[#6b655b] border border-[#2e2a25] cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Esgotado</span>
            </button>
          ) : (!product.name || !product.image || product.price <= 0) ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEditProduct) onEditProduct(product);
              }}
              title="Configurar este perfume (foto, nome e valor)"
              className="w-full py-2.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 bg-[#1f1e24] hover:bg-[#2a2833] text-[#e8c882] border border-[#3d372b] hover:border-[#b99a62] shadow cursor-pointer group-hover:border-[#b99a62]"
            >
              <Pencil className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Editar Perfume</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBuy}
                title={`Comprar ${product.name}`}
                className="py-2.5 px-3 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#ded7cc] hover:bg-[#eae5dd] text-[#141312] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Comprar</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(product);
                }}
                title={`Ver detalhes de ${product.name}`}
                className="py-2.5 px-3 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#161518] text-[#ded8cb] hover:bg-[#201f24] hover:text-white border border-[#2b2a26] hover:border-[#4d483e] transition-all text-center cursor-pointer"
              >
                <span>Detalhes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};
