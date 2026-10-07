import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Type,
  Sparkles,
  Feather
} from 'lucide-react';
import { 
  BrandConfig, 
  BrandFontId, 
  PerfumeTitleFontId,
  BRAND_FONT_OPTIONS, 
  getBrandConfig, 
  saveBrandConfig, 
  resetBrandConfig,
  getBrandFontClasses
} from '../config/brandConfig';
import { compressImageFile } from '../utils/imageCompressor';

interface LogoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrandUpdated: () => void;
}

type FilterCategory = 'all' | 'delicate' | 'classic' | 'modern';

export const LogoSettingsModal: React.FC<LogoSettingsModalProps> = ({
  isOpen,
  onClose,
  onBrandUpdated
}) => {
  const [config, setConfig] = useState<BrandConfig>(() => getBrandConfig());
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('delicate');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFonts = useMemo(() => {
    if (selectedFilter === 'all') return BRAND_FONT_OPTIONS;
    if (selectedFilter === 'delicate') {
      return BRAND_FONT_OPTIONS.filter(f => f.isDelicateRecommended || f.category === 'delicate');
    }
    return BRAND_FONT_OPTIONS.filter(f => f.category === selectedFilter);
  }, [selectedFilter]);

  if (!isOpen) return null;

  const currentFontClasses = getBrandFontClasses(config.fontFamily || 'cinzel');
  const activeFontObj = BRAND_FONT_OPTIONS.find(f => f.id === (config.fontFamily || 'cinzel')) || BRAND_FONT_OPTIONS[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Por favor, escolha uma imagem com até 8MB.');
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file, 320, 0.85);
      setConfig(prev => ({ ...prev, logoUrl: compressedDataUrl }));
    } catch (err) {
      console.warn('Erro ao comprimir imagem, fallback para leitor simples:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setConfig(prev => ({ ...prev, logoUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    saveBrandConfig(config);
    setIsSaved(true);
    onBrandUpdated();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    const def = resetBrandConfig();
    setConfig(def);
    onBrandUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-[#121115] border border-[#3b3425] rounded-2xl shadow-2xl p-5 sm:p-7 text-[#ece6dc] animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a89f91] hover:text-white rounded-full bg-[#1e1c22] border border-[#2d2a23] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 shrink-0 pr-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c5a880]/30 to-[#d4af37]/10 border border-[#c5a880] flex items-center justify-center text-[#e8c882] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
              <span>Personalizar Logo & Tipografia</span>
            </h2>
            <p className="text-xs text-[#a89f91]">
              Ajuste o emblema, nome e escolha estilos de fontes delicados e refinados
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-5 flex-1 custom-scrollbar">
          
          {/* Live Preview Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-[#18161d] to-[#121116] border border-[#2e2a22] shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-semibold text-[#c5a880] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Pré-visualização em Tempo Real</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#201d16] border border-[#c5a880]/40 text-[10px] text-[#e8c882]">
                <Feather className="w-3 h-3 text-[#c5a880]" />
                <span>Fonte: <strong>{activeFontObj.name}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0a0c] border border-[#262420]">
              <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 ${config.showEmblemRing ? 'p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#8a7322] shadow-[0_0_18px_rgba(212,175,55,0.25)]' : 'border border-[#3d382e]'} transition-all`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={(config.logoUrl && config.logoUrl.trim() !== '') ? config.logoUrl : '/logo.png'}
                    alt={config.brandName || "Logo"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className={`${currentFontClasses.nameClass} text-[#faf7f2] tracking-wide truncate leading-tight`}>
                  {config.brandName || "AR Fragrance"}
                </div>
                {config.tagline && config.tagline.trim() ? (
                  <div className={`${currentFontClasses.taglineClass} text-[#c5a880] uppercase font-light mt-0.5 tracking-[0.26em] truncate`}>
                    {config.tagline}
                  </div>
                ) : (
                  <div className={`${currentFontClasses.taglineClass} text-[#8f887b] uppercase font-light mt-0.5 tracking-[0.26em] truncate`}>
                    SEU PERFUME ESTÁ AQUI.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emblem & Text Fields */}
          <div className="space-y-3.5 p-4 rounded-xl bg-[#16151a] border border-[#262420]">
            <div>
              <label className="block text-xs font-medium text-[#ded8cb] mb-2">
                Emblema da Marca (Upload de Logo)
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, logoUrl: '/logo.png' }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[11px] font-medium transition-all ${
                    config.logoUrl === '/logo.png'
                      ? 'bg-[#292419] border-[#e8c882] text-[#e8c882]'
                      : 'bg-[#1a191f] border-[#2d2a23] text-[#ded8cb] hover:border-[#4d4637]'
                  }`}
                >
                  <span>Emblema AR Real</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, logoUrl: '/ar-fragrance-full.png' }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[11px] font-medium transition-all ${
                    config.logoUrl === '/ar-fragrance-full.png'
                      ? 'bg-[#292419] border-[#e8c882] text-[#e8c882]'
                      : 'bg-[#1a191f] border-[#2d2a23] text-[#ded8cb] hover:border-[#4d4637]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#e8c882]" />
                  <span>Logo Completa</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gradient-to-r from-[#2a241a] to-[#3a3020] hover:from-[#352c1e] hover:to-[#4a3e29] border border-[#c5a880]/50 text-[11px] font-semibold text-[#f5ebd7] transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#e8c882]" />
                  <span>Enviar Imagem</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-[#a89f91] mb-1">
                  Nome da Marca (Texto Principal)
                </label>
                <input
                  type="text"
                  value={config.brandName}
                  onChange={(e) => setConfig(prev => ({ ...prev, brandName: e.target.value }))}
                  className="w-full bg-[#111014] border border-[#332f27] rounded-lg px-3 py-2 text-xs text-[#ded8cb] focus:border-[#c5a880] focus:outline-none"
                  placeholder="Ex: AR Fragrance"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#a89f91] mb-1">
                  Slogan / Subtítulo
                </label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setConfig(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full bg-[#111014] border border-[#332f27] rounded-lg px-3 py-2 text-xs text-[#ded8cb] focus:border-[#c5a880] focus:outline-none"
                  placeholder="Ex: SEU PERFUME ESTÁ AQUI."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#222026]">
              <span className="text-xs text-[#ded8cb] flex items-center gap-1.5">
                <span>Aro de Realce Dourado no Emblema</span>
              </span>
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, showEmblemRing: !prev.showEmblemRing }))}
                className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  config.showEmblemRing ? 'bg-[#c5a880]' : 'bg-[#2b2930]'
                }`}
              >
                <div 
                  className={`w-4.5 h-4.5 rounded-full bg-black shadow transition-transform transform ${
                    config.showEmblemRing ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Typography Styles Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-[#f2ede4] flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[#c5a880]" />
                <span>Estilo de Tipografia (Fonte do Nome)</span>
              </label>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#17161c] p-1 rounded-lg border border-[#2b2720] text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('delicate')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    selectedFilter === 'delicate'
                      ? 'bg-[#2b2417] text-[#e8c882] font-semibold border border-[#c5a880]/40 shadow-sm'
                      : 'text-[#9c9384] hover:text-[#ded8cb]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#c5a880]" />
                  <span>✨ Mais Delicadas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedFilter === 'all'
                      ? 'bg-[#2b2417] text-[#e8c882] font-semibold border border-[#c5a880]/40 shadow-sm'
                      : 'text-[#9c9384] hover:text-[#ded8cb]'
                  }`}
                >
                  <span>Todas ({BRAND_FONT_OPTIONS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('classic')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedFilter === 'classic'
                      ? 'bg-[#2b2417] text-[#e8c882] font-semibold border border-[#c5a880]/40 shadow-sm'
                      : 'text-[#9c9384] hover:text-[#ded8cb]'
                  }`}
                >
                  <span>Clássicas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('modern')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedFilter === 'modern'
                      ? 'bg-[#2b2417] text-[#e8c882] font-semibold border border-[#c5a880]/40 shadow-sm'
                      : 'text-[#9c9384] hover:text-[#ded8cb]'
                  }`}
                >
                  <span>Clean</span>
                </button>
              </div>
            </div>

            {selectedFilter === 'delicate' && (
              <div className="p-2.5 rounded-lg bg-[#1a1712] border border-[#42371e] text-[11px] text-[#ded8cb] flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#e8c882] shrink-0" />
                <span>
                  <strong>Fontes delicadas e suaves:</strong> Traços esguios, harmonia natural e leveza inspirada na alta perfumaria europeia — sem peso excessivo e nada forçado.
                </span>
              </div>
            )}

            {/* Font Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredFonts.map((f) => {
                const isSelected = (config.fontFamily || 'cinzel') === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, fontFamily: f.id }))}
                    className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#231f17] to-[#181612] border-[#c5a880] text-[#faf7f2] shadow-md ring-1 ring-[#c5a880]/60'
                        : 'bg-[#151419] border-[#292620] text-[#b3aaa0] hover:border-[#4d4638] hover:bg-[#1a1920]'
                    }`}
                  >
                    {/* Top Row: Font Name & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2 w-full">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-[#f0ebe1]">
                          {f.name}
                        </span>
                        {f.isDelicateRecommended && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#2e2616] text-[#e8c882] border border-[#6b562a]">
                            ✨ Delicada
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#1d1c22] text-[#9c9384] border border-[#2b2a32]">
                          {f.badge}
                        </span>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#c5a880] text-black flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#3b362c] group-hover:border-[#635a46] shrink-0" />
                      )}
                    </div>

                    {/* Live Brand Name Sample Rendering */}
                    <div className="py-2.5 px-3 rounded-lg bg-[#0c0c0e] border border-[#23211c] mb-2 flex flex-col justify-center">
                      <span className={`${f.fontClass} text-xl sm:text-2xl text-[#f7f4ed] tracking-wide leading-none truncate group-hover:text-white transition-colors`}>
                        {config.brandName || "AR Fragrance"}
                      </span>
                      <span className={`${f.fontClass} text-[9px] text-[#c5a880] tracking-[0.24em] uppercase mt-1 truncate font-light`}>
                        {(config.tagline && config.tagline.trim()) ? config.tagline : 'SEU PERFUME ESTÁ AQUI.'}
                      </span>
                    </div>

                    {/* Bottom: Description */}
                    <div>
                      <p className="text-[10px] text-[#ded8cb] font-medium leading-tight mb-0.5">
                        {f.styleName}
                      </p>
                      <p className="text-[10px] text-[#8e8577] leading-relaxed line-clamp-2">
                        {f.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tipografia Elegante dos Nomes dos Perfumes (Cards & Vitrine) */}
          <div className="space-y-3 pt-4 border-t border-[#262420]">
            <div>
              <label className="text-xs font-semibold text-[#f2ede4] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#c5a880]" />
                <span>Tipografia dos Nomes dos Perfumes (Vitrine & Detalhes)</span>
              </label>
              <p className="text-[11px] text-[#a89f91] mt-0.5">
                Escolha a fonte exibida nos títulos de cada perfume nos cards e páginas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'cormorant' as PerfumeTitleFontId,
                  name: 'Cormorant Garamond',
                  badge: 'Parisiense & Delicada',
                  fontClass: 'perfume-name-cormorant',
                  desc: 'Serifas ultrafinas renascentistas, toque lírico e sem peso forçado',
                  sample: 'Club de Nuit Intense'
                },
                {
                  id: 'playfair' as PerfumeTitleFontId,
                  name: 'Playfair Display',
                  badge: 'Editorial Clássica',
                  fontClass: 'perfume-name-playfair',
                  desc: 'Contraste sofisticado de revista de moda, nobreza clássica',
                  sample: 'Baccarat Rouge 540'
                },
                {
                  id: 'marcellus' as PerfumeTitleFontId,
                  name: 'Marcellus',
                  badge: 'Romana Serena',
                  fontClass: 'perfume-name-marcellus',
                  desc: 'Equilíbrio clássico suave, serenidade limpa e harmônica',
                  sample: 'Asad Lattafa Pride'
                }
              ].map(opt => {
                const isSelected = (config.perfumeTitleFont || 'cormorant') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, perfumeTitleFont: opt.id }))}
                    className={`p-3 rounded-xl text-left transition-all border cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#231f17] to-[#181612] border-[#c5a880] text-[#faf7f2] shadow-md ring-1 ring-[#c5a880]/60'
                        : 'bg-[#151419] border-[#292620] text-[#b3aaa0] hover:border-[#4d4638] hover:bg-[#1a1920]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-xs font-semibold text-[#f0ebe1]">
                        {opt.name}
                      </span>
                      {isSelected ? (
                        <div className="w-4.5 h-4.5 rounded-full bg-[#c5a880] text-black flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border border-[#3b362c] shrink-0" />
                      )}
                    </div>

                    <div className="py-2 px-2.5 rounded-lg bg-[#0c0c0e] border border-[#23211c] mb-2">
                      <span className={`${opt.fontClass} text-base sm:text-lg text-[#faf7f2] block leading-tight truncate`}>
                        {opt.sample}
                      </span>
                      <span className="text-[9px] text-[#c5a880] font-sans font-medium block mt-0.5">
                        {opt.badge}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#8e8577] leading-tight">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#262420] shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-[#a89f91] hover:text-[#ded8cb] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-[#ded8cb] hover:bg-[#201e25] transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#c5a880] to-[#e6ca95] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity shadow-lg shadow-[#c5a880]/20 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Aplicar no Site</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
