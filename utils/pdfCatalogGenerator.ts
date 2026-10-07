import { jsPDF } from 'jspdf';
import { Product } from '../types/perfume';
import { BrandConfig } from '../config/brandConfig';
import { StorePaymentConfig } from '../config/paymentConfig';

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

export function downloadPrebuiltCatalog(): void {
  const link = document.createElement('a');
  link.href = '/catalogo-ar-fragrance.pdf';
  link.download = 'Catalogo-AR-Fragrance.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateAndDownloadClientCatalog(
  products: Product[],
  brandConfig: BrandConfig,
  paymentConfig: StorePaymentConfig
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkBg = [15, 15, 18];
  const cardBg = [22, 22, 26];
  const goldColor = [212, 175, 55];
  const goldLight = [232, 200, 130];
  const textWhite = [250, 247, 242];
  const textMuted = [170, 162, 148];
  const borderCol = [45, 42, 35];

  function setFill(color: number[]) {
    doc.setFillColor(color[0], color[1], color[2]);
  }
  function setStroke(color: number[]) {
    doc.setDrawColor(color[0], color[1], color[2]);
  }
  function setText(color: number[]) {
    doc.setTextColor(color[0], color[1], color[2]);
  }

  function drawBackground() {
    setFill(darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    setStroke(borderCol);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  }

  function drawHeader(title: string, subtitle: string) {
    drawBackground();

    setFill([25, 24, 28]);
    doc.rect(14, 14, contentWidth, 22, 'F');
    setStroke(goldColor);
    doc.setLineWidth(0.5);
    doc.line(14, 36, 14 + contentWidth, 36);

    setText(goldLight);
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text(title.toUpperCase(), 20, 23);

    setText(textMuted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(subtitle, 20, 30);

    setText(textWhite);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text((brandConfig.brandName || 'AR FRAGRANCE').toUpperCase(), pageWidth - 20, 24, { align: 'right' });
    setText(goldColor);
    doc.setFontSize(7);
    doc.text('HAUTE PARFUMERIE', pageWidth - 20, 29, { align: 'right' });
  }

  function drawFooter(pageNum: number, totalPages: number) {
    const y = pageHeight - 14;
    setStroke(borderCol);
    doc.setLineWidth(0.3);
    doc.line(14, y - 4, 14 + contentWidth, y - 4);

    setText(textMuted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`${brandConfig.brandName || 'AR Fragrance'} • Pedidos WhatsApp: ${paymentConfig.whatsappNumber || '(11) 98765-4321'} • Chave PIX: ${paymentConfig.pixKey || 'stopacontato@gmail.com'}`, 16, y);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - 16, y, { align: 'right' });
  }

  // Cover Page
  drawBackground();
  setStroke(goldColor);
  doc.setLineWidth(0.6);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  setText(goldLight);
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text('C A T Á L O G O   O F I C I A L', pageWidth / 2, 60, { align: 'center' });

  setText(textWhite);
  doc.setFont('times', 'bold');
  doc.setFontSize(36);
  doc.text((brandConfig.brandName || 'AR FRAGRANCE').toUpperCase(), pageWidth / 2, 75, { align: 'center' });

  setStroke(goldColor);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 35, 82, pageWidth / 2 + 35, 82);

  setText(textMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Alta Perfumaria Importada, Árabes Nobres & Lab8 Autoral', pageWidth / 2, 90, { align: 'center' });

  // Highlights Box
  setFill([20, 19, 23]);
  setStroke(borderCol);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth / 2 - 75, 105, 150, 75, 3, 3, 'FD');

  const highlights = [
    { title: '100% AUTENTICIDADE GARANTIDA', desc: 'Frascos lacrados de fábrica com selo ADIPEC de procedência internacional.' },
    { title: 'COLEÇÃO EXCLUSIVA DE ÁRABES', desc: 'Lattafa, Armaf, Maison Alhambra com fixação lendária de até 14h na pele.' },
    { title: 'LAB8 EXTRAIT DE PARFUM (35%)', desc: 'Fragrâncias autorais exclusivas com matérias-primas raras importadas de Grasse.' },
    { title: '5% OFF NO PIX & ATÉ 10X SEM JUROS', desc: 'Desconto instantâneo à vista no PIX ou parcelamento em até 10x no cartão.' }
  ];

  let hy = 115;
  highlights.forEach(h => {
    setText(goldLight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`•  ${h.title}`, pageWidth / 2 - 68, hy);
    setText(textMuted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(h.desc, pageWidth / 2 - 63, hy + 4.5);
    hy += 15;
  });

  // Contact Box
  setFill([26, 25, 30]);
  setStroke(goldColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth / 2 - 75, 195, 150, 48, 3, 3, 'FD');

  setText(goldColor);
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text('COMO FAZER SEU PEDIDO', pageWidth / 2, 206, { align: 'center' });

  setText(textWhite);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('1. Escolha suas fragrâncias favoritas neste catálogo.', pageWidth / 2, 214, { align: 'center' });
  doc.text('2. Envie os nomes no WhatsApp oficial para confirmar seu pedido.', pageWidth / 2, 220, { align: 'center' });
  doc.text('3. Pague via PIX com 5% de desconto ou parcele em até 10x.', pageWidth / 2, 226, { align: 'center' });

  setText(goldLight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`WhatsApp: ${paymentConfig.whatsappNumber || '(11) 98765-4321'} • Atendimento Exclusivo`, pageWidth / 2, 235, { align: 'center' });

  // Separate collections
  const arabes = products.filter(p => p.category === 'arabes');
  const importados = products.filter(p => p.category === 'importados');
  const lab8 = products.filter(p => p.category === 'lab8');

  function renderGroup(groupList: Product[], groupTitle: string, groupSubtitle: string) {
    const itemsPerPage = 5;
    const totalPagesGroup = Math.ceil(groupList.length / itemsPerPage);

    for (let pIdx = 0; pIdx < totalPagesGroup; pIdx++) {
      doc.addPage();
      drawHeader(groupTitle, `${groupSubtitle} (${pIdx + 1}/${totalPagesGroup})`);

      const pageProducts = groupList.slice(pIdx * itemsPerPage, (pIdx + 1) * itemsPerPage);
      let cardY = 44;

      pageProducts.forEach((item) => {
        setFill(cardBg);
        setStroke(borderCol);
        doc.setLineWidth(0.3);
        doc.roundedRect(14, cardY, contentWidth, 37, 2, 2, 'FD');

        // Brand Badge
        setFill([32, 30, 36]);
        doc.roundedRect(18, cardY + 4, 30, 5, 1, 1, 'F');
        setText(goldLight);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.text((item.brand || 'LUXO').toUpperCase(), 33, cardY + 7.5, { align: 'center' });

        // Name
        setText(textWhite);
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.text(item.name, 52, cardY + 8);

        // Badge
        if (item.badge) {
          setFill([45, 38, 26]);
          doc.roundedRect(contentWidth - 25, cardY + 4, 25, 5, 1, 1, 'F');
          setText(goldColor);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6);
          doc.text(item.badge, contentWidth - 12.5, cardY + 7.5, { align: 'center' });
        }

        // Details
        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('Família Olfativa:', 18, cardY + 14);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(item.olfactoryFamily || 'Fragrância Nobre', 40, cardY + 14);

        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Fixação:', 85, cardY + 14);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(item.longevity || '10 a 14h', 98, cardY + 14);

        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Volume:', 140, cardY + 14);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(item.availableSizes?.[0]?.size || '100ml', 152, cardY + 14);

        // Notes
        const topStr = (item.topNotes || []).slice(0, 3).join(', ');
        const baseStr = (item.baseNotes || []).slice(0, 3).join(', ');
        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Notas:', 18, cardY + 19);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(`Saída: ${topStr || 'Cítricos & Frutas'} | Fundo: ${baseStr || 'Âmbar & Madeiras'}`, 30, cardY + 19);

        // Price bar
        setFill([18, 17, 21]);
        doc.rect(14, cardY + 28, contentWidth, 9, 'F');
        setStroke(borderCol);
        doc.line(14, cardY + 28, 14 + contentWidth, cardY + 28);

        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text('Preço Oficial:', 18, cardY + 34);

        setText(textWhite);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(formatBRL(item.price), 37, cardY + 34);

        const pixPrice = item.price * 0.95;
        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(`PIX com 5% OFF: ${formatBRL(pixPrice)}`, 75, cardY + 34);

        const parcel = (item.price / 10).toFixed(2).replace('.', ',');
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(`ou 10x de R$ ${parcel} sem juros`, 135, cardY + 34);

        cardY += 44;
      });
    }
  }

  if (arabes.length > 0) {
    renderGroup(arabes, 'Coleção Perfumes Árabes', 'Fragrâncias Orientais Nobres com Alta Fixação e Projeção');
  }
  if (importados.length > 0) {
    renderGroup(importados, 'Coleção Importados Mais Desejados', 'Best-Sellers Mundiais 100% Lacrados com Selo ADIPEC');
  }
  if (lab8.length > 0) {
    renderGroup(lab8, 'Coleção Lab8 Alta Perfumaria', 'Criações Autorais com 35% de Concentração (Extrait de Parfum)');
  }

  // Final Terms Page
  doc.addPage();
  drawHeader('Informações de Compra & Atendimento', 'Termos Oficiais de Envio, Pagamento Seguro e Suporte');

  let py = 45;

  // Box 1: Pagamento
  setFill(cardBg);
  setStroke(borderCol);
  doc.roundedRect(14, py, contentWidth, 48, 2, 2, 'FD');

  setText(goldLight);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('FORMAS DE PAGAMENTO FACILITADAS', 20, py + 8);

  setText(textWhite);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('•  PIX com 5% de Desconto Imediato:', 20, py + 16);
  setText(textMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Pague instantaneamente pelo app do seu banco com desconto exclusivo. Chave PIX: ${paymentConfig.pixKey || 'stopacontato@gmail.com'}`, 24, py + 21);

  setText(textWhite);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('•  Cartão de Crédito em até 10x Sem Juros:', 20, py + 29);
  setText(textMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Aceitamos Visa, Mastercard, Elo, Hipercard e American Express com processamento seguro.', 24, py + 34);

  setText(goldColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Sem taxas adicionais • Transação direta e transparente', 24, py + 42);

  py += 54;

  // Box 2: Envio
  setFill(cardBg);
  setStroke(borderCol);
  doc.roundedRect(14, py, contentWidth, 48, 2, 2, 'FD');

  setText(goldLight);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('ENVIO SEGURO & POLÍTICA DE AUTENTICIDADE', 20, py + 8);

  setText(textWhite);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('•  Despacho em até 24h úteis para todo o Brasil:', 20, py + 16);
  setText(textMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Envios com seguro total contra avarias e extravios, com código de rastreamento oficial.', 24, py + 21);

  setText(textWhite);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('•  Garantia de 100% de Autenticidade:', 20, py + 29);
  setText(textMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Todos os frascos são lacrados, acompanham batch code verificável e selo ADIPEC de procedência.', 24, py + 34);

  setText(goldColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Frete Grátis em compras acima de R$ 299,00', 24, py + 42);

  py += 54;

  // Box 3: WhatsApp
  setFill([26, 25, 30]);
  setStroke(goldColor);
  doc.setLineWidth(0.6);
  doc.roundedRect(14, py, contentWidth, 54, 3, 3, 'FD');

  setText(goldLight);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('ATENDIMENTO EXCLUSIVO NO WHATSAPP', pageWidth / 2, py + 11, { align: 'center' });

  setText(textWhite);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Deseja pedir agora ou tirar dúvidas sobre notas e fixação de alguma fragrância?', pageWidth / 2, py + 19, { align: 'center' });
  doc.text('Nossa equipe de consultoria olfativa está pronta para atendê-lo.', pageWidth / 2, py + 25, { align: 'center' });

  setFill([37, 211, 102]);
  doc.roundedRect(pageWidth / 2 - 50, py + 30, 100, 12, 2, 2, 'F');
  setText([0, 0, 0]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`FALAR NO WHATSAPP: ${paymentConfig.whatsappNumber || '(11) 98765-4321'}`, pageWidth / 2, py + 38, { align: 'center' });

  setText(textMuted);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.text(`Link direto para WhatsApp: https://wa.me/${(paymentConfig.whatsappNumber || '5511987654321').replace(/\D/g, '')}`, pageWidth / 2, py + 48, { align: 'center' });

  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  doc.save(`${(brandConfig.brandName || 'AR-Fragrance').replace(/\s+/g, '-')}-Catalogo-Oficial.pdf`);
}
