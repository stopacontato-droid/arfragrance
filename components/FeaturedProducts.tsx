import React, { useState, useMemo } from 'react';
import { Product } from '../types/perfume';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';

interface FeaturedProductsProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onEditProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category
      if (selectedCategory !== 'todos' && item.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [products, selectedCategory]);

  return (
    <section className="py-14 sm:py-20 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#21201e] gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#9c9384] font-medium block mb-2">
                Seleção de Assinatura
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#faf7f2] font-normal tracking-tight">
                Produtos em Destaque
              </h2>
            </div>

            {/* Quick Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'brands', label: 'Brands (100ml)' },
                { id: 'importados', label: 'Importados' },
                { id: 'arabes', label: 'Árabes' },
                { id: 'lab8', label: 'Lab8 (Novidade)' }
              ].map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                      active 
                        ? 'bg-[#ded7cc] text-[#141312] font-semibold' 
                        : 'bg-[#151417] text-[#9c9384] hover:text-white border border-[#262420]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Product Count & Status */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#9c9384]">
          <span>
            Mostrando <strong className="text-[#ede7dc]">{filteredProducts.length}</strong> perfumes em destaque
          </span>
        </div>

        {/* Products Grid: Large prominent cards without boxy background */}
        {filteredProducts.length > 0 ? (
          <ScrollReveal animation="fade-up" delay={100} duration={800}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-14">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={`${selectedCategory}-${product.id}`}
                  product={product}
                  index={idx}
                  variant="featured"
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
          <div className="text-center py-20 bg-[#121215] rounded-xl border border-[#262422] p-8">
            <h3 className="text-lg font-serif text-[#faf7f2] mb-2">
              Nenhuma fragrância encontrada nesta categoria
            </h3>
            <p className="text-sm text-[#9c9384] mb-6 max-w-md mx-auto">
              Selecione outra categoria ou veja todos os nossos produtos.
            </p>
            <button
              onClick={() => setSelectedCategory('todos')}
              className="px-6 py-2.5 bg-[#c5a880] text-black font-semibold text-xs uppercase tracking-wider rounded cursor-pointer"
            >
              Ver todos os perfumes
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
