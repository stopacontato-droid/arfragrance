import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Award, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Product } from '../types/perfume';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';

interface Lab8PageProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

type GenderOption = 'todos' | 'masculino' | 'feminino' | 'unissex';

export const Lab8Page: React.FC<Lab8PageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onEditProduct
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderOption>('todos');

  // Filter only lab8 category
  const lab8Products = useMemo(() => {
    return products.filter((p) => p.category === 'lab8');
  }, [products]);

  // Apply gender filtering
  const processedProducts = useMemo(() => {
    return lab8Products.filter((item) => {
      if (selectedGender === 'masculino' && item.gender !== 'masculino') return false;
      if (selectedGender === 'feminino' && item.gender !== 'feminino') return false;
      if (selectedGender === 'unissex' && item.gender !== 'unissex') return false;
      return true;
    });
  }, [lab8Products, selectedGender]);

  return (
    <div className="bg-[#0b0b0d] min-h-screen text-[#ede7dc] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* HERO BANNER LAB8 • NOVIDADE EXCLUSIVA                     */}
        {/* ========================================================= */}
        <ScrollReveal animation="fade-up" duration={750}>
          <div className="relative rounded-2xl overflow-hidden border border-[#2b2720] bg-gradient-to-r from-[#141316] via-[#19171d] to-[#121115] p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_right,rgba(197,168,128,0.12)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="max-w-3xl relative z-10">
              {/* Pill Novidade */}
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/40 text-[#dfc5a0] text-[11px] font-semibold tracking-widest uppercase mb-4 shadow-sm">
                <span>NOVIDADE EXCLUSIVA • LANÇAMENTO OFICIAL</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#faf7f2] font-normal tracking-tight mb-4">
                Lab8 Fragrance
              </h1>

              <p className="text-sm sm:text-base text-[#b8b0a1] font-light leading-relaxed mb-6 max-w-2xl">
                A alta perfumaria autoral com concentração <strong className="text-[#ede7dc] font-medium">Extrait de Parfum (35% de essência pura)</strong>. Matérias-primas raras importadas de Grasse com performance hipnótica de até 16 horas na pele.
              </p>

              {/* Destaques Técnicos da Linha */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#262420]">
                <div className="flex items-center gap-2 text-xs text-[#ded8cb]">
                  <FlaskConical className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>35% de Essência</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#ded8cb]">
                  <Clock className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Fixação 14h a 16h</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#ded8cb]">
                  <ShieldCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Lote Lacrado</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#ded8cb]">
                  <Award className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Alta Concentração</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ========================================================= */}
        {/* CATÁLOGO DOS CARDS LAB8                                   */}
        {/* ========================================================= */}
        <section id="catalogo-lab8">
          <ScrollReveal animation="fade-up" delay={60} duration={650}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#21201d]">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#faf7f2] font-normal tracking-wide">
                  Coleção Lab8 Extrait de Parfum
                </h2>
                <p className="text-xs text-[#9c9384] mt-1">
                  Criações consagradas prontas para entrega imediata em embalagem premium.
                </p>
              </div>

              {/* Filtros de Gênero */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'todos', label: 'TODOS' },
                  { id: 'unissex', label: 'Unissex' },
                  { id: 'masculino', label: 'Masculinos' },
                  { id: 'feminino', label: 'Femininos' }
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
            </div>
          </ScrollReveal>

          {/* GRID DOS CARDS (2 colunas mobile, 3 tablet, 5 colunas desktop) */}
          <ScrollReveal animation="fade-up" delay={120} duration={800}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {processedProducts.map((product, idx) => (
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

          {/* Banner de Garantia Lab8 */}
          <div className="mt-14 p-6 sm:p-8 rounded-xl bg-[#121215] border border-[#24221d] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center shrink-0 text-[#c5a880]">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif text-[#faf7f2]">Garantia de Satisfação Lab8</h3>
                <p className="text-xs sm:text-sm text-[#9c9384] mt-0.5">
                  Frascos originais lacrados de fábrica com borrifador de alta nebulização e selo de autenticidade AR Fragrance.
                </p>
              </div>
            </div>

            <div className="text-xs text-[#b8b0a1] flex items-center gap-2 whitespace-nowrap">
              <span>Parcelamento em até 10x sem juros • 5% OFF no PIX</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
