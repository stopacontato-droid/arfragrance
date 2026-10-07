import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  HelpCircle, 
  Save, 
  ShieldCheck, 
  Phone, 
  ExternalLink,
  CreditCard,
  Zap
} from 'lucide-react';
import { StorePaymentConfig, getStorePaymentConfig, saveStorePaymentConfig } from '../config/paymentConfig';

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: (config: StorePaymentConfig) => void;
}

export const PaymentSettingsModal: React.FC<PaymentSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [config, setConfig] = useState<StorePaymentConfig>(getStorePaymentConfig());
  const [activeTab, setActiveTab] = useState<'pix' | 'gateway' | 'como-funciona'>('pix');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStorePaymentConfig(config);
    onConfigSaved(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#111115] border border-[#2e2a23] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-[#24221f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1c1a20] border border-[#c5a880]/50 flex items-center justify-center text-[#e8c882]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#faf7f2]">
                Configuração de Pagamento & Conta Bancária
              </h2>
              <p className="text-xs text-[#a89f91]">
                Defina como e onde o dinheiro das suas vendas vai cair
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9c9384] hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#24221f] bg-[#141318]">
          <button
            type="button"
            onClick={() => setActiveTab('pix')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'pix' 
                ? 'border-[#c5a880] text-[#e8c882] bg-[#1a191f]' 
                : 'border-transparent text-[#9c9384] hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>PIX Direto na Sua Conta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gateway')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'gateway' 
                ? 'border-[#c5a880] text-[#e8c882] bg-[#1a191f]' 
                : 'border-transparent text-[#9c9384] hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cartão & Gateways</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('como-funciona')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'como-funciona' 
                ? 'border-[#c5a880] text-[#e8c882] bg-[#1a191f]' 
                : 'border-transparent text-[#9c9384] hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Como Funciona?</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: PIX DIRETO */}
          {activeTab === 'pix' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#18171d] border border-[#c5a880]/30 flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#e8c882] shrink-0 mt-0.5" />
                <div className="text-xs text-[#ded8cb]">
                  <p className="font-bold text-[#faf7f2] mb-1">Como o PIX cai na sua conta?</p>
                  <p className="text-[#a89f91]">
                    Quando o cliente finaliza o pedido, o site gera o <strong>QR Code e a chave Copia e Cola oficiais com os seus dados bancários</strong>. O cliente paga pelo banco dele e o valor entra <strong>imediatamente na sua conta corrente ou poupança</strong>, sem taxa e sem intermediários!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Tipo de Chave */}
                <div>
                  <label className="block text-[#9c9384] mb-1 font-medium">Tipo de Chave PIX</label>
                  <select
                    value={config.pixKeyType}
                    onChange={(e) => setConfig({ ...config, pixKeyType: e.target.value as any })}
                    className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                  >
                    <option value="email">E-mail</option>
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="telefone">Celular / Telefone</option>
                    <option value="aleatoria">Chave Aleatória (EVP)</option>
                  </select>
                </div>

                {/* Chave PIX */}
                <div>
                  <label className="block text-[#9c9384] mb-1 font-medium">Sua Chave PIX</label>
                  <input
                    type="text"
                    required
                    value={config.pixKey}
                    onChange={(e) => setConfig({ ...config, pixKey: e.target.value })}
                    placeholder="Ex: stopacontato@gmail.com ou CPF"
                    className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                  />
                </div>

                {/* Nome do Beneficiário */}
                <div>
                  <label className="block text-[#9c9384] mb-1 font-medium">Nome do Titular da Conta (como no banco)</label>
                  <input
                    type="text"
                    required
                    value={config.beneficiaryName}
                    onChange={(e) => setConfig({ ...config, beneficiaryName: e.target.value })}
                    placeholder="Ex: SEU NOME COMPLETO OU RAZÃO SOCIAL"
                    className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none uppercase"
                  />
                </div>

                {/* Banco */}
                <div>
                  <label className="block text-[#9c9384] mb-1 font-medium">Seu Banco / Instituição</label>
                  <input
                    type="text"
                    value={config.bankName}
                    onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                    placeholder="Ex: Nubank, Inter, Itaú, Bradesco..."
                    className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-[#9c9384] mb-1 font-medium">Cidade da Conta</label>
                  <input
                    type="text"
                    required
                    value={config.city}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    placeholder="Ex: SAO PAULO"
                    className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none uppercase"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-[#9c9384] mb-1 font-medium">WhatsApp para Receber Comprovantes</label>
                  <input
                    type="tel"
                    required
                    value={config.whatsappNumber}
                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                    placeholder="Ex: 5511999999999 (com DDD)"
                    className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GATEWAY / CARTÃO */}
          {activeTab === 'gateway' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#18171d] border border-[#2d2a23] space-y-2">
                <p className="font-bold text-[#faf7f2] text-sm">Como receber pagamentos no Cartão de Crédito?</p>
                <p className="text-[#a89f91] leading-relaxed">
                  Para vendas no cartão de crédito com parcelamento em até 10x ou 12x, você pode usar um intermediador de pagamentos seguro como <strong>Mercado Pago, Asaas, PagBank, Appmax ou Stripe</strong>:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-[#ded8cb] pl-1">
                  <li>Você cria uma conta gratuita no <strong>Mercado Pago</strong> (mercadopago.com.br);</li>
                  <li>Cadastra os dados da sua conta bancária corrente para recebimento automático;</li>
                  <li>No menu <em>Seu Negócio &gt; Configurações &gt; Credenciais</em>, você copia sua chave pública;</li>
                  <li>O dinheiro das vendas cai no Mercado Pago e você faz PIX/Transferência para a sua conta bancária quando quiser (ou programa saque automático diário).</li>
                </ol>
              </div>

              <div>
                <label className="block text-[#9c9384] mb-1.5 font-medium">Provedor de Gateway Selecionado</label>
                <select
                  value={config.gatewayProvider}
                  onChange={(e) => setConfig({ ...config, gatewayProvider: e.target.value as any })}
                  className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none"
                >
                  <option value="manual">Modo Direto (PIX na Conta + Confirmação no WhatsApp)</option>
                  <option value="mercadopago">Mercado Pago (Cartão em 10x + PIX Automático)</option>
                  <option value="asaas">Asaas (Boletos, Cartão e PIX com split bancário)</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              {config.gatewayProvider === 'mercadopago' && (
                <div>
                  <label className="block text-[#9c9384] mb-1 font-medium">Public Key do Mercado Pago (Opcional)</label>
                  <input
                    type="text"
                    value={config.mercadoPagoPublicKey || ''}
                    onChange={(e) => setConfig({ ...config, mercadoPagoPublicKey: e.target.value })}
                    placeholder="APP_USR-xxxxxxxx-xxxx-xxxx..."
                    className="w-full bg-[#17161b] border border-[#2d2a23] rounded p-2.5 text-[#faf7f2] focus:border-[#c5a880] focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-[#70695d] mt-1">
                    Encontrada em mercadopago.com.br/developers/panel/app
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMO FUNCIONA */}
          {activeTab === 'como-funciona' && (
            <div className="space-y-4 text-xs text-[#ded8cb]">
              <div className="p-4 rounded-xl bg-[#18171d] border border-[#2d2a23] space-y-3">
                <h4 className="font-serif font-bold text-base text-[#faf7f2]">
                  Passo a Passo das Vendas na sua Loja:
                </h4>
                
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[#141318] border border-[#252328]">
                    <p className="font-bold text-[#e8c882]">1. Cliente escolhe os perfumes</p>
                    <p className="text-[#a89f91]">Ele adiciona os frascos no carrinho, calcula o frete e vai para o checkout.</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141318] border border-[#252328]">
                    <p className="font-bold text-[#e8c882]">2. Geração do PIX no valor exato</p>
                    <p className="text-[#a89f91]">O sistema gera o QR Code e o código Copia e Cola configurados com a sua Chave PIX cadastrada.</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141318] border border-[#252328]">
                    <p className="font-bold text-[#e8c882]">3. O dinheiro entra na sua conta</p>
                    <p className="text-[#a89f91]">O cliente paga no app do banco dele. O dinheiro entra imediatamente na sua conta bancária (Nubank, Itaú, Inter, etc.).</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141318] border border-[#252328]">
                    <p className="font-bold text-[#e8c882]">4. Notificação no seu WhatsApp</p>
                    <p className="text-[#a89f91]">O cliente clica em "Receber atualizações no WhatsApp" e você recebe no seu celular a lista de itens, endereço de entrega e comprovante.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action */}
          <div className="pt-4 border-t border-[#24221f] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#a89f91]">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Configurações salvas de forma segura no seu navegador</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded text-xs text-[#9c9384] hover:text-white border border-[#2d2a23] transition-colors"
              >
                Fechar
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#c5a880] to-[#e6ca95] text-black font-bold text-xs uppercase tracking-wider rounded transition-all hover:brightness-110 flex items-center justify-center gap-2"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Dados Salvos!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Dados Bancários</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
