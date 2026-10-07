import React, { useState } from 'react';
import { X, FileText, Download, ExternalLink, CheckCircle2, ShieldCheck, Printer, Share2 } from 'lucide-react';
import { Product } from '../types/perfume';
import { BrandConfig } from '../config/brandConfig';
import { StorePaymentConfig } from '../config/paymentConfig';
import { downloadPrebuiltCatalog, generateAndDownloadClientCatalog } from '../utils/pdfCatalogGenerator';

interface DownloadCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  brandConfig: BrandConfig;
  paymentConfig: StorePaymentConfig;
}

export const DownloadCatalogModal: React.FC<DownloadCatalogModalProps> = ({
  isOpen,
  onClose,
  products,
  brandConfig,
  paymentConfig
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPrebuilt = () => {
    downloadPrebuiltCatalog();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleGenerateDynamic = () => {
    setIsGenerating(true);
    try {
      generateAndDownloadClientCatalog(products, brandConfig, paymentConfig);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      // Fallback to prebuilt
      downloadPrebuiltCatalog();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open('/catalogo-ar-fragrance.pdf', '_blank');
  };

  const handlePrintBrowser = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#111115] border border-[#2e2a23] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#24221f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c5a880]/30 to-[#d4af37]/10 border border-[#c5a880] flex items-center justify-center text-[#e8c882]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#faf7f2] leading-tight">
                Catálogo Oficial em PDF
              </h2>
              <p className="text-xs text-[#a89f91]">
                Arquivo leve (menos de 25 MB), perfeito para enviar no WhatsApp e E-mail
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-[#9c9384] hover:text-white rounded-full bg-[#18171c] hover:bg-[#232128] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <strong className="block text-emerald-200 font-semibold">Download Iniciado com Sucesso!</strong>
                O PDF do catálogo foi baixado para o seu dispositivo.
              </div>
            </div>
          )}

          {/* Catalog Preview Info Box */}
          <div className="p-4 rounded-xl bg-[#17161c] border border-[#2b2822] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#c5a880] font-semibold">
                Especificações do Catálogo
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400">
                0.18 MB (Menos de 25 MB)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="space-y-1">
                <p className="text-[#a89f91]">Formato: <strong className="text-[#ded8cb]">A4 Alta Definição</strong></p>
                <p className="text-[#a89f91]">Extensão: <strong className="text-[#ded8cb]">.PDF</strong></p>
                <p className="text-[#a89f91]">Páginas: <strong className="text-[#ded8cb]">9 Páginas Oficiais</strong></p>
              </div>
              <div className="space-y-1">
                <p className="text-[#a89f91]">Perfumes Árabes: <strong className="text-[#ded8cb]">Incluídos</strong></p>
                <p className="text-[#a89f91]">Perfumes Importados: <strong className="text-[#ded8cb]">Incluídos</strong></p>
                <p className="text-[#a89f91]">Lab8 Parfums: <strong className="text-[#ded8cb]">Incluídos</strong></p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262420] text-[11px] text-[#9c9384] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Contém fotos, pirâmides olfativas, preços oficiais, chave PIX e link do WhatsApp.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleDownloadPrebuilt}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e8c882] to-[#c5a880] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Catálogo em PDF Agora (0.18 MB)</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleOpenInNewTab}
                className="py-2.5 px-3 rounded-xl bg-[#1b1a20] hover:bg-[#26242d] border border-[#332f26] text-xs text-[#ded8cb] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#e8c882]" />
                <span>Visualizar no Navegador</span>
              </button>

              <button
                onClick={handleGenerateDynamic}
                disabled={isGenerating}
                className="py-2.5 px-3 rounded-xl bg-[#1b1a20] hover:bg-[#26242d] border border-[#332f26] text-xs text-[#ded8cb] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Share2 className="w-3.5 h-3.5 text-[#e8c882]" />
                <span>{isGenerating ? 'Gerando...' : 'Gerar Versão Dinâmica'}</span>
              </button>
            </div>
          </div>

          {/* Browser Printing Guide */}
          <div className="p-4 rounded-xl bg-[#141418] border border-[#25232a] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ded8cb]">
              <Printer className="w-4 h-4 text-[#c5a880]" />
              <span>Como salvar o site inteiro diretamente pelo navegador:</span>
            </div>
            <ol className="text-xs text-[#a89f91] space-y-1.5 list-decimal pl-4">
              <li>Pressione <strong className="text-[#ded8cb]">Ctrl + P</strong> (ou <strong className="text-[#ded8cb]">Cmd + P</strong> no Mac).</li>
              <li>No campo <em>Destino</em>, selecione <strong className="text-[#ded8cb]">"Salvar como PDF"</strong>.</li>
              <li>Marque a opção <em>"Gráficos de segundo plano"</em> para manter o fundo e fotos.</li>
              <li>Clique em <strong className="text-[#ded8cb]">Salvar</strong> no seu computador ou celular.</li>
            </ol>
            <button
              onClick={handlePrintBrowser}
              className="mt-2 text-xs text-[#e8c882] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir diálogo de impressão do navegador agora &rarr;</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d0d10] border-t border-[#21201d] flex items-center justify-between text-xs text-[#787163]">
          <span>AR Fragrance • Alta Perfumaria</span>
          <button 
            onClick={onClose}
            className="text-[#ded8cb] hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
