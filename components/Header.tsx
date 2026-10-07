import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Heart, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight,
  Paintbrush,
  Pencil
} from 'lucide-react';
import { PageView } from '../types/perfume';
import { BrandConfig, getBrandFontClasses } from '../config/brandConfig';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenWishlist: () => void;
  onOpenPaymentSettings?: () => void;
  brandConfig?: BrandConfig;
  onOpenLogoSettings?: () => void;
  onOpenProductEditor?: () => void;
  onOpenDownloadCatalog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onOpenWishlist,
  onOpenPaymentSettings,
  brandConfig,
  onOpenLogoSettings,
  onOpenProductEditor,
  onOpenDownloadCatalog
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoSrc = (brandConfig?.logoUrl && brandConfig.logoUrl.trim() !== '') ? brandConfig.logoUrl : '/logo.png';
  const brandName = brandConfig?.brandName || "AR Fragrance";
  const tagline = brandConfig?.tagline || "";
  const fontClasses = getBrandFontClasses(brandConfig?.fontFamily);

  const navItems: { label: React.ReactNode; page: PageView; badge?: string; mobileLabel?: string }[] = [
    { label: 'Início', page: 'home', mobileLabel: 'Início' },
    { label: 'Ofertas', page: 'ofertas', mobileLabel: 'Ofertas' },
    { label: 'Árabes', page: 'arabes', mobileLabel: 'Árabes' },
    { 
      label: (
        <span className="inline-flex flex-col items-center justify-center text-center -my-1 py-0.5">
          <span className="text-[13px] tracking-wide leading-tight">
            Brand
          </span>
          <span className="text-[11px] tracking-wide leading-tight">
            Collection
          </span>
        </span>
      ), 
      page: 'brands',
      mobileLabel: 'Brand Collection'
    },
    { label: 'Importados', page: 'importados', mobileLabel: 'Importados' },
    { label: 'Lab8', page: 'lab8', badge: 'Novidade', mobileLabel: 'Lab8' },
    { label: 'Feedbacks', page: 'feedbacks', badge: '37+', mobileLabel: 'Feedbacks' }
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0c0c0e]/95 border-b border-[#262522]">
      {/* Top Notification Bar */}
      <div className="bg-[#101013] border-b border-[#21201d] text-[#c4bcae] text-xs py-2 px-4 text-center font-normal flex items-center justify-between sm:justify-center relative gap-3">
        <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
          <span className="inline-flex items-center text-xs text-[#ded8cb]">
            <span>Frete Grátis para todo o Brasil acima de R$ 299</span>
          </span>
          <span className="hidden sm:inline text-[#4a463e]">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[#a8a194]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9c9384]" />
            <span>100% Originais com Selo de Autenticidade</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0 sm:absolute sm:right-4">
          {onOpenProductEditor && (
            <button
              onClick={onOpenProductEditor}
              title="Trocar descrição, foto e valor dos perfumes"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#ded8cb] hover:text-white bg-[#17161b] hover:bg-[#222127] px-2.5 py-0.5 rounded border border-[#33302a] transition-colors font-normal cursor-pointer"
            >
              <Pencil className="w-3 h-3 text-[#9c9384]" />
              <span>Editar Perfumes</span>
            </button>
          )}

          {onOpenLogoSettings && (
            <button
              onClick={onOpenLogoSettings}
              title="Personalizar logo da loja ou fazer upload"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#ded8cb] hover:text-white bg-[#17161b] hover:bg-[#222127] px-2.5 py-0.5 rounded border border-[#33302a] transition-colors font-normal cursor-pointer"
            >
              <Paintbrush className="w-3 h-3 text-[#9c9384]" />
              <span>Alterar Logo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger + Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu de navegação"
            className="lg:hidden p-2 text-[#e8e4dc] hover:text-[#d4af37] transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo with Emblem Image */}
          <button 
            onClick={() => handleNavClick('home')}
            className="text-left group focus:outline-none flex items-center gap-3"
          >
            <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full shrink-0 border border-[#33302a] transition-all duration-300`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={logoSrc}
                  alt={brandName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>

              {onOpenLogoSettings && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLogoSettings();
                  }}
                  title="Alterar Logo da Loja"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1b1a20] border border-[#c5a880] text-[#e8c882] flex items-center justify-center shadow-lg opacity-85 hover:opacity-100 hover:scale-110 transition-all cursor-pointer z-10"
                >
                  <Pencil className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className={`${fontClasses.nameClass} text-[#f9f7f2] group-hover:text-white transition-colors leading-[1.12] whitespace-nowrap`}>
                {brandName || 'AR Fragrance'}
              </span>
              <span className={`${fontClasses.taglineClass} text-[#a8a092] group-hover:text-[#ded8cb] uppercase transition-colors mt-0.5 whitespace-nowrap`}>
                {(tagline && tagline.trim()) ? tagline : "SEU PERFUME ESTÁ AQUI."}
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`text-[13.5px] xl:text-sm tracking-wide transition-all relative px-2.5 xl:px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#151419]/60 ${
                  isActive 
                    ? 'text-[#e8c882] font-medium' 
                    : 'text-[#d6d0c4] hover:text-[#e8c882]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9.5px] tracking-wider font-semibold uppercase bg-[#c5a880]/20 text-[#e8c882] border border-[#c5a880]/40 px-1.5 py-0.5 rounded-full shadow-sm shrink-0">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search button */}
          <button
            onClick={onOpenSearch}
            aria-label="Pesquisar perfumes"
            className="p-2.5 rounded-full text-[#d6d0c4] hover:text-[#e8c882] hover:bg-[#1a1917] transition-colors focus:outline-none"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            aria-label="Lista de desejos"
            className="p-2.5 rounded-full text-[#d6d0c4] hover:text-[#e8c882] hover:bg-[#1a1917] transition-colors relative focus:outline-none hidden sm:flex"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#d4af37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            onClick={onOpenAccount}
            aria-label="Minha conta"
            className="p-2.5 rounded-full text-[#d6d0c4] hover:text-[#e8c882] hover:bg-[#1a1917] transition-colors focus:outline-none"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            aria-label="Carrinho de compras"
            className="p-2.5 rounded-full text-[#d6d0c4] hover:text-[#e8c882] hover:bg-[#1a1917] transition-colors relative focus:outline-none"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-gradient-to-r from-[#e8c882] to-[#c5a880] text-black text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Call to action "Comprar agora" */}
          <button
            onClick={() => handleNavClick('importados')}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#c5a880] to-[#e6ca95] text-[#0d0d0f] font-semibold text-xs uppercase tracking-wider rounded-md hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
          >
            <span>Comprar agora</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Hamburger Drawer / Accordion */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111114] border-b border-[#282725] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center justify-between py-2 text-base text-left transition-colors ${
                    isActive 
                      ? 'text-[#e8c882] font-semibold' 
                      : 'text-[#d6d0c4] hover:text-[#e8c882]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{item.mobileLabel || item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] tracking-wider font-semibold uppercase bg-[#c5a880]/20 text-[#e8c882] border border-[#c5a880]/40 px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#756f64]" />
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#262523] flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 py-2 text-sm text-[#d6d0c4] hover:text-[#e8c882]"
            >
              <Heart className="w-4 h-4" />
              <span>Favoritos ({wishlistCount})</span>
            </button>
            <button
              onClick={() => {
                onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 py-2 text-sm text-[#d6d0c4] hover:text-[#e8c882]"
            >
              <User className="w-4 h-4" />
              <span>Minha Conta</span>
            </button>
            {onOpenProductEditor && (
              <button
                onClick={() => {
                  onOpenProductEditor();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-sm text-[#e8c882] hover:text-white"
              >
                <Pencil className="w-4 h-4 text-[#e8c882]" />
                <span>Editar Perfumes (Foto, Preço, Descrição)</span>
              </button>
            )}
            {onOpenLogoSettings && (
              <button
                onClick={() => {
                  onOpenLogoSettings();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-sm text-[#e8c882] hover:text-white"
              >
                <Paintbrush className="w-4 h-4 text-[#e8c882]" />
                <span>Personalizar Logo da Loja</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('importados')}
              className="w-full mt-2 py-3 bg-gradient-to-r from-[#c5a880] to-[#e6ca95] text-black font-semibold text-xs uppercase tracking-wider rounded-md text-center"
            >
              Comprar agora
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
