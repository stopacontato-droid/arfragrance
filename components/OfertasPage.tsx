import React, { useMemo } from 'react';
import { Product } from '../types/perfume';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { getStorePaymentConfig } from '../config/paymentConfig';
import { ArrowRight, Tag } from 'lucide-react';

interface OfertasPageProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const OfertasPage: React.FC<OfertasPageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onEditProduct
}) => {
  // Store payment config & WhatsApp link
  const paymentConfig = getStorePaymentConfig();
  const rawPhone = paymentConfig.whatsappNumber || '5511987654321';
  const cleanPhone = rawPhone.replace(/\D/g, '') || '5511987654321';
  const whatsappPromoMsg = encodeURIComponent(
    'Olá Gabriel! Vi o banner da Promoção Relâmpago (Unknown, Perseus e Galactic Men por R$ 199,90) e gostaria de garantir o meu!'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappPromoMsg}`;

  // Filter products with originalPrice or special offer
  const promotionalProducts = useMemo(() => {
    return products.filter((p) => Boolean(p.originalPrice && p.originalPrice > p.price) || p.isSpecialOffer);
  }, [products]);

  return (
    <div className="bg-[#0b0b0d] min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* 1. BANNER PROMOÇÃO RELÂMPAGO (MINIMALISTA & CLEAN)        */}
        {/* ========================================================= */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="mb-14 flex flex-col items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Clique para pedir pelo WhatsApp"
              className="block group relative max-w-2xl w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#2b2720] hover:border-[#c5a880] transition-all duration-300 shadow-2xl bg-[#09090b] cursor-pointer"
            >
              {/* Imagem Completa e Amostra dos 3 Perfumes sem nenhum elemento cobrindo */}
              <img
                src="/banner-promocao-relampago.jpg"
                alt="AR Fragrance - Promoção Relâmpago: Unknown, Perseus e Galactic Men por R$ 199,90"
                className="w-full h-auto object-contain block transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </a>

            {/* Indicação Minimalista e Discreta */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 inline-flex items-center gap-2 text-xs text-[#a89f91] hover:text-[#25d366] transition-colors cursor-pointer group"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25d366]" />
              <span className="font-medium tracking-wide">
                Toque na imagem para garantir o seu no WhatsApp (R$ 199,90 cada)
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </ScrollReveal>

        {/* ========================================================= */}
        {/* 2. CATÁLOGO GERAL DE OFERTAS & PREÇOS ESPECIAIS           */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#21201d]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1a17] border border-[#c5a880]/30 text-xs font-semibold text-[#e8c882] uppercase tracking-wider mb-2">
              <Tag className="w-3 h-3 text-[#c5a880]" />
              <span>Seleção Promocional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#faf7f2] font-normal tracking-tight">
              Mais Ofertas & Preços Especiais
            </h2>
            <p className="text-xs sm:text-sm text-[#9c9384] mt-1">
              Fragrâncias exclusivas com desconto especial e 5% OFF adicional no PIX.
            </p>
          </div>
          <div className="hidden sm:block text-right text-xs text-[#8e8577]">
            <span>{promotionalProducts.length} fragrâncias em oferta</span>
          </div>
        </div>

        {/* Results Grid */}
        <ScrollReveal animation="fade-up" delay={120} duration={800}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {promotionalProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
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

      </div>
    </div>
  );
};
