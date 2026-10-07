import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Pencil, 
  RotateCcw, 
  Check, 
  Sliders, 
  Tag, 
  DollarSign, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  Search,
  Eye,
  Loader2,
  Trash2
} from 'lucide-react';
import { Product } from '../types/perfume';
import { 
  saveProductCustomization, 
  resetProductCustomization, 
  getProductCustomizations 
} from '../config/productsCustomization';
import { PERFUMES_DATA } from '../data/perfumesData';
import { compressImageFile } from '../utils/imageCompressor';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProductId?: string | null;
  onProductUpdated: () => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProductId,
  onProductUpdated
}) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    return initialProductId || products[0]?.id || '';
  });

  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'arabes' | 'importados' | 'lab8' | 'brands'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [gender, setGender] = useState<'masculino' | 'feminino' | 'unissex'>('unissex');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when initialProductId changes or modal opens
  useEffect(() => {
    if (initialProductId) {
      setSelectedId(initialProductId);
    } else if (!selectedId && products.length > 0) {
      setSelectedId(products[0].id);
    }
  }, [initialProductId, isOpen, products]);

  // Find the selected product from the current products list
  const currentProduct = products.find(p => p.id === selectedId) || products[0];

  // Populate form fields whenever the selected product changes or updates
  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name || '');
      setBrand(currentProduct.brand || '');
      setGender((currentProduct.gender as 'masculino' | 'feminino' | 'unissex') || 'unissex');
      setPrice(currentProduct.price && currentProduct.price > 0 ? currentProduct.price.toString() : '');
      setOriginalPrice(currentProduct.originalPrice && currentProduct.originalPrice > 0 ? currentProduct.originalPrice.toString() : '');
      setDescription(currentProduct.description || '');
      setImageUrl(currentProduct.image || (currentProduct.images && currentProduct.images[0]) || '');
      setIsSaved(false);
    }
  }, [currentProduct?.id, currentProduct?.image, currentProduct?.price, currentProduct?.gender]);

  if (!isOpen || !currentProduct) return null;

  // Filter products for the selector dropdown/list
  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'todos' && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (p.name || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle direct file upload with automatic compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('Por favor, selecione uma imagem com até 20MB.');
      return;
    }

    try {
      setIsProcessingImage(true);
      const compressedDataUrl = await compressImageFile(file, 900, 0.82);
      setImageUrl(compressedDataUrl);
      setIsProcessingImage(false);
    } catch (err: any) {
      setIsProcessingImage(false);
      console.error('Erro na compressão de imagem:', err);
      alert('Erro ao carregar a imagem: ' + (err?.message || 'Arquivo inválido.'));
    }
  };

  const handleSave = () => {
    const cleanPrice = price.trim().replace(',', '.');
    const numPrice = cleanPrice ? parseFloat(cleanPrice) : 0;
    const cleanOrig = originalPrice.trim().replace(',', '.');
    const numOriginalPrice = cleanOrig ? parseFloat(cleanOrig) : undefined;

    if (isNaN(numPrice) || numPrice < 0) {
      alert('Por favor, insira um valor de preço válido (número positivo ou 0).');
      return;
    }

    const trimmedImage = imageUrl.trim();

    const result = saveProductCustomization(currentProduct.id, {
      name: name.trim(),
      brand: brand.trim(),
      gender: gender,
      price: numPrice,
      originalPrice: numOriginalPrice && !isNaN(numOriginalPrice) ? numOriginalPrice : undefined,
      description: description.trim(),
      image: trimmedImage,
      images: trimmedImage ? [trimmedImage] : []
    });

    if (result.success) {
      setSuccessMessage(`Perfume "${name || currentProduct.id}" salvo com sucesso!`);
      setIsSaved(true);
      onProductUpdated();

      setTimeout(() => {
        setIsSaved(false);
        setSuccessMessage('');
      }, 2500);
    } else {
      alert(result.error || 'Erro ao salvar alterações.');
    }
  };

  const handleResetToDefault = () => {
    const defaultData = PERFUMES_DATA.find(p => p.id === currentProduct.id);
    if (!defaultData) return;

    if (window.confirm(`Deseja restaurar as configurações originais de "${currentProduct.name}"?`)) {
      resetProductCustomization(currentProduct.id);
      setName(defaultData.name);
      setBrand(defaultData.brand);
      setGender((defaultData.gender as 'masculino' | 'feminino' | 'unissex') || 'unissex');
      setPrice(defaultData.price.toString());
      setOriginalPrice(defaultData.originalPrice ? defaultData.originalPrice.toString() : '');
      setDescription(defaultData.description);
      setImageUrl(defaultData.image || defaultData.images[0] || '');
      onProductUpdated();
      setSuccessMessage('Valores originais restaurados!');
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setSuccessMessage('');
      }, 2000);
    }
  };

  const formatPricePreview = (val: string) => {
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  const hasCustomization = Boolean(getProductCustomizations()[currentProduct.id]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-4xl bg-[#121115] border border-[#3b3425] rounded-2xl shadow-2xl p-5 sm:p-7 text-[#ece6dc] animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a89f91] hover:text-white rounded-full bg-[#1e1c22] border border-[#2d2a23] transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 shrink-0 border-b border-[#24221d] pb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c5a880]/30 to-[#d4af37]/10 border border-[#c5a880] flex items-center justify-center text-[#e8c882]">
            <Pencil className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#faf7f2] flex items-center gap-2">
              <span>Editar Informações do Perfume</span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-[#b99a62]/20 border border-[#b99a62]/60 text-[#e8c882] px-2 py-0.5 rounded">
                Personalização Ativa
              </span>
            </h2>
            <p className="text-xs text-[#a89f91]">
              Altere a foto, preço e descrição de qualquer perfume da loja em tempo real
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {isSaved && successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-[#142817] border border-[#2e6e39] text-[#7ce08d] text-xs font-semibold flex items-center gap-2 animate-in fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#48c962] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 flex-grow space-y-6">
          {/* 1. SELETOR DE PERFUME */}
          <div className="bg-[#17161b] border border-[#292620] rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <label className="text-xs font-semibold text-[#c5a880] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Escolha o perfume para editar:</span>
              </label>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'brands', label: 'Brands (100ml)' },
                  { id: 'arabes', label: 'Árabes' },
                  { id: 'importados', label: 'Importados' },
                  { id: 'lab8', label: 'Lab8' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id as any)}
                    className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors ${
                      categoryFilter === cat.id
                        ? 'bg-[#c5a880] text-black font-semibold'
                        : 'bg-[#201f25] text-[#a5a5a5] hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search & Select Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-4 relative">
                <Search className="w-3.5 h-3.5 text-[#7a7469] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar perfume..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e1c22] border border-[#332f26] rounded-lg pl-8 pr-3 py-2 text-xs text-[#ede8df] placeholder-[#665e52] focus:border-[#c5a880] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-8 relative">
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full bg-[#1e1c22] border border-[#332f26] rounded-lg px-3 py-2 text-xs text-[#ede8df] focus:border-[#c5a880] focus:outline-none cursor-pointer"
                >
                  {filteredProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.category.toUpperCase()}] {p.brand ? `${p.brand} - ` : ''}{p.name || `Novo Slot (${p.id})`} {p.price > 0 ? `(R$ ${p.price.toFixed(2)})` : '(Sem preço definido)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. MAIN EDITING GRID (FORM + LIVE PREVIEW) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Product Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-1">
                    Nome do Perfume
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#17161b] border border-[#2e2a22] rounded-lg px-3 py-2 text-xs text-[#ede8df] focus:border-[#c5a880] focus:outline-none"
                    placeholder="Ex: Asad (Le Parfum)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-1">
                    Marca / Casa
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#17161b] border border-[#2e2a22] rounded-lg px-3 py-2 text-xs text-[#ede8df] focus:border-[#c5a880] focus:outline-none"
                    placeholder="Ex: Lattafa"
                  />
                </div>
              </div>

              {/* Classificação de Gênero (Masculino, Feminino, Unissex) */}
              <div className="p-3.5 rounded-xl bg-[#17161b] border border-[#2e2a22]">
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Classificação de Gênero</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'masculino', label: 'Masculino', desc: 'Homem' },
                    { id: 'feminino', label: 'Feminino', desc: 'Mulher' },
                    { id: 'unissex', label: 'Unissex', desc: 'Ambos' }
                  ].map((item) => {
                    const isSelected = gender === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGender(item.id as 'masculino' | 'feminino' | 'unissex')}
                        className={`py-2 px-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#b99a62] to-[#d6bc88] text-black border-[#b99a62] shadow-md font-bold'
                            : 'bg-[#1e1c22] border-[#332f26] text-[#a5a5a5] hover:text-[#ede8df] hover:border-[#4d473a]'
                        }`}
                      >
                        <span className="text-xs">{item.label}</span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-black/75 font-semibold' : 'text-[#736c61]'}`}>
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#17161b] border border-[#2e2a22]">
                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Preço de Venda (R$)</span>
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#1e1c22] border border-[#3b3528] rounded-lg px-3 py-2 text-sm font-semibold text-[#48c962] focus:border-[#c5a880] focus:outline-none"
                    placeholder="Ex: 369.00"
                  />
                  <span className="text-[10px] text-[#7a7469] mt-0.5 block">
                    Exibido como: {formatPricePreview(price)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a89f91] uppercase tracking-wider mb-1">
                    Preço Original / De (R$)
                  </label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-[#1e1c22] border border-[#332f26] rounded-lg px-3 py-2 text-xs text-[#a89f91] focus:border-[#c5a880] focus:outline-none"
                    placeholder="Ex: 429.00 (Opcional)"
                  />
                  <span className="text-[10px] text-[#7a7469] mt-0.5 block">
                    Preço riscado com desconto
                  </span>
                </div>
              </div>

              {/* Foto / Upload de Imagem */}
              <div className="p-4 rounded-xl bg-[#17161b] border border-[#2e2a22]">
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Foto do Perfume (Upload ou Link)</span>
                </label>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
                  <button
                    type="button"
                    disabled={isProcessingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-[#24222b] hover:bg-[#2e2b38] border border-[#443e33] hover:border-[#c5a880] text-xs font-semibold text-[#faf7f2] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#e8c882] animate-spin" />
                        <span>Otimizando e comprimindo imagem...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#e8c882]" />
                        <span>Fazer Upload do Computador / Celular</span>
                      </>
                    )}
                  </button>

                  {imageUrl && imageUrl !== (PERFUMES_DATA.find(p => p.id === currentProduct.id)?.image || PERFUMES_DATA.find(p => p.id === currentProduct.id)?.images[0]) && (
                    <button
                      type="button"
                      onClick={() => {
                        const def = PERFUMES_DATA.find(p => p.id === currentProduct.id);
                        if (def) setImageUrl(def.image || def.images[0] || '');
                      }}
                      className="px-3 py-2.5 rounded-lg bg-[#1f1a1a] hover:bg-[#2a2222] border border-[#442e2e] text-[#c57b7b] hover:text-[#f89b9b] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      title="Restaurar a foto padrão deste perfume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Foto Original</span>
                    </button>
                  )}
                </div>

                {/* URL Direct Input */}
                <div>
                  <span className="text-[11px] text-[#7a7469] block mb-1">Ou cole a URL da imagem:</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... ou /products/..."
                    className="w-full bg-[#1e1c22] border border-[#332f26] rounded-lg px-3 py-2 text-xs text-[#ede8df] focus:border-[#c5a880] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Descrição Completa</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#17161b] border border-[#2e2a22] rounded-lg p-3 text-xs text-[#ede8df] focus:border-[#c5a880] focus:outline-none leading-relaxed"
                  placeholder="Descreva as notas, ocasião de uso e personalidade desta fragrância..."
                />
              </div>
            </div>

            {/* Live Preview Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full p-3 rounded-xl bg-[#17161b] border border-[#2e2a22]">
                <div className="text-[11px] font-semibold text-[#c5a880] uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Prévia do Card na Loja</span>
                  </span>
                  <span className="text-[10px] text-[#7a7469]">Tempo Real</span>
                </div>

                {/* Simulated Card Preview */}
                <div className="bg-[#131316] rounded-lg overflow-hidden border border-[#332f26] shadow-lg flex flex-col">
                  {/* Photo Container */}
                  <div className="relative aspect-square w-full bg-[#151518] p-4 flex items-center justify-center overflow-hidden border-b border-[#21201d]">
                    {(() => {
                      const previewSrc = (imageUrl && imageUrl.trim() !== '') 
                        ? imageUrl.trim() 
                        : (currentProduct.image && currentProduct.image.trim() !== '') 
                          ? currentProduct.image.trim() 
                          : null;

                      return previewSrc ? (
                        <img
                          src={previewSrc}
                          alt={name || 'Perfume'}
                          className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center border-2 border-dashed border-[#b99a62]/30 rounded-lg">
                          <ImageIcon className="w-8 h-8 text-[#b99a62]/50 mb-1" />
                          <span className="text-xs text-[#dcd6ca] font-medium">Sem foto definida</span>
                          <span className="text-[10px] text-[#7a7469]">Faça upload ao lado</span>
                        </div>
                      );
                    })()}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-[#1b1916] border border-[#c5a880]/80 text-[#e8c882] text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                        {currentProduct.badge || 'ÁRABE'}
                      </span>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-3.5 flex flex-col justify-between bg-gradient-to-b from-[#131316] to-[#101012]">
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1">
                        <span className="text-[#c5a880] font-semibold truncate max-w-[65%]">
                          {brand || currentProduct.brand || 'Marca'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#1e1c22] border border-[#3b3528] text-[#e8c882] text-[9px] font-bold capitalize shrink-0">
                          {gender === 'masculino' ? 'Masculino' : gender === 'feminino' ? 'Feminino' : 'Unissex'}
                        </span>
                      </div>
                      <h4 className="text-sm font-serif font-medium text-[#faf7f2] truncate">
                        {name || currentProduct.name || 'Nome do Perfume'}
                      </h4>
                      <p className="text-[11px] text-[#8e877c] line-clamp-2 mt-1 leading-snug">
                        {description || currentProduct.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#23211e] flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-semibold text-[#faf7f2]">
                          {formatPricePreview(price)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-[#736c61] line-through">
                            {formatPricePreview(originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#a5a5a5]">10x s/ juros</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-5 pt-4 border-t border-[#24221d] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {hasCustomization && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 rounded-lg text-xs font-medium text-[#c57b7b] hover:text-white hover:bg-[#331c1c] border border-[#4d2828] transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Original</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#1d1c22] text-[#a5a5a5] hover:text-white border border-[#2e2c26] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#b99a62] to-[#d6bc88] text-black hover:brightness-110 active:scale-[0.98] transition-all shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
