import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Truck, 
  Headphones, 
  CreditCard 
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const ConfidenceSection: React.FC = () => {
  const guarantees = [
    {
      icon: ShieldCheck,
      title: 'Compra segura',
      desc: 'Criptografia de ponta a ponta e proteção total aos seus dados.'
    },
    {
      icon: Award,
      title: 'Produtos originais',
      desc: 'Frascos 100% lacrados com garantia inegociável de autenticidade.'
    },
    {
      icon: Truck,
      title: 'Envio para todo o Brasil',
      desc: 'Embalagens blindadas anti-impacto com seguro de transporte incluso.'
    },
    {
      icon: Headphones,
      title: 'Atendimento especializado',
      desc: 'Consultoria olfativa personalizada via WhatsApp para ajudar na sua escolha.'
    },
    {
      icon: CreditCard,
      title: 'Pagamento seguro',
      desc: '5% de desconto no PIX ou parcele em até 10x sem juros.'
    }
  ];

  return (
    <section className="py-16 bg-[#0a0a0c] border-t border-b border-[#21201d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {guarantees.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={index}
                animation="fade-up"
                delay={index * 90}
                duration={700}
              >
                <div 
                  className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-[#121216] transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-[#141417] border border-[#2b2a26] flex items-center justify-center text-[#ded8cb] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#faf7f2] mb-1.5 uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#9c9384] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
