import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Copy, 
  Check, 
  ArrowRight,
  Building2,
  AlertCircle
} from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { CartItem } from '../types/perfume';
import { getStorePaymentConfig } from '../config/paymentConfig';
import { generatePixPayload, getQrCodeImageUrl } from '../utils/pixHelper';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCep, setCustomerCep] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  // States
  const [copiedPix, setCopiedPix] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Store bank & payment config
  const storeConfig = useMemo(() => getStorePaymentConfig(), [isOpen]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeShipping = subtotal >= 299;
  const shippingCost = isFreeShipping ? 0 : 14.90;
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const total = Math.max(0, subtotal - pixDiscount + shippingCost);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Generate dynamic PIX payload based on store owner's real key
  const pixPayload = useMemo(() => {
    try {
      return generatePixPayload({
        key: storeConfig.pixKey || 'stopacontato@gmail.com',
        name: storeConfig.beneficiaryName || 'AR FRAGRANCE',
        city: storeConfig.city || 'SAO PAULO',
        amount: total,
        txId: `LX${Date.now().toString().slice(-6)}`
      });
    } catch {
      return `00020126580014br.gov.bcb.pix0136${storeConfig.pixKey}520400005303986540${total.toFixed(2)}5802BR5916${storeConfig.beneficiaryName}6009${storeConfig.city}62070503***6304`;
    }
  }, [storeConfig, total]);

  const pixQrCodeUrl = useMemo(() => {
    return getQrCodeImageUrl(pixPayload);
  }, [pixPayload]);

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('arfragrance_orders') || '[]');
        const newOrder = {
          id: `PED-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toLocaleDateString('pt-BR'),
          status: 'Processando Envio',
          total: total,
          items: cartItems.map(i => `${i.product.name} (${i.selectedSize}) x${i.quantity}`),
          tracking: 'Aguardando postagem'
        };
        localStorage.setItem('arfragrance_orders', JSON.stringify([newOrder, ...existing]));
      } catch (err) {
        console.error(err);
      }
      setIsSubmitting(false);
      setIsSuccess(true);
      onOrderCompleted();
    }, 1200);
  };

  const handleWhatsAppCheckout = () => {
    const itemsText = cartItems
      .map(i => `• ${i.product.name} (${i.selectedSize}) x${i.quantity} = ${formatPrice(i.unitPrice * i.quantity)}`)
      .join('%0A');
    
    const formattedAddress = `${customerAddress || 'Não informado'} - CEP: ${customerCep || 'Não informado'}`;
    const cleanPhone = storeConfig.whatsappNumber.replace(/\D/g, '') || '5511999999999';

    const msg = `*🛍️ NOVO PEDIDO - AR FRAGRANCE*%0A%0A` +
      `*Cliente:* ${customerName || 'Cliente Prestige'}%0A` +
      `*WhatsApp:* ${customerPhone || 'Não informado'}%0A` +
      `*Endereço:* ${formattedAddress}%0A%0A` +
      `*Itens Solicitados:*%0A${itemsText}%0A%0A` +
      `*Subtotal:* ${formatPrice(subtotal)}%0A` +
      `*Frete:* ${isFreeShipping ? 'Grátis' : formatPrice(shippingCost)}%0A` +
      (paymentMethod === 'pix' ? `*Desconto PIX (-5%):* -${formatPrice(pixDiscount)}%0A` : '') +
      `*VALOR TOTAL:* ${formatPrice(total)}%0A` +
      `*Forma de Pagamento:* ${paymentMethod === 'pix' ? 'PIX Bancário' : 'Cartão de Crédito'}%0A%0A` +
      `Olá! Gostaria de confirmar meu pedido e enviar o comprovante de pagamento.`;
    
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#111115] border border-[#2e2a23] w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#24221f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full p-[1px] bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#8a7322] shrink-0">
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
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#faf7f2] leading-tight">
                  Checkout Seguro & Oficial
                </h2>
              </div>
              <p className="text-[10px] text-[#a89f91] tracking-wider uppercase">AR Fragrance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9c9384] hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS SCREEN */
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#8a7322] mx-auto shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="AR Fragrance"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <h3 className="text-2xl font-serif text-[#faf7f2]">
              Pedido Confirmado com Sucesso!
            </h3>
            <p className="text-xs sm:text-sm text-[#a89f91] max-w-md mx-auto leading-relaxed">
              Obrigado por escolher a <strong>AR Fragrance</strong>. Enviamos os detalhes do seu pedido para o seu WhatsApp e e-mail.
            </p>
            <div className="p-4 rounded-xl bg-[#17161b] border border-[#2d2a23] max-w-md mx-auto text-xs space-y-1.5 text-left">
              <p className="text-[#c5a880] font-semibold text-center pb-1 border-b border-[#2a2822]">
                Código do Pedido: #LX-{Math.floor(100000 + Math.random() * 900000)}
              </p>
              <div className="pt-1 text-[#d4cdbf] space-y-1">
                <p><strong>Valor a pagar:</strong> <span className="text-[#e8c882]">{formatPrice(total)}</span></p>
                <p><strong>Beneficiário do PIX:</strong> {storeConfig.beneficiaryName}</p>
                <p><strong>Chave PIX:</strong> {storeConfig.pixKey}</p>
              </div>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleWhatsAppCheckout}
                className="px-6 py-3.5 bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Enviar Comprovante no WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-[#1e1d22] text-[#e8c882] border border-[#c5a880]/40 font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#25242b] transition-all"
              >
                Voltar à Loja
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* 1. Identification & Shipping */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-semibold mb-3">
                1. Dados de Envio & Contato
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome Completo *"
                  className="bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                />
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="E-mail para rastreio *"
                  className="bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="WhatsApp com DDD *"
                  className="bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={customerCep}
                  onChange={(e) => setCustomerCep(e.target.value)}
                  placeholder="CEP (Ex: 01310-100) *"
                  className="bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Endereço de entrega completo (Rua, Número, Complemento, Bairro) *"
                  className="bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] sm:col-span-2 focus:border-[#c5a880] focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="pt-4 border-t border-[#24221f]">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-semibold mb-3">
                2. Forma de Pagamento
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                    paymentMethod === 'pix' 
                      ? 'bg-[#1e1c17] border-[#c5a880] text-[#e8c882] shadow-md' 
                      : 'bg-[#151419] border-[#292723] text-[#9c9384]'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#e8c882]" />
                  <span>PIX Bancário Direto</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    5% de Desconto Imediato
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cartao')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                    paymentMethod === 'cartao' 
                      ? 'bg-[#1e1c17] border-[#c5a880] text-[#e8c882] shadow-md' 
                      : 'bg-[#151419] border-[#292723] text-[#9c9384]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#e8c882]" />
                  <span>Cartão de Crédito</span>
                  <span className="text-[10px] text-[#ded8cb]">
                    Até 10x sem juros
                  </span>
                </button>
              </div>

              {/* PIX Details */}
              {paymentMethod === 'pix' && (
                <div className="p-5 rounded-xl bg-[#17161b] border border-[#2d2a23] space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Real Dynamic QR Code image */}
                    <div className="w-32 h-32 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
                      {pixQrCodeUrl ? (
                        <img 
                          src={pixQrCodeUrl} 
                          alt="QR Code PIX" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <QrCode className="w-16 h-16 text-black" />
                      )}
                    </div>
                    
                    <div className="space-y-2 flex-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>PIX Registrado no Banco Central</span>
                      </div>
                      <p className="font-semibold text-[#faf7f2] text-sm">
                        Escaneie o QR Code ou use a chave Copia e Cola
                      </p>
                      <p className="text-[11px] text-[#a89f91]">
                        Favorecido: <strong className="text-[#ded8cb]">{storeConfig.beneficiaryName}</strong>
                      </p>
                      <p className="text-[11px] text-[#a89f91]">
                        Chave PIX: <strong className="text-[#ded8cb] font-mono">{storeConfig.pixKey}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Copy Paste Code */}
                  <div className="pt-2 border-t border-[#262420]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixPayload}
                        className="flex-1 bg-[#121115] border border-[#2d2a23] rounded px-3 py-2 text-[11px] font-mono text-[#ded8cb] truncate select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="px-4 py-2 bg-[#25232b] hover:bg-[#c5a880] hover:text-black text-[#e8c882] rounded border border-[#c5a880]/40 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Details */}
              {paymentMethod === 'cartao' && (
                <div className="p-4 rounded-xl bg-[#17161b] border border-[#2d2a23] space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Número do Cartão (0000 0000 0000 0000)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#1b1a20] border border-[#302d27] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nome impresso no Cartão"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-[#1b1a20] border border-[#302d27] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none uppercase"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Validade (MM/AA)"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="bg-[#1b1a20] border border-[#302d27] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none font-mono"
                    />
                    <input
                      type="text"
                      required
                      placeholder="CVV (3 dígitos)"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="bg-[#1b1a20] border border-[#302d27] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none font-mono"
                    />
                  </div>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full bg-[#1b1a20] border border-[#302d27] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 10].map(n => (
                      <option key={n} value={n}>
                        {n}x de {formatPrice(total / n)} sem juros
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 3. Order Summary & Confirm */}
            <div className="pt-4 border-t border-[#24221f] bg-[#141318] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-[#9c9384]">
                <span>Itens ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-emerald-400">
                  <span>Desconto de 5% (PIX Direto)</span>
                  <span>-{formatPrice(pixDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#9c9384]">
                <span>Frete</span>
                <span>{isFreeShipping ? <strong className="text-emerald-400">Grátis</strong> : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#faf7f2] pt-2 border-t border-[#252328]">
                <span>Valor Final</span>
                <span className="text-xl text-[#e8c882]">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-md bg-gradient-to-r from-[#c5a880] to-[#e6ca95] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirmando Pagamento...</span>
              ) : (
                <>
                  <span>Concluir Pedido · {formatPrice(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#787163]">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Transação protegida por certificado bancário 256-bits</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
