import React, { useState, useEffect } from 'react';
import { PageView, Product, CartItem } from './types/perfume';
import { PERFUMES_DATA } from './data/perfumesData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryCards } from './components/CategoryCards';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ImportadosPage } from './components/ImportadosPage';
import { ArabesPage } from './components/ArabesPage';
import { Lab8Page } from './components/Lab8Page';
import { OfertasPage } from './components/OfertasPage';
import { BrandsPage } from './components/BrandsPage';
import { FeedbacksPage } from './components/FeedbacksPage';
import { HomeFeedbacksPreview } from './components/HomeFeedbacksPreview';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ConfidenceSection } from './components/ConfidenceSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { InstitutionalModal } from './components/InstitutionalModal';
import { StorySection } from './components/StorySection';
import { PaymentSettingsModal } from './components/PaymentSettingsModal';
import { LogoSettingsModal } from './components/LogoSettingsModal';
import { ProductEditModal } from './components/ProductEditModal';
import { BannerImageEditModal, BannerEditTarget } from './components/BannerImageEditModal';
import { DownloadCatalogModal } from './components/DownloadCatalogModal';
import { BrandConfig, getBrandConfig } from './config/brandConfig';
import { getStorePaymentConfig } from './config/paymentConfig';
import { getCustomizedProducts } from './config/productsCustomization';

// One-time cleanup of dev data to start clean model 0
const STORE_RESET_KEY = 'arfragrance_clean_zero_v1';
if (typeof window !== 'undefined') {
  try {
    if (!localStorage.getItem(STORE_RESET_KEY)) {
      localStorage.removeItem('arfragrance_cart');
      localStorage.removeItem('lelixir_cart');
      localStorage.removeItem('arfragrance_wishlist');
      localStorage.removeItem('lelixir_wishlist');
      localStorage.removeItem('arfragrance_orders');
      localStorage.removeItem('arfragrance_profile');
      localStorage.setItem(STORE_RESET_KEY, 'true');
    }
  } catch (err) {
    console.error(err);
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => getBrandConfig());
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('arfragrance_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arfragrance_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [productsList, setProductsList] = useState<Product[]>(() => getCustomizedProducts());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<'pedidos' | 'favoritos' | 'perfil'>('pedidos');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentSettingsOpen, setIsPaymentSettingsOpen] = useState(false);
  const [isLogoSettingsOpen, setIsLogoSettingsOpen] = useState(false);
  const [isDownloadCatalogOpen, setIsDownloadCatalogOpen] = useState(false);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [productToEditId, setProductToEditId] = useState<string | null>(null);
  const [bannerEditTarget, setBannerEditTarget] = useState<BannerEditTarget | null>(null);
  const [institutionalType, setInstitutionalType] = useState<'privacidade' | 'termos' | 'trocas' | 'atendimento' | 'historia' | null>(null);

  // Open banner or collection card editor
  const handleOpenCollectionEditor = (collectionId: 'importados' | 'arabes' | 'lab8', title: string) => {
    setBannerEditTarget({
      type: 'collection',
      id: collectionId,
      title: `Coleção: ${title}`
    });
  };

  const handleOpenSlideEditor = (slideId: string, title: string, currentImg: string) => {
    setBannerEditTarget({
      type: 'hero',
      id: slideId,
      title: `Banner: ${title}`,
      currentImageUrl: currentImg
    });
  };

  // Open product editor for all or specific perfume
  const handleOpenProductEditor = (product?: Product) => {
    setProductToEditId(product ? product.id : null);
    setIsProductEditorOpen(true);
  };

  const handleRefreshProducts = () => {
    const updated = getCustomizedProducts();
    setProductsList([...updated]);
    if (selectedProduct) {
      const found = updated.find(p => p.id === selectedProduct.id);
      if (found) setSelectedProduct({ ...found });
    }
  };

  // Sync products when customization changes
  useEffect(() => {
    const handleProductsUpdated = () => {
      const updated = getCustomizedProducts();
      setProductsList([...updated]);
      if (selectedProduct) {
        const found = updated.find(p => p.id === selectedProduct.id);
        if (found) setSelectedProduct({ ...found });
      }
    };

    window.addEventListener('arfragrance_products_updated', handleProductsUpdated);
    return () => window.removeEventListener('arfragrance_products_updated', handleProductsUpdated);
  }, [selectedProduct]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('arfragrance_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('arfragrance_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Ação global do botão COMPRAR (usando handleAddToCart como referência):
  // Em vez de abrir o CartDrawer, dispara a URL do WhatsApp com a mensagem solicitada
  const handleAddToCart = (product: Product, _size?: string, _quantity: number = 1) => {
    const config = getStorePaymentConfig();
    const cleanPhone = (config.whatsappNumber || '5511987654321').replace(/\D/g, '') || '5511987654321';
    const message = `Olá, tenho interesse no perfume ${product.name}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Buy now (WhatsApp ou checkout direto)
  const handleBuyNow = (product: Product, _size: string, _quantity: number) => {
    handleAddToCart(product);
    setSelectedProduct(null);
  };

  // Update quantity in cart
  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === size) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  // Remove from cart
  const handleRemoveItem = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size)
    ));
  };

  // Navigation helper
  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart total count
  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist product items
  const wishlistProducts = productsList.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0d] text-[#ede8df]">
      {/* Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartTotalItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => {
          setAccountInitialTab('pedidos');
          setIsAccountOpen(true);
        }}
        onOpenWishlist={() => {
          setAccountInitialTab('favoritos');
          setIsAccountOpen(true);
        }}
        onOpenPaymentSettings={() => setIsPaymentSettingsOpen(true)}
        brandConfig={brandConfig}
        onOpenLogoSettings={() => setIsLogoSettingsOpen(true)}
        onOpenProductEditor={() => handleOpenProductEditor()}
        onOpenDownloadCatalog={() => setIsDownloadCatalogOpen(true)}
      />

      {/* Main Content Pages */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <HeroSection 
              onNavigate={handleNavigate} 
              onEditSlide={handleOpenSlideEditor}
            />
            <CategoryCards 
              onNavigate={handleNavigate} 
              onEditCollection={handleOpenCollectionEditor}
            />
            <FeaturedProducts
              products={productsList}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={setSelectedProduct}
              onEditProduct={handleOpenProductEditor}
            />
            <StorySection onOpenModal={() => setInstitutionalType('historia')} />
            <HomeFeedbacksPreview onNavigate={handleNavigate} />
          </>
        )}

        {currentPage === 'importados' && (
          <ImportadosPage
            products={productsList}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onEditProduct={handleOpenProductEditor}
          />
        )}

        {currentPage === 'arabes' && (
          <ArabesPage
            products={productsList}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onEditProduct={handleOpenProductEditor}
          />
        )}

        {currentPage === 'lab8' && (
          <Lab8Page
            products={productsList}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onEditProduct={handleOpenProductEditor}
          />
        )}

        {currentPage === 'ofertas' && (
          <OfertasPage
            products={productsList}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onEditProduct={handleOpenProductEditor}
          />
        )}

        {currentPage === 'brands' && (
          <BrandsPage
            products={productsList}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            onEditProduct={handleOpenProductEditor}
          />
        )}

        {currentPage === 'feedbacks' && (
          <FeedbacksPage
            onNavigate={handleNavigate}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {/* Confidence / Trust Section */}
        <ConfidenceSection />

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenPrivacyModal={(type) => setInstitutionalType(type)}
        onOpenPaymentSettings={() => setIsPaymentSettingsOpen(true)}
        brandConfig={brandConfig}
        onOpenLogoSettings={() => setIsLogoSettingsOpen(true)}
        onOpenProductEditor={() => handleOpenProductEditor()}
        onOpenDownloadCatalog={() => setIsDownloadCatalogOpen(true)}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        allProducts={productsList}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onSelectRelated={(prod) => setSelectedProduct(prod)}
        onEditProduct={handleOpenProductEditor}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={productsList}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Account / Wishlist Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        wishlistProducts={wishlistProducts}
        onSelectProduct={(p) => setSelectedProduct(p)}
        initialTab={accountInitialTab}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderCompleted={() => setCartItems([])}
      />

      {/* Institutional Legal & Help Modal */}
      <InstitutionalModal
        type={institutionalType}
        onClose={() => setInstitutionalType(null)}
      />

      {/* Store Owner Bank & Payment Settings Modal */}
      <PaymentSettingsModal
        isOpen={isPaymentSettingsOpen}
        onClose={() => setIsPaymentSettingsOpen(false)}
        onConfigSaved={() => {}}
      />

      {/* Brand & Logo Settings Modal */}
      <LogoSettingsModal
        isOpen={isLogoSettingsOpen}
        onClose={() => setIsLogoSettingsOpen(false)}
        onBrandUpdated={() => setBrandConfig(getBrandConfig())}
      />

      {/* Product Edit Modal (Foto, Valor, Descrição) */}
      <ProductEditModal
        isOpen={isProductEditorOpen}
        onClose={() => setIsProductEditorOpen(false)}
        products={productsList}
        initialProductId={productToEditId}
        onProductUpdated={handleRefreshProducts}
      />

      {/* Banner & Collection Card Image Edit Modal */}
      <BannerImageEditModal
        isOpen={Boolean(bannerEditTarget)}
        onClose={() => setBannerEditTarget(null)}
        target={bannerEditTarget}
        onSaved={() => setBannerEditTarget(null)}
      />

      {/* Download Catalog PDF Modal */}
      <DownloadCatalogModal
        isOpen={isDownloadCatalogOpen}
        onClose={() => setIsDownloadCatalogOpen(false)}
        products={productsList}
        brandConfig={brandConfig}
        paymentConfig={getStorePaymentConfig()}
      />
    </div>
  );
}
