import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquareQuote,
  Flame,
  Clock,
  ChevronRight,
  UserCheck,
  Check
} from 'lucide-react';
import { CustomerFeedback, FEEDBACKS_DATA, FEEDBACK_STATS } from '../data/feedbacksData';
import { Product, PageView } from '../types/perfume';
import { PERFUMES_DATA } from '../data/perfumesData';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { getStorePaymentConfig } from '../config/paymentConfig';

interface FeedbacksPageProps {
  onNavigate: (page: PageView) => void;
  onSelectProduct?: (product: Product) => void;
}

type FeedbackFilterCategory = 'all' | 'arabes' | 'importados' | 'decantes' | 'fixacao' | 'atendimento';

export const FeedbacksPage: React.FC<FeedbacksPageProps> = ({
  onNavigate,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FeedbackFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalFeedback, setActiveModalFeedback] = useState<CustomerFeedback | null>(null);

  const paymentConfig = getStorePaymentConfig();
  const whatsappNumber = paymentConfig.whatsappNumber || '5511999999999';

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    return FEEDBACKS_DATA.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = item.customerName.toLowerCase().includes(query);
        const matchPerfume = item.perfumeMentioned.toLowerCase().includes(query);
        const matchMessage = item.message.toLowerCase().includes(query);
        const matchQuote = item.highlightQuote.toLowerCase().includes(query);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(query));
        return matchName || matchPerfume || matchMessage || matchQuote || matchTag;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenProduct = (perfumeName: string) => {
    if (!onSelectProduct) return;
    const cleanName = perfumeName.toLowerCase();
    const found = PERFUMES_DATA.find(p => 
      cleanName.includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(cleanName.split(' ')[0]) ||
      cleanName.includes(p.brand.toLowerCase())
    );
    if (found) {
      onSelectProduct(found);
    }
  };

  const categories: { id: FeedbackFilterCategory; label: string; icon?: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'Todos os Depoimentos', count: FEEDBACKS_DATA.length },
    { id: 'arabes', label: 'Perfumes Árabes', count: FEEDBACKS_DATA.filter(f => f.category === 'arabes').length },
    { id: 'importados', label: 'Perfumes Importados', count: FEEDBACKS_DATA.filter(f => f.category === 'importados').length },
    { id: 'decantes', label: 'Decantes Fracionados', count: FEEDBACKS_DATA.filter(f => f.category === 'decantes').length },
    { id: 'fixacao', label: 'Fixação & Elogios', icon: <Flame className="w-3.5 h-3.5 text-[#e8c882]" />, count: FEEDBACKS_DATA.filter(f => f.category === 'fixacao').length },
    { id: 'atendimento', label: 'Atendimento & Rapidez', count: FEEDBACKS_DATA.filter(f => f.category === 'atendimento').length }
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f2ede4] pb-24 pt-6 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#8e8577] mb-6">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-[#ded8cb] transition-colors"
          >
            Início
          </button>
          <span>/</span>
          <span className="text-[#e8c882] font-medium">Depoimentos dos Clientes</span>
        </div>

        {/* Hero Header Section - Clean & Natural */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16151b] via-[#111015] to-[#0d0c10] border border-[#2b2720] p-6 sm:p-10 mb-8 shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1c16] border border-[#c5a880]/30 text-xs font-semibold text-[#e8c882] uppercase tracking-wider mb-4">
              <UserCheck className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Avaliações Reais de Clientes no WhatsApp</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#faf7f2] tracking-tight leading-[1.18] mb-3">
              Experiências reais de quem compra na{' '}
              <span className="text-[#e8c882]">AR Fragrance</span>
            </h1>

            <p className="text-sm sm:text-base text-[#a8a194] leading-relaxed mb-6 font-light">
              Depoimentos autênticos enviados diretamente ao Gabriel pelo WhatsApp. Conversas sobre fixação duradoura, autenticidade dos perfumes árabes e importados e cuidado na entrega.
            </p>

            {/* Key Trust Stats - Clean Minimal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#0f0e13] border border-[#24211a]">
                <div className="flex items-center gap-1.5 text-xl font-bold text-[#faf7f2]">
                  <span>5.0</span>
                  <span className="text-[11px] font-semibold text-[#e8c882] tracking-wider uppercase ml-1">
                    Excelente
                  </span>
                </div>
                <div className="text-[11px] text-[#7d7568] mt-0.5">
                  Satisfação Média
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0f0e13] border border-[#24211a]">
                <div className="text-xl font-bold text-[#e8c882]">
                  {FEEDBACK_STATS.totalFeedbacks}+
                </div>
                <div className="text-[11px] text-[#7d7568] mt-0.5">
                  Clientes Verificados
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0f0e13] border border-[#24211a]">
                <div className="text-xl font-bold text-[#faf7f2]">
                  100%
                </div>
                <div className="text-[11px] text-[#7d7568] mt-0.5">
                  Fragrâncias Originais
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0f0e13] border border-[#24211a]">
                <div className="text-xl font-bold text-[#25d366]">
                  Nota 10
                </div>
                <div className="text-[11px] text-[#7d7568] mt-0.5">
                  Atendimento & Prazo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-3.5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8e8577] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por perfume (Asad, Yara, Invictus...) ou elogio..."
                className="w-full bg-[#131216] border border-[#26231c] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#ded8cb] placeholder-[#6b655b] focus:border-[#c5a880] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8e8577] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá Gabriel! Gostaria de enviar meu feedback sobre o perfume que recebi!')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#132219] hover:bg-[#1a2e22] border border-[#25d366]/40 text-xs font-semibold text-[#7ded9f] transition-colors shrink-0"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25d366]" />
              <span>Enviar Meu Depoimento</span>
            </a>
          </div>

          {/* Clean Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#221c13] border-[#c5a880] text-[#f5eedf] shadow-sm'
                      : 'bg-[#121116] border-[#24211a] text-[#8e8577] hover:text-[#ded8cb] hover:border-[#383329]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#c5a880] text-black font-semibold' : 'bg-[#1a1920] text-[#7d7568]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-[#7d7568] mb-5 px-1">
          <span>
            Mostrando <strong>{filteredFeedbacks.length}</strong> depoimentos verificados
          </span>
          {searchQuery && (
            <span>
              Filtrado por: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>

        {/* Clean, Non-Artificial Feedbacks Grid */}
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-[#121116] border border-[#24211a]">
            <p className="text-sm text-[#ded8cb] mb-1">Nenhum depoimento encontrado para este filtro.</p>
            <p className="text-xs text-[#7d7568] mb-4">Tente buscar por outro perfume ou limpar a busca.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#221c13] border border-[#c5a880]/40 text-xs font-semibold text-[#e8c882]"
            >
              Ver Todos os Depoimentos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredFeedbacks.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalFeedback(item)}
                className="group rounded-2xl bg-[#121116] border border-[#232019] hover:border-[#c5a880]/60 transition-all duration-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-black/40 cursor-pointer"
              >
                <div>
                  {/* Customer Header */}
                  <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-[#1c1a14]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#1b1920] border border-[#332f27] flex items-center justify-center text-xs font-bold text-[#e8c882] shrink-0">
                        {item.customerName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#faf7f2] truncate">
                            {item.customerName}
                          </span>
                          <span title="Cliente Verificado">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#25d366] shrink-0" />
                          </span>
                        </div>
                        <div className="text-[10px] text-[#7d7568] flex items-center gap-1">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-medium text-[#25d366] bg-[#0f1d14] px-2 py-0.5 rounded-full border border-[#25d366]/20 shrink-0">
                      <WhatsAppIcon className="w-3 h-3 text-[#25d366]" />
                      <span>WhatsApp</span>
                    </div>
                  </div>

                  {/* Rating + Category */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-[#e8c882]">
                      Nota 5.0
                    </span>
                    <span className="text-[9.5px] uppercase font-medium tracking-wider text-[#a89f91] bg-[#19171f] px-2 py-0.5 rounded border border-[#2b2732]">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* WhatsApp Natural Chat Balloon */}
                  <div className="rounded-xl bg-[#0f1418] border border-[#1d272d] p-3.5 mb-3.5 text-xs text-[#e1e7eb] leading-relaxed relative">
                    <p className="whitespace-pre-wrap font-normal text-[#e9edef]">
                      &ldquo;{item.message}&rdquo;
                    </p>

                    <div className="flex items-center justify-end gap-1 mt-2 text-[9px] text-[#53bdeb] font-mono">
                      <span>{item.time}</span>
                      <span>✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata (Perfume Name & Tags - Pure Text, No Images) */}
                <div className="pt-3 border-t border-[#1c1a14] space-y-2.5">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProduct(item.perfumeMentioned);
                    }}
                    className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-[#18161d] hover:bg-[#201d27] border border-[#26231c] transition-colors group/perfume"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[11px] font-medium text-[#f0ebe1] truncate group-hover/perfume:text-[#e8c882] transition-colors">
                        {item.perfumeMentioned}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#8e8577] group-hover/perfume:text-[#ded8cb] shrink-0 flex items-center gap-0.5 ml-2">
                      <span>Ver</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Clean Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] px-2 py-0.5 rounded-md bg-[#16151b] text-[#7d7568] border border-[#211f26]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clean Bottom WhatsApp Action */}
        <div className="mt-12 rounded-2xl bg-[#121116] border border-[#24211a] p-6 sm:p-8 text-center max-w-xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#25d366]/15 border border-[#25d366]/30 flex items-center justify-center mx-auto text-[#25d366]">
            <WhatsAppIcon className="w-5 h-5 text-[#25d366]" />
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#faf7f2]">
            Quer tirar dúvidas ou mandar seu feedback?
          </h3>

          <p className="text-xs text-[#8e8577] leading-relaxed max-w-md mx-auto">
            Fale diretamente com o Gabriel para consultoria olfativa, pedidos de decantes ou compartilhar sua experiência.
          </p>

          <div className="pt-1">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá Gabriel! Vim pelo site da AR Fragrance!')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-black font-semibold text-xs tracking-wider uppercase transition-colors shadow-md"
            >
              <WhatsAppIcon className="w-4 h-4 text-black" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* Modal - Clean & Authentic (Without artificial perfume bottle images) */}
      {activeModalFeedback && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModalFeedback(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#141318] border border-[#332e24] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#ded8cb] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModalFeedback(null)}
              className="absolute top-4 right-4 p-2 text-[#8e8577] hover:text-white rounded-full bg-[#1b1920] border border-[#2b2720] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Customer Header */}
            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="w-10 h-10 rounded-full bg-[#1e1c24] border border-[#383329] flex items-center justify-center text-sm font-bold text-[#e8c882]">
                {activeModalFeedback.customerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#faf7f2]">
                    {activeModalFeedback.customerName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#25d366] bg-[#0f1d14] px-1.5 py-0.2 rounded border border-[#25d366]/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verificado</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#7d7568]">
                  WhatsApp • {activeModalFeedback.date} às {activeModalFeedback.time}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#211f19]">
              <span className="text-xs font-semibold text-[#e8c882]">
                Avaliação: Nota 5.0
              </span>
              <span className="text-[10px] text-[#c5a880] uppercase tracking-wider font-medium">
                {activeModalFeedback.categoryLabel}
              </span>
            </div>

            {/* Full Message Bubble */}
            <div className="p-4 rounded-xl bg-[#0f1418] border border-[#1d272d] mb-5">
              <p className="text-sm text-[#e9edef] leading-relaxed whitespace-pre-wrap">
                &ldquo;{activeModalFeedback.message}&rdquo;
              </p>
              <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-[#53bdeb] font-mono">
                <span>{activeModalFeedback.time}</span>
                <span>✓✓</span>
              </div>
            </div>

            {/* Perfume Mentioned & Actions */}
            <div className="p-3.5 rounded-xl bg-[#1a1820] border border-[#2b2720] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#8e8577] block">
                  Fragrância Avaliada
                </span>
                <span className="text-xs font-semibold text-[#faf7f2]">
                  {activeModalFeedback.perfumeMentioned}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveModalFeedback(null);
                  handleOpenProduct(activeModalFeedback.perfumeMentioned);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#221c13] hover:bg-[#2b2418] border border-[#c5a880]/50 text-xs font-semibold text-[#e8c882] transition-colors cursor-pointer"
              >
                <span>Ver Perfume</span>
                <ArrowRight className="w-3 h-3 text-[#e8c882]" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
