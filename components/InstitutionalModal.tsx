import React from 'react';
import { X, ShieldCheck, RefreshCw, FileText, Headphones, Heart, Sparkles } from 'lucide-react';

interface InstitutionalModalProps {
  type: 'privacidade' | 'termos' | 'trocas' | 'atendimento' | 'historia' | null;
  onClose: () => void;
}

export const InstitutionalModal: React.FC<InstitutionalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    historia: {
      title: 'Nossa História • AR Fragrance',
      icon: Heart,
      content: (
        <div className="space-y-5 text-xs text-[#ded8cb] leading-relaxed text-center py-2">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center leading-none mb-3">
              <span className="font-serif italic text-4xl text-[#f3e5ab] tracking-wider font-light">
                AR
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a880] mt-1 font-light">
                FRAGRANCE
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 w-full max-w-xs my-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#c5a880]" />
              <span className="text-xs tracking-[0.25em] uppercase text-[#e8c882] font-serif">
                NOSSA
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#c5a880]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-[#faf7f2] tracking-[0.1em] font-normal uppercase my-1">
              HISTÓRIA
            </h3>

            <div className="flex items-center justify-center gap-2 text-[#c5a880] my-2">
              <div className="h-[1px] w-6 bg-[#8a724d]" />
              <Heart className="w-3.5 h-3.5 text-[#e8c882] fill-[#e8c882]/20" />
              <div className="h-[1px] w-6 bg-[#8a724d]" />
            </div>
          </div>

          {/* Narrative */}
          <p className="text-xs sm:text-sm text-[#cfc8bd] font-light">
            O nome <strong className="text-[#faf7f2] font-medium">AR</strong> nasceu da pessoa mais importante das nossas vidas:
          </p>

          <div className="py-1">
            <span className="block font-serif italic text-3xl sm:text-4xl text-[#f3e5ab] tracking-wide leading-tight drop-shadow-sm font-normal">
              Asafe Ravi,
            </span>
            <span className="text-[11px] text-[#b5aa99] tracking-[0.2em] uppercase font-light mt-1 block">
              nosso filho.
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#b8b0a2] font-light leading-relaxed">
            Ele é a inspiração por trás da nossa marca e representa tudo o que queremos transmitir: <span className="text-[#f0eae0] font-normal">amor, cuidado e momentos inesquecíveis.</span>
          </p>

          <div className="w-10 h-[1px] bg-[#3a352b] mx-auto my-3" />

          <p className="text-xs sm:text-sm text-[#c4bcae] font-light leading-relaxed italic">
            &ldquo;Assim como um perfume marca uma lembrança, nosso desejo é que cada fragrância da AR Fragrance faça parte da sua história.&rdquo;
          </p>

          <div className="py-2">
            <p className="text-[10px] text-[#9c9384] uppercase tracking-[0.18em] mb-1 font-light">
              Porque, para nós, perfume não é apenas um aroma:
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-serif text-[#faf7f2]">
              <span className="text-[#e8c882]">É identidade.</span>
              <span>•</span>
              <span className="text-[#ded8cb]">É memória.</span>
              <span>•</span>
              <span className="text-[#e8c882]">É emoção.</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#26231c]">
            <Heart className="w-3.5 h-3.5 text-[#e8c882] fill-[#e8c882]/20 mx-auto mb-2" />
            <span className="font-serif italic text-xl text-[#f3e5ab] tracking-wide block">
              AR Fragrance
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#a89f90] mt-1 block font-light">
              Inspirada no amor que deu origem ao nosso maior sonho.
            </span>
          </div>
        </div>
      )
    },
    privacidade: {
      title: 'Política de Privacidade & Segurança',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-xs text-[#ded8cb] leading-relaxed">
          <p>
            Na <strong>AR Fragrance</strong>, a segurança e a confidencialidade dos seus dados são prioridades absolutas.
          </p>
          <h4 className="font-bold text-[#faf7f2] text-sm">1. Coleta e Tratamento de Dados</h4>
          <p>
            Coletamos apenas informações estritamente necessárias para o processamento do seu pedido, emissão de nota fiscal e envio seguro pelas transportadoras e Correios.
          </p>
          <h4 className="font-bold text-[#faf7f2] text-sm">2. Proteção e Criptografia</h4>
          <p>
            Todos os dados de pagamento trafegam por conexões com certificado SSL 256-bits. A AR Fragrance não armazena dados de cartão de crédito.
          </p>
        </div>
      )
    },
    termos: {
      title: 'Termos de Uso & Garantias',
      icon: FileText,
      content: (
        <div className="space-y-4 text-xs text-[#ded8cb] leading-relaxed">
          <p>
            Bem-vindo à boutique online da <strong>AR Fragrance</strong>. Ao navegar e realizar compras em nossa plataforma, você concorda com os seguintes termos:
          </p>
          <h4 className="font-bold text-[#faf7f2] text-sm">1. Autenticidade dos Produtos</h4>
          <p>
            Todos os perfumes comercializados são 100% originais, provenientes de importação legalizada com selos de controle e lotes auditáveis.
          </p>
          <h4 className="font-bold text-[#faf7f2] text-sm">2. Lotes e Controle de Qualidade</h4>
          <p>
            Todos os frascos de importados, perfumes árabes e criações Lab8 passam por inspeção minuciosa de embalagem, válvula e batch code.
          </p>
        </div>
      )
    },
    trocas: {
      title: 'Política de Trocas e Devoluções',
      icon: RefreshCw,
      content: (
        <div className="space-y-4 text-xs text-[#ded8cb] leading-relaxed">
          <p>
            Seguimos rigorosamente o Código de Defesa do Consumidor para garantir sua total satisfação:
          </p>
          <h4 className="font-bold text-[#faf7f2] text-sm">1. Direito de Arrependimento (7 dias)</h4>
          <p>
            Para frascos lacrados de fábrica, o cliente tem até 7 dias corridos após o recebimento para solicitar a devolução com frete reverso gratuito, desde que o celofane original não tenha sido violado.
          </p>
          <h4 className="font-bold text-[#faf7f2] text-sm">2. Avarias ou Divergências</h4>
          <p>
            Caso identifique qualquer avaria de transporte ou divergência em seu pedido, nossa equipe providencia a reposição ou estorno imediato sem custos.
          </p>
        </div>
      )
    },
    atendimento: {
      title: 'Central de Atendimento ao Cliente',
      icon: Headphones,
      content: (
        <div className="space-y-4 text-xs text-[#ded8cb] leading-relaxed">
          <p>
            Nossa equipe de sommeliers olfativos está à disposição para auxiliá-lo na escolha da sua fragrância ideal.
          </p>
          <div className="p-4 rounded-lg bg-[#18171d] border border-[#2e2c26] space-y-2">
            <p><strong>WhatsApp:</strong> (11) 98765-4321</p>
            <p><strong>E-mail:</strong> atendimento@arfragrance.com.br</p>
            <p><strong>Horário de Atendimento:</strong> Segunda a Sexta das 09h às 19h | Sábados das 10h às 15h</p>
          </div>
        </div>
      )
    }
  };

  const item = contentMap[type];
  const Icon = item.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#111115] border border-[#2e2a23] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#24221f] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1c1a20] text-[#e8c882] flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#faf7f2]">
              {item.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-[#9c9384] hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {item.content}
        </div>

        <div className="pt-4 mt-4 border-t border-[#24221f] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#201f26] text-[#ded8cb] hover:bg-[#c5a880] hover:text-black rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
