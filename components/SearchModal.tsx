import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types/perfume';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchFamily = p.olfactoryFamily.toLowerCase().includes(q);
      const matchNotes = [
        ...p.topNotes,
        ...p.heartNotes,
        ...p.baseNotes
      ].some(note => note.toLowerCase().includes(q));
      return matchName || matchBrand || matchFamily || matchNotes;
    });
  }, [products, query]);

  if (!isOpen) return null;

  const popularSearches = [
    'Aventus',
    'Khamrah',
    'Baccarat Rouge',
    'Sauvage Elixir',
    'Decantes 5ml',
    'Tom Ford Oud Wood',
    'Perfumes Árabes'
  ];

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="relative bg-[#121115] border border-[#2e2a23] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#262420] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#c5a880] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por perfume, marca (Creed, Lattafa...), notas (Oud, Baunilha)..."
            className="w-full bg-transparent text-[#faf7f2] placeholder-[#787163] text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787163] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-[#9c9384] hover:text-white border border-[#2d2a24] rounded-md ml-1"
          >
            ESC
          </button>
        </div>

        {/* Popular searches suggestions */}
        {!query && (
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-[#9c9384] mb-3">
              <span>Termos mais buscados</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full bg-[#1b1a1f] hover:bg-[#25242b] border border-[#2e2c26] text-xs text-[#ded8cb] hover:text-[#e8c882] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
            <p className="text-xs text-[#9c9384] px-2 mb-2">
              {searchResults.length} resultado(s) para "{query}"
            </p>

            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-[#9c9384]">
                <p className="text-sm text-[#ded8cb] mb-1">Nenhum perfume encontrado para sua busca.</p>
                <p className="text-xs text-[#6e675c]">Tente buscar por marcas como Creed, Dior, Lattafa ou notas como Oud.</p>
              </div>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-[#17161b] hover:bg-[#201e25] border border-[#262420] hover:border-[#c5a880]/60 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {(product.images?.[0] || product.image) ? (
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover bg-[#222] border border-[#302d28]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-[#222] border border-[#302d28] flex items-center justify-center text-xs text-[#787163]">
                        AR
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase text-[#c5a880] tracking-wider font-semibold">
                        {product.brand}
                      </p>
                      <h4 className="text-xs sm:text-sm font-serif font-medium text-[#faf7f2] group-hover:text-[#e8c882] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-[#9c9384]">
                        {product.concentration} · {product.olfactoryFamily}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-[#faf7f2] block">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[10px] text-[#e8c882] group-hover:underline inline-flex items-center gap-0.5">
                      Ver detalhes <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
