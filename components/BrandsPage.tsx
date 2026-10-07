import React, { useState, useMemo } from 'react';
import { Sparkles, ShieldCheck, Tag, ArrowUpDown, Flame, CheckCircle2 } from 'lucide-react';
import { Product } from '../types/perfume';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';

interface BrandsPageProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

type GenderFilter = 'todos' | 'masculino' | 'feminino';
type SortOption = 'destaques' | 'a-z' | 'menor-preco' | 'maior-preco';

export const BrandsPage: React.FC<BrandsPageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onEditProduct
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderFilter>('todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<SortOption>('destaques');

  // Filter only Brands perfumes
  const brandsProducts = useMemo(() => {
    return products.filter((p) => p.category === 'brands');
  }, [products]);

  // Unique brands
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    brandsProducts.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [brandsProducts]);

  // Counts
  const countMasculinos = useMemo(() => {
    return brandsProducts.filter(p => p.gender === 'masculino').length;
  }, [brandsProducts]);

  const countFemininos = useMemo(() => {
    return brandsProducts.filter(p => p.gender === 'feminino').length;
  }, [brandsProducts]);

  // Filtered & sorted products
  const processedProducts = useMemo(() => {
    let list = brandsProducts.filter(p => {
      const matchGender = selectedGender === 'todos' || p.gender === selectedGender;
      const matchBrand = selectedBrand === 'todas' || p.brand === selectedBrand;
      return matchGender && matchBrand;
    });

    return list.sort((a, b) => {
      switch (sortBy) {
        case 'a-z':
          return a.name.localeCompare(b.name, 'pt-BR');
        case 'menor-preco':
          return a.price - b.price;
        case 'maior-preco':
          return b.price - a.price;
        case 'destaques':
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      }
    });
  }, [brandsProducts, selectedGender, selectedBrand, sortBy]);

  return (
    <div className="bg-[#0b0b0d] min-h-screen text-[#f0ede6] pb-24">
      {/* Luxury Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#141418] via-[#0f0f13] to-[#0b0b0d] border-b border-[#242220] py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(197,168,128,0.12),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <ScrollReveal animation="fade-up" duration={750}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1c18] border border-[#c5a880]/30 text-[#e8c882] text-xs uppercase tracking-widest font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coleção Selecionada • 100ml</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-[#faf7f2] font-normal tracking-tight mb-4">
              Brand Collection
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#b0a799] font-light leading-relaxed mb-6">
              Os ícones mais desejados da alta perfumaria mundial em frascos de <span className="text-[#faf7f2] font-medium">100ml</span>. Autenticidade rigorosa garantida, com valor especial de <span className="text-[#e8c882] font-semibold">R$ 289,90</span> e 5% OFF extra via PIX.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#ded8cb]">
              <div className="flex items-center gap-1.5 bg-[#17161b] px-3 py-1.5 rounded-lg border border-[#2b2a2e]">
                <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                <span>100% Selo de Autenticidade</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#17161b] px-3 py-1.5 rounded-lg border border-[#2b2a2e]">
                <Tag className="w-4 h-4 text-[#e8c882]" />
                <span>Frascos Lacrados 100ml</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#17161b] px-3 py-1.5 rounded-lg border border-[#2b2a2e]">
                <CheckCircle2 className="w-4 h-4 text-[#7cd08a]" />
                <span>Pronta Entrega com Envio Imediato</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Gender Navigation Tabs */}
        <ScrollReveal animation="fade-up" delay={60} duration={700}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#21201d]">
            {/* Gender Pills */}
            <div className="flex items-center gap-2 p-1 bg-[#141418] rounded-xl border border-[#262420]">
              <button
                onClick={() => setSelectedGender('todos')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedGender === 'todos'
                    ? 'bg-[#c5a880] text-black shadow-md'
                    : 'text-[#a8a194] hover:text-white'
                }`}
              >
                Todos ({brandsProducts.length})
              </button>
              <button
                onClick={() => setSelectedGender('masculino')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedGender === 'masculino'
                    ? 'bg-[#c5a880] text-black shadow-md'
                    : 'text-[#a8a194] hover:text-white'
                }`}
              >
                <span>Masculinos 100ml</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedGender === 'masculino' ? 'bg-black/20 text-black' : 'bg-[#212026] text-[#c5a880]'
                }`}>
                  {countMasculinos}
                </span>
              </button>
              <button
                onClick={() => setSelectedGender('feminino')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedGender === 'feminino'
                    ? 'bg-[#c5a880] text-black shadow-md'
                    : 'text-[#a8a194] hover:text-white'
                }`}
              >
                <span>Femininos 100ml</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedGender === 'feminino' ? 'bg-black/20 text-black' : 'bg-[#212026] text-[#c5a880]'
                }`}>
                  {countFemininos}
                </span>
              </button>
            </div>

            {/* Right Controls: Brand Filter & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Brand Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="brand-filter" className="text-xs text-[#9c9384] hidden sm:inline">
                  Marca:
                </label>
                <select
                  id="brand-filter"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-[#141418] border border-[#2d2b27] text-xs text-[#ded8cb] rounded-lg px-3 py-2 focus:border-[#c5a880] focus:outline-none cursor-pointer"
                >
                  <option value="todas">Todas as Marcas</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-brands" className="text-xs text-[#9c9384] hidden sm:inline">
                  Ordenar:
                </label>
                <div className="relative">
                  <select
                    id="sort-brands"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-[#141418] border border-[#2d2b27] text-xs text-[#ded8cb] rounded-lg px-3 py-2 pr-7 focus:border-[#c5a880] focus:outline-none cursor-pointer"
                  >
                    <option value="destaques">Mais Populares</option>
                    <option value="a-z">Nome (A–Z)</option>
                    <option value="menor-preco">Menor Preço</option>
                    <option value="maior-preco">Maior Preço</option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#9c9384] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Description / Status Bar */}
        <div className="flex items-center justify-between py-4 text-xs text-[#9c9384]">
          <span>
            Mostrando <strong className="text-[#ede7dc]">{processedProducts.length}</strong> perfumes em Brands
            {selectedGender !== 'todos' && ` (${selectedGender === 'masculino' ? 'Masculinos 100ml' : 'Femininos 100ml'})`}
            {selectedBrand !== 'todas' && ` • ${selectedBrand}`}
          </span>
          <span className="text-[#e8c882] flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5" />
            <span>Todos em 100ml • R$ 289,90 cada</span>
          </span>
        </div>

        {/* PRODUCTS GRID */}
        {processedProducts.length > 0 ? (
          <ScrollReveal animation="fade-up" delay={120} duration={800}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
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
        ) : (
          <div className="bg-[#121216] border border-[#262422] rounded-2xl p-10 sm:p-14 text-center my-8">
            <h3 className="text-lg font-serif text-[#faf7f2] font-normal mb-2">
              Nenhum perfume encontrado
            </h3>
            <p className="text-xs sm:text-sm text-[#9c9384] max-w-md mx-auto mb-6">
              Nenhum produto corresponde aos filtros selecionados. Tente remover os filtros para visualizar a coleção completa.
            </p>
            <button
              onClick={() => {
                setSelectedGender('todos');
                setSelectedBrand('todas');
              }}
              className="px-5 py-2.5 bg-[#c5a880] text-black font-semibold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e0c49b] transition-all cursor-pointer"
            >
              Ver Todos os Perfumes Brands
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
