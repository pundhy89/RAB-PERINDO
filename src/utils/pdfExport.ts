import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toPng } from 'html-to-image';
import { RABItem, RABMetadata } from '../types';
import { formatIDR, terbilang, formatPeriodLabel, formatIndonesianDate } from '../utils';
import { getPerindoLogoDataUrl } from './perindoLogoDataUrl';

// Standard Indonesian F4 / Folio Paper Dimensions in millimeters: 215mm x 330mm
export const F4_WIDTH_MM = 215;
export const F4_HEIGHT_MM = 330;

/**
 * High-reliability Native Vector PDF Generator:
 * Auto-fits perfectly onto EXACTLY 1 Lembar F4 without empty awkward gaps,
 * renders the official Logo on the Kop Surat,
 * ensures all table rows and columns are completely visible,
 * and formats signatures with Jabatan directly beneath the name.
 */
export function generateNativeF4PDF(
  items: RABItem[],
  metadata: RABMetadata,
  grandTotal: number,
  filename: string = 'RAB_Media_Digital_F4.pdf'
): boolean {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [F4_WIDTH_MM, F4_HEIGHT_MM],
  });

  const margin = 10;
  const contentWidth = F4_WIDTH_MM - margin * 2; // 195 mm
  let currentY = 12;

  // 1. KOP SURAT WITH LOGO
  if (metadata.showKopSurat !== false) {
    const kopStartY = currentY;
    const logoSize = 22; // 22mm x 22mm logo
    const logoX = margin + 2;
    const logoY = kopStartY;

    // Embed Logo: Use uploaded custom logo or default Perindo emblem
    try {
      const logoDataUrl = metadata.kopLogoUrl || getPerindoLogoDataUrl();
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoSize, logoSize);
      }
    } catch (logoErr) {
      console.warn('Could not embed logo image in PDF:', logoErr);
    }

    // Text block coordinates (Centered horizontally across the page)
    const textCenterX = F4_WIDTH_MM / 2 + 6; // slightly shifted to balance logo on left
    let textY = kopStartY + 3;

    if (metadata.kopHeaderTitle) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(220, 38, 38); // Crimson Red
      doc.text(metadata.kopHeaderTitle.toUpperCase(), textCenterX, textY, { align: 'center' });
      textY += 4.5;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 39, 102); // Deep Navy Perindo Blue
    doc.text((metadata.kopOrgName || 'PARTAI PERSATUAN INDONESIA (PERINDO)').toUpperCase(), textCenterX, textY, { align: 'center' });
    textY += 5;

    const subTitle = metadata.kopSubTitle || `${metadata.unit || 'Koordinator Media Digital'} • Biro Komunikasi & Kampanye Digital`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(subTitle, textCenterX, textY, { align: 'center' });
    textY += 4;

    if (metadata.kopAddress) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(metadata.kopAddress, textCenterX, textY, { align: 'center' });
      textY += 4;
    }

    // Set currentY past both logo and text
    currentY = Math.max(logoY + logoSize + 2, textY + 1);

    // Double divider lines
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.9);
    doc.line(margin, currentY, F4_WIDTH_MM - margin, currentY);

    currentY += 0.9;
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, F4_WIDTH_MM - margin, currentY);

    currentY += 5.5;
  }

  // 2. DOCUMENT TITLE & META BAR
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text((metadata.title || 'RAB LANGGANAN APLIKASI DIGITAL & MEDIA').toUpperCase(), F4_WIDTH_MM / 2, currentY, { align: 'center' });
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const metaText = `No: ${metadata.docNumber}   |   Periode: ${formatPeriodLabel(metadata.period)}   |   Tanggal: ${formatIndonesianDate(metadata.submissionDate)}`;
  doc.text(metaText, F4_WIDTH_MM / 2, currentY, { align: 'center' });
  currentY += 5.5;

  // 3. TABLE OF BUDGET ITEMS (Auto-fit proportional sizing for F4)
  const activeItems = items.filter((i) => i.isActive);
  const tableRows = activeItems.map((item, idx) => {
    const subtotal = item.qty * item.price;
    const nameAndDesc = item.description
      ? `${item.name}\n${item.description}`
      : item.name;

    return [
      idx + 1,
      item.category,
      nameAndDesc,
      item.qty,
      formatIDR(item.price),
      formatIDR(subtotal),
    ];
  });

  const rowCount = activeItems.length || 1;
  const cellPadding = rowCount <= 11 ? 2.6 : 2.0;
  const tableFontSize = rowCount <= 11 ? 8 : 7.5;

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Kategori', 'Nama Aplikasi & Spesifikasi', 'Jumlah', 'Harga Satuan (Rp)', 'Subtotal (Rp)']],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: tableFontSize,
      cellPadding: cellPadding,
      font: 'helvetica',
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.15,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [15, 39, 102], // Perindo Navy Blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: tableFontSize + 0.5,
      cellPadding: cellPadding + 0.6,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 34 },
      2: { cellWidth: 'auto' }, // Expands to fit content
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 35, halign: 'right' },
      5: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
  });

  // Position after table
  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 70;
  currentY = finalY + 4;

  // 4. TOTAL BULANAN & TERBILANG BANNER
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 13, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 39, 102);
  doc.text('TOTAL PENGAJUAN BULANAN (GRAND TOTAL):', margin + 4, currentY + 5);

  doc.setFontSize(11.5);
  doc.setTextColor(15, 39, 102);
  doc.text(formatIDR(grandTotal), F4_WIDTH_MM - margin - 4, currentY + 5.5, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Terbilang: "${terbilang(grandTotal)}"`, margin + 4, currentY + 10);

  currentY += 16;

  // Catatan penting dalam tulisan miring di bawah jumlah harga / di atas tanda tangan
  if (metadata.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Catatan Penting:', margin + 2, currentY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitNotes = doc.splitTextToSize(metadata.notes, contentWidth - 26);
    doc.text(splitNotes, margin + 25, currentY);
    currentY += splitNotes.length * 3.3 + 4;
  }

  // LEMBAR PENGESAHAN (Auto-fit to fill bottom of 1 Lembar F4)
  const minSignatureY = Math.max(currentY + 6, F4_HEIGHT_MM - 62);
  currentY = minSignatureY;

  // Date and location above signatures
  const signLocation = `${metadata.signatureLocation || 'Jakarta'}, ${formatIndonesianDate(metadata.submissionDate)}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(signLocation, F4_WIDTH_MM - margin - 8, currentY, { align: 'right' });
  currentY += 6;

  const col1X = margin + 40; // Center of Left Column (Pembuat)
  const col2X = F4_WIDTH_MM - margin - 40; // Center of Right Column (Penyetuju)

  // Label Diajukan oleh & Menyetujui (NO jabatan above the name)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Diajukan oleh,', col1X, currentY, { align: 'center' });
  doc.text('Menyetujui,', col2X, currentY, { align: 'center' });

  // Signature Blank Gap
  currentY += 20;

  // Name lines in parentheses (Bold)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`( ${metadata.creatorName || 'Nama Pembuat'} )`, col1X, currentY, { align: 'center' });
  doc.text(`( ${metadata.approverName || 'Nama Penyetuju'} )`, col2X, currentY, { align: 'center' });
  currentY += 4.5;

  // Jabatan tepat di bawah nama
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(metadata.creatorRole || 'Koordinator Media Digital', col1X, currentY, { align: 'center' });
  doc.text(metadata.approverRole || 'Bendahara Umum DPP', col2X, currentY, { align: 'center' });

  // Bottom footer watermark
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Dokumen Rencana Anggaran Biaya Resmi • Dewan Pimpinan Pusat Partai Perindo • Dibuat oleh: pundhy p.',
    F4_WIDTH_MM / 2,
    F4_HEIGHT_MM - 6,
    { align: 'center' }
  );

  doc.save(filename);
  return true;
}

/**
 * Visual DOM Snapshot to 1 Page F4 with auto-fit scaling.
 * If visual snapshot has any iframe/CORS issues, automatically falls back to generateNativeF4PDF.
 */
export async function exportElementToF4PDF(
  elementId: string,
  items: RABItem[],
  metadata: RABMetadata,
  grandTotal: number,
  filename: string = 'RAB_Media_Digital_F4.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);

  if (element) {
    try {
      const dataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList.contains('no-print')) {
            return false;
          }
          return true;
        },
      });

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [F4_WIDTH_MM, F4_HEIGHT_MM],
      });

      const margin = 8;
      const printableWidth = F4_WIDTH_MM - margin * 2;
      const printableHeight = F4_HEIGHT_MM - margin * 2;

      let targetWidth = printableWidth;
      let targetHeight = (img.height * printableWidth) / img.width;

      if (targetHeight > printableHeight) {
        const scaleFactor = printableHeight / targetHeight;
        targetHeight = printableHeight;
        targetWidth = printableWidth * scaleFactor;
      }

      const offsetX = margin + (printableWidth - targetWidth) / 2;
      const offsetY = margin;

      pdf.addImage(dataUrl, 'PNG', offsetX, offsetY, targetWidth, targetHeight);
      pdf.save(filename);
      return true;
    } catch (visualError) {
      console.warn('Visual snapshot fallback to native F4 engine:', visualError);
    }
  }

  // Guaranteed fallback
  return generateNativeF4PDF(items, metadata, grandTotal, filename);
}
