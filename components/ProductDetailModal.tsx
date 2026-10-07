import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Check, 
  Clock, 
  Plus, 
  Minus,
  Award,
  Layers,
  CheckCircle2,
  Pencil
} from 'lucide-react';
import { Product, ProductSizeOption } from '../types/perfume';
import { MOCK_REVIEWS } from '../data/perfumesData';
import { getStorePaymentConfig } from '../config/paymentConfig';
import { getBrandConfig, getPerfumeTitleFontClass } from '../config/brandConfig';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onBuyNow?: (product: Product, size: string, quantity: number) => void;
  onSelectRelated: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectRelated,
  onEditProduct
}) => {
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('100ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'piramide' | 'detalhes' | 'avaliacoes'>('piramide');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // New review state
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image || product.images?.[0] || '');
      setSelectedSize(product.availableSizes?.[0]?.size || '100ml');
      setQuantity(1);
    }
  }, [product?.id, product?.image, product?.images]);

  if (!product) return null;

  // Find current selected size pricing
  const currentSizeOption: ProductSizeOption = 
    product.availableSizes?.find(s => s.size === selectedSize) || 
    product.availableSizes?.[0] || 
    { size: '100ml', price: product.price, originalPrice: product.originalPrice };

  const currentPrice = currentSizeOption.price;
  const originalPrice = currentSizeOption.originalPrice || product.originalPrice;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleWhatsAppBuy = () => {
    if (product.inStock === false) return;
    const config = getStorePaymentConfig();
    const cleanPhone = (config.whatsappNumber || '5511987654321').replace(/\D/g, '') || '5511987654321';
    const priceFormatted = formatPrice(currentPrice * quantity);
    const message = `Olá, tenho interesse no perfume ${product.name}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    const reviewObj = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Hoje',
      comment: newReviewComment.trim(),
      verifiedPurchase: true
    };
    setReviewsList([reviewObj, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.olfactoryFamily === product.olfactoryFamily))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#111114] border border-[#2b2823] w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar detalhes"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#1c1b1f]/80 text-[#d4cdbf] hover:text-white hover:bg-[#252429] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 lg:p-10 max-h-[88vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Big Image Viewer with standardized luxury dark background */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#141416] p-8 flex items-center justify-center border border-[#262420] shadow-inner">
                {/* Pedestal shadow */}
                <div className="absolute bottom-6 w-44 h-3 bg-black/60 rounded-full blur-sm pointer-events-none" />

                {(activeImage && activeImage.trim() !== '') ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="max-h-[82%] max-w-[80%] w-auto h-auto object-contain object-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
                  />
                ) : (product.image && product.image.trim() !== '') ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[82%] max-w-[80%] w-auto h-auto object-contain object-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#787163] text-xs">
                    Sem foto
                  </div>
                )}
                <button
                  onClick={() => onToggleWishlist(product)}
                  aria-label="Favoritar"
                  className={`absolute top-3 left-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                    isWishlisted 
                      ? 'bg-[#ded7cc] text-[#141312] shadow-md' 
                      : 'bg-black/60 text-[#d4cdbf] hover:text-[#ded7cc]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {onEditProduct && (
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-[#c5a880] text-[#ded8cb] hover:text-black border border-white/20 text-xs font-medium backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105"
                    title="Editar foto e informações deste perfume"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#e8c882]" />
                    <span>Editar Foto</span>
                  </button>
                )}
              </div>

              {/* Thumbnails with standardized dark background */}
              {product.images && product.images.filter(img => typeof img === 'string' && img.trim() !== '').length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.filter(img => typeof img === 'string' && img.trim() !== '').map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 p-2 bg-[#161619] flex items-center justify-center transition-all ${
                        activeImage === img 
                          ? 'border-[#c5a880] opacity-100 scale-95 shadow-md' 
                          : 'border-[#292723] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Miniatura ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Badges Trust */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#22211e]">
                <div className="flex items-center gap-2 text-xs text-[#a39a89]">
                  <ShieldCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Selo ADIPEC & 100% Original</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#a39a89]">
                  <Truck className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Envio Imediato com Rastreio</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  {/* Brand */}
                  <p className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-semibold">
                    {product.brand}
                  </p>

                  {/* Quick Edit button */}
                  {onEditProduct && (
                    <button
                      onClick={() => onEditProduct(product)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1d1b22] hover:bg-[#27252f] border border-[#3b3427] hover:border-[#c5a880] text-[#e8c882] text-[11px] font-medium transition-colors"
                      title="Alterar descrição, foto ou valor deste perfume"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Editar Perfume</span>
                    </button>
                  )}
                </div>

                {/* Name */}
                <h1 className={`text-2xl sm:text-4xl ${getPerfumeTitleFontClass(getBrandConfig().perfumeTitleFont || 'cormorant')} text-[#faf7f2] font-normal leading-tight mb-2`}>
                  {product.name}
                </h1>

                {/* Concentration & Family */}
                <div className="flex items-center gap-2 text-xs text-[#9c9384] mb-3">
                  <span className="text-[#ded8cb]">{product.concentration}</span>
                  <span>•</span>
                  <span>Família: <strong className="text-[#ede7dc]">{product.olfactoryFamily}</strong></span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-[#e8c882]">
                    Nota {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-[#787163]">({reviewsList.length} avaliações verificadas)</span>
                </div>

                {/* Descrição Principal do Perfume */}
                {product.description && (
                  <p className="text-xs sm:text-sm text-[#c4bcae] leading-relaxed mb-6 font-light">
                    {product.description}
                  </p>
                )}

                {/* Pricing & Installments */}
                <div className="p-4 rounded-xl bg-[#17161b] border border-[#2d2a23] mb-6">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-2xl sm:text-3xl font-bold text-[#faf7f2]">
                      {formatPrice(currentPrice)}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-[#787163] line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                      5% OFF no PIX: {formatPrice(currentPrice * 0.95)}
                    </span>
                  </div>

                  <p className="text-xs text-[#c5bfae]">
                    Ou em até <strong className="text-[#ede7dc]">10x de {formatPrice(currentPrice / 10)}</strong> sem juros no cartão
                  </p>

                  {/* Availability */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Em estoque — Despacho prioritário para todo o Brasil</span>
                  </div>
                </div>

                {/* Sizes Available */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-[#9c9384] mb-2 font-medium">
                    {product.isDecant ? 'Selecione o Fracionamento:' : 'Selecione a Volumetria:'}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.availableSizes.map((sz) => (
                      <button
                        key={sz.size}
                        onClick={() => setSelectedSize(sz.size)}
                        className={`py-2 px-4 rounded-md text-xs font-semibold tracking-wide border transition-all ${
                          selectedSize === sz.size
                            ? 'bg-[#c5a880] text-black border-[#c5a880] shadow-md'
                            : 'bg-[#18171b] text-[#d4cdbf] border-[#302d28] hover:border-[#c5a880]/60'
                        }`}
                      >
                        <span>{sz.size}</span>
                        <span className="ml-2 opacity-80">({formatPrice(sz.price)})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-[#17161a] border border-[#302d27] rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 text-[#9c9384] hover:text-white transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#faf7f2]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2.5 text-[#9c9384] hover:text-white transition-colors"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                        addedSuccess
                          ? 'bg-emerald-700 border-emerald-600 text-white'
                          : 'bg-[#ded7cc] hover:bg-[#eae5dd] text-[#141312] border-transparent'
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Adicionado ao Carrinho!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Adicionar ao carrinho</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Buy on WhatsApp button */}
                  <button
                    onClick={handleWhatsAppBuy}
                    className="w-full py-3.5 px-6 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#1c1b1f] hover:bg-[#25242b] text-[#ede7dc] border border-[#33302b] hover:border-[#524d45] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Comprar / Negociar no WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER TABS: Olfactory Pyramid, Performance, Reviews */}
          <div className="mt-12 pt-8 border-t border-[#262420]">
            {/* Tabs selector */}
            <div className="flex items-center gap-2 border-b border-[#262420] pb-3 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('piramide')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === 'piramide'
                    ? 'bg-[#ded7cc] text-[#141312]'
                    : 'text-[#9c9384] hover:text-white'
                }`}
              >
                Pirâmide Olfativa & Performance
              </button>
              <button
                onClick={() => setActiveTab('detalhes')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === 'detalhes'
                    ? 'bg-[#ded7cc] text-[#141312]'
                    : 'text-[#9c9384] hover:text-white'
                }`}
              >
                Descrição & Ocasião
              </button>
              <button
                onClick={() => setActiveTab('avaliacoes')}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === 'avaliacoes'
                    ? 'bg-[#ded7cc] text-[#141312]'
                    : 'text-[#9c9384] hover:text-white'
                }`}
              >
                Avaliações ({reviewsList.length})
              </button>
            </div>

            {/* TAB 1: Pyramid & Performance */}
            {activeTab === 'piramide' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pyramid Notes */}
                <div className="md:col-span-2 space-y-4">
                  {/* Top Notes */}
                  <div className="p-4 rounded-xl bg-[#151418] border border-[#292723]">
                    <span className="text-[11px] font-bold text-[#c5a880] uppercase tracking-wider block mb-1">
                      Notas de Saída (Topo)
                    </span>
                    <p className="text-xs text-[#9c9384] mb-2">Primeira impressão sentida nos primeiros 15 minutos.</p>
                    <div className="flex flex-wrap gap-2">
                      {product.topNotes.map(n => (
                        <span key={n} className="px-2.5 py-1 bg-[#201f25] text-xs text-[#ede8de] rounded border border-[#333129]">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Heart Notes */}
                  <div className="p-4 rounded-xl bg-[#151418] border border-[#292723]">
                    <span className="text-[11px] font-bold text-[#c5a880] uppercase tracking-wider block mb-1">
                      Notas de Coração (Corpo)
                    </span>
                    <p className="text-xs text-[#9c9384] mb-2">A personalidade central da fragrância após a evolução.</p>
                    <div className="flex flex-wrap gap-2">
                      {product.heartNotes.map(n => (
                        <span key={n} className="px-2.5 py-1 bg-[#201f25] text-xs text-[#ede8de] rounded border border-[#333129]">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Base Notes */}
                  <div className="p-4 rounded-xl bg-[#151418] border border-[#292723]">
                    <span className="text-[11px] font-bold text-[#c5a880] uppercase tracking-wider block mb-1">
                      Notas de Fundo (Base)
                    </span>
                    <p className="text-xs text-[#9c9384] mb-2">A fixação duradoura que permanece na pele por horas.</p>
                    <div className="flex flex-wrap gap-2">
                      {product.baseNotes.map(n => (
                        <span key={n} className="px-2.5 py-1 bg-[#201f25] text-xs text-[#ede8de] rounded border border-[#333129]">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Box */}
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#18171c] border border-[#c5a880]/30 space-y-4">
                    <h3 className="text-sm font-serif font-bold text-[#faf7f2] uppercase tracking-wider">
                      Performance & Projeção
                    </h3>

                    <div>
                      <p className="text-[11px] text-[#9c9384] uppercase tracking-wider mb-1">Fixação na Pele:</p>
                      <p className="text-sm font-semibold text-[#e8c882]">{product.longevity}</p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#9c9384] uppercase tracking-wider mb-1">Projeção / Rastro:</p>
                      <p className="text-sm font-semibold text-[#ded8cb]">{product.sillage}</p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#9c9384] uppercase tracking-wider mb-1">Gênero Indicado:</p>
                      <p className="text-sm font-semibold text-[#ded8cb] capitalize">{product.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Description & Occasion */}
            {activeTab === 'detalhes' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-serif text-[#faf7f2] mb-2">História & Conceito Olfativo</h3>
                  <p className="text-sm text-[#d4cdbf] font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#161519] border border-[#2b2924]">
                  <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold mb-1">
                    Ocasião Recomendada
                  </h4>
                  <p className="text-sm text-[#ede7dc]">
                    {product.occasion}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Reviews */}
            {activeTab === 'avaliacoes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-serif text-[#faf7f2]">Opiniões de quem já comprou</h3>
                    <p className="text-xs text-[#9c9384]">Avaliações 100% autênticas e verificadas.</p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 text-xs bg-[#24222a] hover:bg-[#c5a880] hover:text-black text-[#e8c882] rounded border border-[#c5a880]/40 transition-all font-semibold"
                  >
                    {showReviewForm ? 'Cancelar' : 'Escrever Avaliação'}
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleAddReview} className="p-5 rounded-xl bg-[#16151a] border border-[#302e26] space-y-4">
                    <h4 className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                      Compartilhe sua experiência
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#9c9384] mb-1">Seu Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="Ex: Mariana Coutinho"
                          className="w-full bg-[#1b1a20] border border-[#33302a] rounded px-3 py-2 text-sm text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#9c9384] mb-1">Nota em Estrelas</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full bg-[#1b1a20] border border-[#33302a] rounded px-3 py-2 text-sm text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                        >
                          <option value={5}>5 Estrelas (Excelente)</option>
                          <option value={4}>4 Estrelas (Muito Bom)</option>
                          <option value={3}>3 Estrelas (Bom)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#9c9384] mb-1">Seu Comentário</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Conte sobre fixação, projeção, elogios recebidos..."
                        className="w-full bg-[#1b1a20] border border-[#33302a] rounded px-3 py-2 text-sm text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#c5a880] text-black text-xs font-bold uppercase tracking-wider rounded"
                    >
                      Publicar Avaliação
                    </button>
                  </form>
                )}

                {/* Review List */}
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#141317] border border-[#24221f]">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#faf7f2]">{rev.author}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Comprador Verificado
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#787163]">{rev.date}</span>
                      </div>
                      <div className="text-xs font-semibold text-[#e8c882] mb-2">
                        Nota {rev.rating}.0
                      </div>
                      <p className="text-xs text-[#d4cdbf] font-light leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#262420]">
                <h3 className="text-lg font-serif text-[#faf7f2] mb-4">
                  Você também pode apreciar
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="p-3 bg-[#141317] rounded-lg border border-[#24221f] hover:border-[#c5a880] cursor-pointer transition-all"
                    >
                      <div className="aspect-square rounded overflow-hidden mb-2 bg-[#1b1a1f] flex items-center justify-center">
                        {(rel.images?.[0] || rel.image) ? (
                          <img src={rel.images?.[0] || rel.image} alt={rel.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-[#787163]">AR</span>
                        )}
                      </div>
                      <p className="text-[10px] uppercase text-[#c5a880] truncate">{rel.brand}</p>
                      <p className="text-xs font-serif text-[#faf7f2] truncate">{rel.name}</p>
                      <p className="text-xs font-semibold text-[#faf7f2] mt-1">{formatPrice(rel.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
