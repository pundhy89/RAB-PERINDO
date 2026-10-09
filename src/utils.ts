import { RABItem, RABMetadata } from './types';

export function formatIDR(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0';
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

export function formatNumberOnly(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Math.round(num).toLocaleString('id-ID');
}

const SATUAN = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

export function terbilang(n: number): string {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'Nol Rupiah';

  function convert(x: number): string {
    if (x < 12) {
      return SATUAN[x];
    } else if (x < 20) {
      return convert(x - 10) + ' Belas';
    } else if (x < 100) {
      return convert(Math.floor(x / 10)) + ' Puluh ' + convert(x % 10);
    } else if (x < 200) {
      return 'Seratus ' + convert(x - 100);
    } else if (x < 1000) {
      return convert(Math.floor(x / 100)) + ' Ratus ' + convert(x % 100);
    } else if (x < 2000) {
      return 'Seribu ' + convert(x - 1000);
    } else if (x < 1000000) {
      return convert(Math.floor(x / 1000)) + ' Ribu ' + convert(x % 1000);
    } else if (x < 1000000000) {
      return convert(Math.floor(x / 1000000)) + ' Juta ' + convert(x % 1000000);
    } else if (x < 1000000000000) {
      return convert(Math.floor(x / 1000000000)) + ' Miliar ' + convert(x % 1000000000);
    } else {
      return convert(Math.floor(x / 1000000000000)) + ' Triliun ' + convert(x % 1000000000000);
    }
  }

  const result = convert(n).trim().replace(/\s+/g, ' ') + ' Rupiah';
  return result;
}

export function formatPeriodLabel(periodStr: string): string {
  if (!periodStr) return '';
  const [year, month] = periodStr.split('-');
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const mIndex = parseInt(month, 10) - 1;
  if (mIndex >= 0 && mIndex < 12) {
    return `${months[mIndex]} ${year}`;
  }
  return periodStr;
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function generateRABText(items: RABItem[], meta: RABMetadata, grandTotal: number): string {
  let text = `*${meta.title}*\n`;
  text += `*${meta.kopOrgName || meta.organization}*\n`;
  text += `Unit Pengaju: ${meta.unit}\n`;
  text += `No. Surat: ${meta.docNumber}\n`;
  text += `Periode Anggaran: ${formatPeriodLabel(meta.period)} (${meta.period})\n`;
  text += `Tanggal: ${formatIndonesianDate(meta.submissionDate)}\n`;
  text += `--------------------------------------------------\n\n`;
  text += `DAFTAR RINCIAN ANGGARAN:\n`;

  const activeItems = items.filter((i) => i.isActive);

  activeItems.forEach((item, idx) => {
    const sub = item.qty * item.price;
    text += `${idx + 1}. [${item.category}] ${item.name}\n`;
    text += `   Jumlah: ${item.qty} unit x ${formatIDR(item.price)} = ${formatIDR(sub)}\n`;
    if (item.description) {
      text += `   Tujuan: ${item.description}\n`;
    }
  });

  text += `\n==================================================\n`;
  text += `*TOTAL PENGAJUAN BULANAN: ${formatIDR(grandTotal)}*\n`;
  text += `*Terbilang: ${terbilang(grandTotal)}*\n`;
  text += `==================================================\n\n`;

  text += `Catatan:\n${meta.notes}\n\n`;
  text += `${meta.signatureLocation || 'Jakarta'}, ${formatIndonesianDate(meta.submissionDate)}\n\n`;
  text += `Diajukan oleh:\n${meta.creatorRole}\n${meta.creatorName}\n\n`;
  text += `Menyetujui:\n${meta.approverRole}\n${meta.approverName}\n`;

  return text;
}

export function exportToCSV(items: RABItem[], meta: RABMetadata, grandTotal: number): void {
  const headers = ['No', 'Kategori', 'Nama Aplikasi', 'Tujuan / Keterangan', 'Jumlah (Unit)', 'Harga Satuan (Rp)', 'Subtotal Bulanan (Rp)', 'Status'];
  const rows = items.map((item, index) => [
    index + 1,
    `"${item.category.replace(/"/g, '""')}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${(item.description || '').replace(/"/g, '""')}"`,
    item.qty,
    item.price,
    item.isActive ? item.qty * item.price : 0,
    item.isActive ? 'Aktif' : 'Non-aktif'
  ]);

  rows.push(['', '', 'TOTAL BULANAN', '', '', '', grandTotal, '']);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
    [`"${meta.title}"`],
    [`"Instansi: ${meta.kopOrgName || meta.organization}"`],
    [`"Periode: ${formatPeriodLabel(meta.period)}"`],
    [`"No Dokumen: ${meta.docNumber}"`],
    [`"Tempat & Tanggal: ${meta.signatureLocation || 'Jakarta'}, ${formatIndonesianDate(meta.submissionDate)}"`],
    [],
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].map(e => (Array.isArray(e) ? e.join(',') : e)).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `RAB_Media_Digital_${meta.period}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
