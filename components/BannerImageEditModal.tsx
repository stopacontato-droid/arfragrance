import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';
import { 
  getBannersConfig, 
  saveCollectionImage, 
  saveHeroSlideImage, 
  resetCollectionImage, 
  resetHeroSlideImage,
  DEFAULT_COLLECTION_IMAGES 
} from '../config/bannersConfig';

export interface BannerEditTarget {
  type: 'collection' | 'hero';
  id: string; // 'importados' | 'arabes' | 'lab8' or slide id
  title: string;
  defaultImageUrl?: string;
  currentImageUrl?: string;
}

interface BannerImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: BannerEditTarget | null;
  onSaved: () => void;
}

export const BannerImageEditModal: React.FC<BannerImageEditModalProps> = ({
  isOpen,
  onClose,
  target,
  onSaved
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (target && isOpen) {
      const config = getBannersConfig();
      if (target.type === 'collection') {
        const key = target.id as 'importados' | 'arabes' | 'lab8';
        const saved = config.collections[key];
        setImageUrl(saved || DEFAULT_COLLECTION_IMAGES[key] || target.defaultImageUrl || '');
      } else {
        const saved = config.heroSlides[target.id]?.productImage || config.heroSlides[target.id]?.backgroundImage;
        setImageUrl(saved || target.currentImageUrl || target.defaultImageUrl || '');
      }
      setIsSaved(false);
    }
  }, [target, isOpen]);

  if (!isOpen || !target) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      // Compress to 800px max dimension, quality 0.8
      const compressed = await compressImageFile(file, 800, 0.8);
      setImageUrl(compressed);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      alert('Erro ao carregar a imagem: ' + (err?.message || 'Arquivo inválido'));
    }
  };

  const handleSave = () => {
    if (!imageUrl.trim()) {
      alert('Por favor, adicione uma URL ou faça upload de uma imagem.');
      return;
    }

    if (target.type === 'collection') {
      saveCollectionImage(target.id as 'importados' | 'arabes' | 'lab8', imageUrl.trim());
    } else {
      saveHeroSlideImage(target.id, { productImage: imageUrl.trim() });
    }

    setIsSaved(true);
    onSaved();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (target.type === 'collection') {
      resetCollectionImage(target.id as 'importados' | 'arabes' | 'lab8');
      const def = DEFAULT_COLLECTION_IMAGES[target.id as 'importados' | 'arabes' | 'lab8'];
      setImageUrl(def || '');
    } else {
      resetHeroSlideImage(target.id);
      setImageUrl(target.defaultImageUrl || '');
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121215] border border-[#2b2823] w-full max-w-lg rounded-2xl p-6 sm:p-7 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#888173] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#e8c882]">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#faf7f2]">
              Editar Imagem
            </h3>
            <p className="text-xs text-[#a89f91]">
              Personalizando: <strong className="text-[#e8c882]">{target.title}</strong>
            </p>
          </div>
        </div>

        {/* Image Preview Box */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[#ded8cb] uppercase tracking-wider mb-2">
            Pré-visualização
          </label>
          <div className="relative w-full h-56 rounded-xl overflow-hidden border border-[#2e2a24] bg-black/60 flex items-center justify-center group">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Pré-visualização"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="text-center text-[#736c5f]">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Nenhuma imagem selecionada</p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center gap-2 text-white text-xs font-medium">
                <div className="w-4 h-4 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
                <span>Processando imagem...</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button & URL input */}
        <div className="space-y-4 mb-6">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-[#c5a880]/50 hover:border-[#c5a880] bg-[#1a191f] hover:bg-[#201f26] text-xs font-medium text-[#ded8cb] hover:text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
            >
              <Upload className="w-4 h-4 text-[#c5a880]" />
              <span>Fazer Upload do Seu Dispositivo (Foto / Imagem)</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a89f91] mb-1.5">
              Ou cole o link direto da imagem (URL da internet):
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/foto-do-perfume.jpg"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#18171d] border border-[#2b2823] text-xs text-[#faf7f2] focus:outline-none focus:border-[#c5a880]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#262420]">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#9c9384] hover:text-[#e8c882] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#9c9384] hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#c5a880] to-[#dfc5a0] text-black hover:opacity-90 shadow-md'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Imagem</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
