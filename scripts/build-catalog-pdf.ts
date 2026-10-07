import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { ARABIC_PERFUMES, IMPORTED_PERFUMES, LAB8_PERFUMES } from '../src/data/perfumesData';

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

export function generatePdfFile() {
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
  const darkBg = [15, 15, 18]; // #0f0f12
  const cardBg = [22, 22, 26]; // #16161a
  const goldColor = [212, 175, 55]; // #d4af37
  const goldLight = [232, 200, 130]; // #e8c882
  const textWhite = [250, 247, 242]; // #faf7f2
  const textMuted = [170, 162, 148]; // #aaa294
  const borderCol = [45, 42, 35]; // #2d2a23

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
    // Subtle Gold Border Frame
    setStroke(borderCol);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  }

  function drawHeader(title: string, subtitle: string) {
    drawBackground();

    // Top gold header band
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

    // Right logo / brand mark
    setText(textWhite);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('AR FRAGRANCE', pageWidth - 20, 24, { align: 'right' });
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
    doc.text('AR Fragrance • Pedidos WhatsApp: (11) 98765-4321 • Chave PIX: stopacontato@gmail.com', 16, y);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - 16, y, { align: 'right' });
  }

  // ==========================================
  // PAGE 1: CAPA DE LUXO
  // ==========================================
  drawBackground();

  // Decorative inner gold lines
  setStroke(goldColor);
  doc.setLineWidth(0.6);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Big Emblem / Title
  setText(goldLight);
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text('C A T Á L O G O   O F I C I A L', pageWidth / 2, 60, { align: 'center' });

  setText(textWhite);
  doc.setFont('times', 'bold');
  doc.setFontSize(36);
  doc.text('AR FRAGRANCE', pageWidth / 2, 75, { align: 'center' });

  // Center Line Divider
  setStroke(goldColor);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 35, 82, pageWidth / 2 + 35, 82);

  setText(textMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Alta Perfumaria Importada, Árabes Nobres & Lab8 Autoral', pageWidth / 2, 90, { align: 'center' });

  // Feature Highlights Box
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

  // Contact & Order Box
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
  doc.text('WhatsApp Oficial: (11) 98765-4321 • Atendimento Exclusivo', pageWidth / 2, 235, { align: 'center' });

  // Bottom Notice
  setText(textMuted);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.text('Edição Oficial Atualizada • Válido para todo o território nacional com frete seguro', pageWidth / 2, 268, { align: 'center' });

  // ==========================================
  // HELPER: RENDER PRODUCTS LISTING
  // ==========================================
  function renderProducts(products: typeof ARABIC_PERFUMES, title: string, subtitle: string, startPage: number): number {
    const itemsPerPage = 5;
    const totalPagesForSection = Math.ceil(products.length / itemsPerPage);
    let currentPageNum = startPage;

    for (let pIdx = 0; pIdx < totalPagesForSection; pIdx++) {
      doc.addPage();
      drawHeader(title, `${subtitle} (Parte ${pIdx + 1}/${totalPagesForSection})`);

      const pageProducts = products.slice(pIdx * itemsPerPage, (pIdx + 1) * itemsPerPage);
      let cardY = 44;

      pageProducts.forEach((item) => {
        // Product Card Container
        setFill(cardBg);
        setStroke(borderCol);
        doc.setLineWidth(0.3);
        doc.roundedRect(14, cardY, contentWidth, 37, 2, 2, 'FD');

        // Brand & Concentration Badge
        setFill([32, 30, 36]);
        doc.roundedRect(18, cardY + 4, 30, 5, 1, 1, 'F');
        setText(goldLight);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.text(item.brand.toUpperCase(), 33, cardY + 7.5, { align: 'center' });

        // Product Name
        setText(textWhite);
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.text(item.name, 52, cardY + 8);

        // Badge if exists
        if (item.badge) {
          setFill([45, 38, 26]);
          doc.roundedRect(contentWidth - 25, cardY + 4, 25, 5, 1, 1, 'F');
          setText(goldColor);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6);
          doc.text(item.badge, contentWidth - 12.5, cardY + 7.5, { align: 'center' });
        }

        // Details Row: Family, Longevity, Volume
        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('Família Olfativa:', 18, cardY + 14);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(item.olfactoryFamily, 40, cardY + 14);

        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Fixação:', 85, cardY + 14);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(item.longevity, 98, cardY + 14);

        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Volume:', 140, cardY + 14);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(item.availableSizes?.[0]?.size || '100ml', 152, cardY + 14);

        // Notes summary
        const notesStr = item.topNotes.slice(0, 3).join(', ');
        const baseStr = item.baseNotes.slice(0, 3).join(', ');
        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Notas:', 18, cardY + 19);
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.text(`Saída: ${notesStr}  |  Fundo: ${baseStr}`, 30, cardY + 19);

        // Description line
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.8);
        const splitDesc = doc.splitTextToSize(item.description, contentWidth - 8);
        doc.text(splitDesc[0] || '', 18, cardY + 24);

        // Price Bottom Bar inside card
        setFill([18, 17, 21]);
        doc.rect(14, cardY + 28, contentWidth, 9, 'F');
        setStroke(borderCol);
        doc.line(14, cardY + 28, 14 + contentWidth, cardY + 28);

        // Official Price
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text('Preço Oficial:', 18, cardY + 34);

        setText(textWhite);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(formatBRL(item.price), 37, cardY + 34);

        // 5% OFF PIX Price
        const pixPrice = item.price * 0.95;
        setText(goldColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(`PIX com 5% OFF: ${formatBRL(pixPrice)}`, 75, cardY + 34);

        // Parcelamento
        const parcel = (item.price / 10).toFixed(2).replace('.', ',');
        setText(textMuted);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(`ou 10x de R$ ${parcel} sem juros`, 135, cardY + 34);

        cardY += 44;
      });

      currentPageNum++;
    }

    return currentPageNum;
  }

  // Render Árabes
  renderProducts(ARABIC_PERFUMES, 'Coleção Perfumes Árabes', 'Fragrâncias Orientais Nobres com Alta Fixação e Projeção', 2);

  // Render Importados
  renderProducts(IMPORTED_PERFUMES, 'Coleção Importados Mais Desejados', 'Best-Sellers Mundiais 100% Lacrados com Selo ADIPEC', 5);

  // Render Lab8
  renderProducts(LAB8_PERFUMES, 'Coleção Lab8 Alta Perfumaria', 'Criações Autorais com 35% de Concentração (Extrait de Parfum)', 8);

  // ==========================================
  // FINAL PAGE: CONDIÇÕES DE COMPRA & CONTATO
  // ==========================================
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
  doc.text('Pague instantaneamente pelo app do seu banco com desconto exclusivo. Chave PIX: stopacontato@gmail.com', 24, py + 21);

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

  // Box 2: Envio e Garantia
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

  // Big Green Button representation
  setFill([37, 211, 102]); // WhatsApp Green
  doc.roundedRect(pageWidth / 2 - 50, py + 30, 100, 12, 2, 2, 'F');
  setText([0, 0, 0]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('FALAR NO WHATSAPP: (11) 98765-4321', pageWidth / 2, py + 38, { align: 'center' });

  setText(textMuted);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.text('Link direto para WhatsApp: https://wa.me/5511987654321', pageWidth / 2, py + 48, { align: 'center' });

  // Add Page Numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  // Save to public directory
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'catalogo-ar-fragrance.pdf');
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

  const stats = fs.statSync(outputPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`[SUCCESS] PDF Catálogo gerado com sucesso em: ${outputPath}`);
  console.log(`[INFO] Total de Páginas: ${totalPages}`);
  console.log(`[INFO] Tamanho do Arquivo: ${sizeMb} MB (Muito abaixo do limite de 25 MB!)`);
}

generatePdfFile();
