import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Percent
} from 'lucide-react';
import { CartItem } from '../types/perfume';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  
  // Shipping simulator
  const [cep, setCep] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<'pac' | 'sedex'>('pac');

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

  // Free shipping condition
  const isFreeShipping = subtotal >= 299;
  const shippingCost = !shippingCalculated 
    ? 0 
    : isFreeShipping 
    ? 0 
    : selectedShippingMethod === 'sedex' ? 24.90 : 14.90;

  // Discount calculation
  const discountAmount = appliedCoupon 
    ? (subtotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'AR5' || clean === 'ARFRAGRANCE5' || clean === 'ELIXIR5') {
      setAppliedCoupon({ code: clean, discountPercent: 5 });
      setCouponError('');
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, '').length >= 8) {
      setShippingCalculated(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101014] border-l border-[#292723] shadow-2xl flex flex-col justify-between">
          
          {/* Cart Header */}
          <div className="p-5 sm:p-6 border-b border-[#24221f] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full p-[1px] bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#8a7322] shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-base font-serif font-semibold text-[#faf7f2] leading-none">
                  Sua Sacola ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
                </h2>
                <span className="text-[10px] text-[#a89f91] tracking-wider uppercase font-light">AR Fragrance</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#9c9384] hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Free Shipping Progress Indicator */}
            <div className="p-3.5 rounded-lg bg-[#18171c] border border-[#2b2823]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#ded8cb] font-medium flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#e8c882]" />
                  <span>Frete Grátis</span>
                </span>
                {subtotal >= 299 ? (
                  <span className="text-emerald-400 font-bold">Parabéns! Você ganhou Frete Grátis</span>
                ) : (
                  <span className="text-[#9c9384]">
                    Faltam <strong className="text-[#e8c882]">{formatPrice(299 - subtotal)}</strong>
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-[#262429] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#c5a880] to-[#e6ca95] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / 299) * 100)}%` }}
                />
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-[#9c9384]">
                <ShoppingBag className="w-12 h-12 text-[#3b3831] mx-auto mb-3" />
                <p className="text-base font-serif text-[#faf7f2] mb-1">Sua sacola está vazia</p>
                <p className="text-xs text-[#787163] mb-6">Explore nossas fragrâncias importadas, árabes e Lab8.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#c5a880] text-black text-xs font-bold uppercase tracking-wider rounded"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}-${idx}`}
                    className="p-3 rounded-lg bg-[#151419] border border-[#24221f] flex gap-3 items-center"
                  >
                    {(item.product.image || item.product.images?.[0]) ? (
                      <img
                        src={item.product.image || item.product.images?.[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-contain p-1 rounded bg-[#1c1b20] border border-[#2e2c26] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-[#1c1b20] border border-[#2e2c26] flex items-center justify-center text-xs text-[#787163] shrink-0">
                        AR
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase text-[#c5a880] font-semibold truncate">
                        {item.product.brand}
                      </p>
                      <h4 className="text-xs font-serif font-medium text-[#faf7f2] truncate">
                        {item.product.name}
                      </h4>
                      <span className="inline-block text-[10px] text-[#9c9384] bg-[#201f25] px-2 py-0.5 rounded border border-[#2e2c26] mt-1">
                        Volumetria: {item.selectedSize}
                      </span>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#33302a] rounded bg-[#1c1a20]">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 text-[#9c9384] hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#faf7f2]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 text-[#9c9384] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#faf7f2]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-[#787163]">
                              {item.quantity}x {formatPrice(item.unitPrice)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      className="p-1 text-[#787163] hover:text-red-400 self-start"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Coupons & Shipping (Only if cart not empty) */}
            {cartItems.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#24221f]">
                {/* Coupon Code Section */}
                <div>
                  <label className="block text-xs font-medium text-[#9c9384] mb-1.5">
                    Cupom de Desconto
                  </label>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#787163]" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Inserir cupom"
                        className="w-full bg-[#18171c] border border-[#2e2c26] rounded pl-8 pr-3 py-1.5 text-xs text-[#faf7f2] focus:border-[#c5a880] focus:outline-none uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#26242b] hover:bg-[#c5a880] hover:text-black text-[#e8c882] text-xs font-semibold rounded border border-[#c5a880]/40 transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Cupom {appliedCoupon.code} aplicado (-{appliedCoupon.discountPercent}%)
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-400 mt-1">{couponError}</p>
                  )}
                </div>

                {/* Shipping Simulation */}
                <div>
                  <label className="block text-xs font-medium text-[#9c9384] mb-1.5">
                    Calcular Frete e Prazo
                  </label>
                  <form onSubmit={handleCalculateShipping} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="flex-1 bg-[#18171c] border border-[#2e2c26] rounded px-3 py-1.5 text-xs text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#26242b] hover:bg-[#34313b] text-[#ded8cb] text-xs font-semibold rounded border border-[#33302a] transition-colors"
                    >
                      Calcular
                    </button>
                  </form>
                  {shippingCalculated && (
                    <div className="mt-2 space-y-1.5">
                      <label className="flex items-center justify-between p-2 rounded bg-[#18171c] border border-[#2e2c26] cursor-pointer text-xs">
                        <span className="text-[#ded8cb]">
                          {isFreeShipping ? 'Frete Grátis Especial' : 'PAC (4-7 dias úteis)'}
                        </span>
                        <span className="font-bold text-[#faf7f2]">
                          {isFreeShipping ? 'GRÁTIS' : 'R$ 14,90'}
                        </span>
                      </label>
                      {!isFreeShipping && (
                        <label className="flex items-center justify-between p-2 rounded bg-[#18171c] border border-[#2e2c26] cursor-pointer text-xs">
                          <span className="text-[#ded8cb]">Sedex Expresso (1-3 dias úteis)</span>
                          <span className="font-bold text-[#faf7f2]">R$ 24,90</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#131217] border-t border-[#262420] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#9c9384]">
                  <span>Subtotal</span>
                  <span className="text-[#faf7f2]">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#9c9384]">
                  <span>Frete</span>
                  <span className="text-[#faf7f2]">
                    {isFreeShipping ? (
                      <strong className="text-emerald-400">Grátis</strong>
                    ) : shippingCalculated ? (
                      formatPrice(shippingCost)
                    ) : (
                      'A calcular'
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#faf7f2] pt-2 border-t border-[#282622]">
                  <span>Total</span>
                  <span className="text-xl text-[#e8c882]">{formatPrice(total)}</span>
                </div>

                <p className="text-[11px] text-[#9c9384] text-right">
                  Ou em até 10x de {formatPrice(total / 10)} sem juros
                </p>
              </div>

              {/* Finalize Button */}
              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-md bg-gradient-to-r from-[#c5a880] to-[#e6ca95] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Finalizar compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] text-[#787163]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Ambiente Criptografado 256-bit SSL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
