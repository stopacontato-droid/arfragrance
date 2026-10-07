import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Package, 
  Heart, 
  CheckCircle2, 
  ExternalLink,
  Save
} from 'lucide-react';
import { Product } from '../types/perfume';

export interface OrderRecord {
  id: string;
  date: string;
  status: string;
  total: number;
  items: string[];
  tracking: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onSelectProduct: (product: Product) => void;
  initialTab?: 'pedidos' | 'favoritos' | 'perfil';
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onSelectProduct,
  initialTab = 'pedidos'
}) => {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'favoritos' | 'perfil'>(initialTab);
  
  // Orders from real storage, defaulting to empty model 0
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('arfragrance_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Profile data from storage, defaulting to empty model 0
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('arfragrance_profile');
      return saved ? JSON.parse(saved) : {
        name: '',
        email: '',
        phone: '',
        address: ''
      };
    } catch {
      return {
        name: '',
        email: '',
        phone: '',
        address: ''
      };
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('arfragrance_orders');
        if (saved) setOrders(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('arfragrance_profile', JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#111115] border border-[#2e2a23] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-[#24221f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1c1a20] border border-[#3b362c] flex items-center justify-center text-[#e8c882]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#faf7f2]">
                Minha Conta
              </h2>
              <p className="text-xs text-[#a89f91]">
                {profile.name ? `Cliente: ${profile.name}` : 'Área do Cliente · Meus Pedidos & Favoritos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9c9384] hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#24221f] bg-[#141318]">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'pedidos' 
                ? 'border-[#c5a880] text-[#e8c882] bg-[#1a191f]' 
                : 'border-transparent text-[#9c9384] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Meus Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favoritos')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'favoritos' 
                ? 'border-[#c5a880] text-[#e8c882] bg-[#1a191f]' 
                : 'border-transparent text-[#9c9384] hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favoritos ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'perfil' 
                ? 'border-[#c5a880] text-[#e8c882] bg-[#1a191f]' 
                : 'border-transparent text-[#9c9384] hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Meus Dados</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* ORDERS TAB */}
          {activeTab === 'pedidos' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-[#9c9384]">
                  <Package className="w-10 h-10 text-[#3d3a33] mx-auto mb-2" />
                  <p className="text-sm text-[#ded8cb]">Nenhum pedido realizado ainda.</p>
                  <p className="text-xs text-[#6e675c] mt-1 max-w-sm mx-auto">
                    Assim que você finalizar suas compras, o histórico detalhado e o código de rastreamento aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-[#9c9384]">Histórico de pedidos e rastreamento Correios / Jadlog.</p>
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 rounded-xl bg-[#17161b] border border-[#272521] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#faf7f2]">{order.id}</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#d6cebe]">{order.items.join(', ')}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#23211d] text-xs">
                        <span className="text-[#9c9384]">Data: {order.date}</span>
                        <span className="font-semibold text-[#e8c882]">{formatPrice(order.total)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-[#787163]">
                        <span>Rastreio: <strong className="text-[#ded8cb] font-mono">{order.tracking}</strong></span>
                        <span className="text-[#c5a880] hover:underline cursor-pointer flex items-center gap-1">
                          Acompanhar envio <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'favoritos' && (
            <div>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 text-[#9c9384]">
                  <Heart className="w-10 h-10 text-[#3d3a33] mx-auto mb-2" />
                  <p className="text-sm text-[#ded8cb]">Sua lista de desejos está vazia.</p>
                  <p className="text-xs text-[#6e675c] mt-1">
                    Clique no coração nos produtos para salvá-los e acompanhá-los aqui.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="p-3 rounded-lg bg-[#17161b] border border-[#272521] hover:border-[#c5a880] cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      {(p.images?.[0] || p.image) ? (
                        <img src={p.images?.[0] || p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#222] border border-[#302d28] flex items-center justify-center text-xs text-[#787163]">
                          AR
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase text-[#c5a880] truncate">{p.brand}</p>
                        <p className="text-xs font-serif text-[#faf7f2] truncate">{p.name}</p>
                        <p className="text-xs font-bold text-[#e8c882] mt-0.5">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'perfil' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9c9384] mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full bg-[#18171d] border border-[#2d2b25] focus:border-[#c5a880] focus:outline-none rounded p-2.5 text-[#faf7f2]"
                  />
                </div>
                <div>
                  <label className="block text-[#9c9384] mb-1">E-mail</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="seu.email@exemplo.com"
                    className="w-full bg-[#18171d] border border-[#2d2b25] focus:border-[#c5a880] focus:outline-none rounded p-2.5 text-[#faf7f2]"
                  />
                </div>
                <div>
                  <label className="block text-[#9c9384] mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-[#18171d] border border-[#2d2b25] focus:border-[#c5a880] focus:outline-none rounded p-2.5 text-[#faf7f2]"
                  />
                </div>
                <div>
                  <label className="block text-[#9c9384] mb-1">Endereço de Entrega</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Rua, número, complemento, bairro, cidade - UF"
                    className="w-full bg-[#18171d] border border-[#2d2b25] focus:border-[#c5a880] focus:outline-none rounded p-2.5 text-[#faf7f2]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c5a880] hover:bg-[#d8bc94] text-black font-semibold rounded text-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Dados</span>
                </button>
              </div>

              {savedSuccess && (
                <p className="text-emerald-400 text-xs text-right animate-in fade-in">
                  Dados salvos com sucesso!
                </p>
              )}

              <div className="p-4 rounded-lg bg-[#18171c] border border-[#c5a880]/30 flex items-center justify-between mt-4">
                <div>
                  <p className="font-semibold text-[#faf7f2]">Programa VIP AR Fragrance</p>
                  <p className="text-[#a89f91]">0 pontos acumulados · Suas compras acumulam pontos para resgate de fragrâncias exclusivas.</p>
                </div>
                <span className="px-3 py-1 bg-[#26242a] text-[#c5a880] font-bold text-[10px] rounded uppercase border border-[#3d382e]">
                  Membro
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
