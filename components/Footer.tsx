import React from 'react';
import { 
  Instagram, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Clock, 
  CreditCard,
  Paintbrush,
  Pencil
} from 'lucide-react';
import { PageView } from '../types/perfume';
import { BrandConfig, getBrandFontClasses } from '../config/brandConfig';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { getStorePaymentConfig } from '../config/paymentConfig';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenPrivacyModal?: (type: 'privacidade' | 'termos' | 'trocas' | 'atendimento' | 'historia') => void;
  onOpenPaymentSettings?: () => void;
  brandConfig?: BrandConfig;
  onOpenLogoSettings?: () => void;
  onOpenProductEditor?: () => void;
  onOpenDownloadCatalog?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenPrivacyModal, 
  onOpenPaymentSettings,
  brandConfig,
  onOpenLogoSettings,
  onOpenProductEditor,
  onOpenDownloadCatalog
}) => {
  const logoSrc = (brandConfig?.logoUrl && brandConfig.logoUrl.trim() !== '') ? brandConfig.logoUrl : '/logo.png';
  const brandName = brandConfig?.brandName || "AR Fragrance";
  const tagline = brandConfig?.tagline || "";
  const showRing = brandConfig?.showEmblemRing !== false;
  const fontClasses = getBrandFontClasses(brandConfig?.fontFamily);

  const handleInstitutionalClick = (type: 'privacidade' | 'termos' | 'trocas' | 'atendimento' | 'historia') => {
    if (onOpenPrivacyModal) {
      onOpenPrivacyModal(type);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#08080a] text-[#ded8cb] border-t border-[#21201e] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#21201e]">
          
          {/* Col 1 & 2: Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className={`relative w-12 h-12 rounded-full shrink-0 ${
                showRing 
                  ? 'p-[1.5px] bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#8a7322] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
                  : 'border border-[#3d382e]'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={logoSrc}
                    alt={brandName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                </div>
              </div>
              <div>
                <span className={`${fontClasses.nameClass} text-[#faf7f2] block leading-tight`}>
                  {brandName}
                </span>
                {tagline && tagline.trim() ? (
                  <span className={`${fontClasses.taglineClass} text-[#c5a880] uppercase mt-0.5 block font-light`}>
                    {tagline}
                  </span>
                ) : null}
              </div>
            </div>

            <p className="text-xs text-[#a89f91] font-light leading-relaxed max-w-sm">
              Sua curadoria definitiva em perfumaria de nicho, fragrâncias árabes de alta densidade e marcas consagradas. Inspirada no amor que deu origem ao nosso maior sonho: Asafe Ravi.
            </p>

            <button
              onClick={() => handleInstitutionalClick('historia')}
              className="inline-flex items-center gap-1.5 text-xs text-[#e8c882] hover:text-[#fff] transition-colors cursor-pointer"
            >
              <span className="font-serif italic text-sm">Conheça Nossa História &gt;</span>
            </button>

            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram da AR Fragrance"
                className="w-9 h-9 rounded-full bg-[#141418] border border-[#2d2a23] flex items-center justify-center text-[#ded8cb] hover:text-[#e8c882] hover:border-[#c5a880] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`https://wa.me/${(getStorePaymentConfig().whatsappNumber || '5511987654321').replace(/\D/g, '') || '5511987654321'}`} 
                target="_blank" 
                rel="noreferrer"
                aria-label="WhatsApp da AR Fragrance"
                className="w-9 h-9 rounded-full bg-[#141418] border border-[#2d2a23] flex items-center justify-center text-[#ded8cb] hover:text-[#25D366] hover:border-[#25D366] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Links Rápidos */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c882] mb-4">
              Coleções
            </h3>
            <ul className="space-y-2.5 text-xs text-[#a89f91]">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('ofertas')} 
                  className="hover:text-[#faf7f2] transition-colors text-left text-[#e8c882] font-medium"
                >
                  Ofertas & Descontos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('arabes')} 
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Perfumes Árabes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('brands')} 
                  className="hover:text-[#faf7f2] transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Brand Collection</span>
                  <span className="text-[9px] font-semibold text-[#e8c882] bg-[#c5a880]/20 border border-[#c5a880]/30 px-1 py-0.2 rounded">
                    Especial
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('importados')} 
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Perfumes Importados
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('lab8')} 
                  className="hover:text-[#faf7f2] transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Lab8</span>
                  <span className="text-[9px] font-semibold text-[#e8c882] bg-[#c5a880]/20 border border-[#c5a880]/30 px-1 py-0.2 rounded">
                    Novidade
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('feedbacks')} 
                  className="hover:text-[#e8c882] transition-colors text-left flex items-center gap-1.5 text-[#ded8cb]"
                >
                  <span>Feedbacks de Clientes</span>
                  <span className="text-[9px] font-semibold text-[#25d366] bg-[#25d366]/20 border border-[#25d366]/30 px-1 py-0.2 rounded">
                    37+ Reais
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Institucional & Atendimento */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c882] mb-4">
              Atendimento & Suporte
            </h3>
            <ul className="space-y-2.5 text-xs text-[#a89f91]">
              <li>
                <button 
                  onClick={() => handleInstitutionalClick('historia')} 
                  className="hover:text-[#e8c882] text-[#faf7f2] font-medium transition-colors text-left flex items-center gap-1.5"
                >
                  <span className="text-[#e8c882]">✨</span>
                  <span>Nossa História</span>
                  <span className="text-[9px] font-semibold text-[#e8c882] bg-[#c5a880]/20 border border-[#c5a880]/30 px-1 py-0.2 rounded">
                    Conheça
                  </span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInstitutionalClick('atendimento')} 
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Central de Atendimento
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInstitutionalClick('trocas')} 
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Trocas e Devoluções
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInstitutionalClick('privacidade')} 
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleInstitutionalClick('termos')} 
                  className="hover:text-[#faf7f2] transition-colors text-left"
                >
                  Termos de Uso
                </button>
              </li>
              {onOpenProductEditor && (
                <li className="pt-1">
                  <button 
                    onClick={onOpenProductEditor} 
                    className="text-[#ded8cb] hover:text-[#e8c882] transition-colors text-left flex items-center gap-1.5 font-medium"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#e8c882]" />
                    <span>Editar Perfumes (Fotos, Preços, Textos)</span>
                  </button>
                </li>
              )}
              {onOpenLogoSettings && (
                <li className="pt-0.5">
                  <button 
                    onClick={onOpenLogoSettings} 
                    className="text-[#ded8cb] hover:text-[#e8c882] transition-colors text-left flex items-center gap-1.5 font-medium"
                  >
                    <Paintbrush className="w-3.5 h-3.5 text-[#e8c882]" />
                    <span>Personalizar Logo & Marca</span>
                  </button>
                </li>
              )}
              <li>
                <span className="text-[#696256] block text-[11px] mt-2">
                  Seg a Sex: 09h às 19h | Sáb: 10h às 15h
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Informações de Contato */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c882] mb-4">
              Contato
            </h3>
            <ul className="space-y-3 text-xs text-[#a89f91]">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                <span>(11) 98765-4321</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                <span className="break-all">contato@arfragrance.com.br</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                <span>Loja 100% Online • Enviamos para todo o Brasil</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#706a5e]">
          <p>
            © {new Date().getFullYear()} AR Fragrance. Todos os direitos reservados. CNPJ: 45.892.120/0001-84.
          </p>

          {/* Payment Badges */}
          <div className="flex items-center gap-3 text-[#a89f91]">
            <span className="text-[10px] uppercase tracking-wider text-[#696256]">Formas de Pagamento:</span>
            <span className="px-2 py-1 bg-[#141418] border border-[#2b2823] rounded font-mono text-[10px] text-[#ded8cb]">
              PIX (-5%)
            </span>
            <span className="px-2 py-1 bg-[#141418] border border-[#2b2823] rounded text-[10px] text-[#ded8cb]">
              Visa
            </span>
            <span className="px-2 py-1 bg-[#141418] border border-[#2b2823] rounded text-[10px] text-[#ded8cb]">
              Mastercard
            </span>
            <span className="px-2 py-1 bg-[#141418] border border-[#2b2823] rounded text-[10px] text-[#ded8cb]">
              Elo
            </span>
            <span className="px-2 py-1 bg-[#141418] border border-[#2b2823] rounded text-[10px] text-[#ded8cb]">
              Boleto
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
