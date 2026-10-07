import React, { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Product } from '../types/perfume';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';

interface ImportadosPageProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

type SortOption = 'mais-procurados' | 'menor-preco' | 'maior-preco' | 'a-z';

export const ImportadosPage: React.FC<ImportadosPageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onEditProduct
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('mais-procurados');

  // Filter only importados
  const importados = useMemo(() => {
    return products.filter((p) => p.category === 'importados');
  }, [products]);

  // Apply sorting
  const processedProducts = useMemo(() => {
    const list = [...importados];
    return list.sort((a, b) => {
      switch (sortBy) {
        case 'menor-preco':
          return a.price - b.price;
        case 'maior-preco':
          return b.price - a.price;
        case 'a-z':
          return a.name.localeCompare(b.name, 'pt-BR');
        case 'mais-procurados':
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      }
    });
  }, [importados, sortBy]);

  return (
    <div className="bg-[#0b0b0d] min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="relative rounded-xl overflow-hidden border border-[#262420] p-6 sm:p-10 mb-8 bg-[#121214]">
            <div className="max-w-2xl relative z-10">
              <p className="text-xs uppercase tracking-widest text-[#9c9384] font-medium mb-3">
                Selo ADIPEC · 100% Originais
              </p>
              <h1 className="text-3xl sm:text-5xl font-serif text-[#faf7f2] font-normal tracking-tight mb-3">
                Perfumes Importados
              </h1>
              <p className="text-sm sm:text-base text-[#b8b0a1] font-light leading-relaxed">
                Uma curadoria de fragrâncias de assinatura para quem procura elegância atemporal e fixação duradoura com lote auditado.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* MAIN CONTENT AREA: Full Width Grid without Sidebar Filter */}
        <main className="w-full">
          
          {/* Top Control Bar: Sorting & Counts */}
          <ScrollReveal animation="fade-up" delay={60} duration={650}>
            <div className="bg-[#121216] border border-[#262422] rounded-xl p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#9c9384]">
                Exibindo <span className="text-[#ede7dc] font-semibold">{processedProducts.length}</span> {processedProducts.length === 1 ? 'perfume importado' : 'perfumes importados'}
              </p>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                <span className="text-xs text-[#9c9384] hidden sm:inline">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-[#1a191d] text-xs text-[#ede7dc] rounded-md border border-[#33302a] px-3 py-2 focus:border-[#c5a880] focus:outline-none cursor-pointer"
                >
                  <option value="mais-procurados">Mais procurados</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                  <option value="a-z">Nome (A–Z)</option>
                </select>
              </div>
            </div>
          </ScrollReveal>

          {/* PRODUCT GRID - Clean 4 columns layout on large screens */}
          {processedProducts.length > 0 ? (
            <ScrollReveal animation="fade-up" delay={120} duration={800}>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {processedProducts.map((product, idx) => (
                  <ProductCard
                    key={`${sortBy}-${product.id}`}
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
          ) : (
            /* EMPTY STATE */
            <div className="bg-[#121216] border border-[#262422] rounded-2xl p-10 sm:p-14 text-center my-6">
              <h3 className="text-lg font-serif text-[#faf7f2] font-normal mb-2">
                Nenhum perfume encontrado
              </h3>
              <p className="text-xs sm:text-sm text-[#9c9384] max-w-md mx-auto mb-6">
                Não há perfumes importados cadastrados no catálogo no momento.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
