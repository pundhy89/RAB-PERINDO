export interface RABItem {
  id: string;
  category: string;
  name: string;
  description?: string;
  qty: number;
  price: number;
  isActive: boolean;
}

export interface RABMetadata {
  docNumber: string;
  organization: string;
  unit: string;
  period: string; // e.g. '2026-11'
  title: string;
  submissionDate: string; // e.g. '2026-10-08'
  // Kop Surat settings
  showKopSurat: boolean;
  kopLogoUrl?: string; // base64 or custom image url, empty = use default Perindo SVG
  kopHeaderTitle: string; // e.g. "DEWAN PIMPINAN PUSAT"
  kopOrgName: string; // e.g. "PARTAI PERSATUAN INDONESIA (PERINDO)"
  kopSubTitle: string; // e.g. "Koordinator Media Digital • Biro Komunikasi & Kampanye Digital"
  kopAddress: string; // e.g. "Kantor DPP: Jl. Pangeran Diponegoro No. 29, Menteng, Jakarta Pusat 10310"
  // Signature settings (2 parties: Creator & Approver)
  signatureLocation: string; // e.g. "Jakarta" or "Jakarta Pusat"
  creatorRole: string;
  creatorName: string;
  approverRole: string;
  approverName: string;
  notes: string;
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  'Desain & konten': { bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-600' },
  'AI & produktivitas': { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-600' },
  'Kolaborasi': { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-600' },
  'Iklan digital': { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-600' },
  'Website': { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-600' },
};

export const DEFAULT_CATEGORIES = [
  'Desain & konten',
  'AI & produktivitas',
  'Kolaborasi',
  'Iklan digital',
  'Website',
];

export const INITIAL_RAB_DATA: RABItem[] = [
  {
    id: 'item-1',
    category: 'Desain & konten',
    name: 'Canva Pro / Business',
    description: 'Desain visual flyer digital, infografis kebijakan, template feed Instagram & materi relawan',
    qty: 1,
    price: 130000,
    isActive: true,
  },
  {
    id: 'item-2',
    category: 'AI & produktivitas',
    name: 'ChatGPT',
    description: 'Penyusunan draf rilis pers, copywriting konten kreatif, dan riset narasi digital',
    qty: 1,
    price: 299000,
    isActive: true,
  },
  {
    id: 'item-3',
    category: 'AI & produktivitas',
    name: 'Google AI Pro',
    description: 'Analisis sentimen isu publik, transkripsi pidato pimpinan, dan pengelolaan dokumen data',
    qty: 1,
    price: 310000,
    isActive: true,
  },
  {
    id: 'item-4',
    category: 'Kolaborasi',
    name: 'Google Workspace',
    description: 'Akun email resmi domain @partaiperindo.com, Google Drive arsip cloud, dan Google Meet',
    qty: 1,
    price: 381000,
    isActive: true,
  },
  {
    id: 'item-5',
    category: 'Iklan digital',
    name: 'Facebook Ads',
    description: 'Targeting pemilih segmen keluarga dan penyebaran program kemasyarakatan daerah',
    qty: 1,
    price: 300000,
    isActive: true,
  },
  {
    id: 'item-6',
    category: 'Iklan digital',
    name: 'Instagram Ads',
    description: 'Penguatan engagement generasi milenial & Gen-Z terhadap inisiatif digital partai',
    qty: 1,
    price: 300000,
    isActive: true,
  },
  {
    id: 'item-7',
    category: 'Iklan digital',
    name: 'TikTok Ads',
    description: 'Penyebaran video viral kreatif program nyata UMKM & kesejahteraan Perindo',
    qty: 1,
    price: 500000,
    isActive: true,
  },
  {
    id: 'item-8',
    category: 'Desain & konten',
    name: 'CapCut Pro',
    description: 'Editing cepat video pendek Reels/TikTok, efek visual resmi, auto subtitle & lisensi audio',
    qty: 1,
    price: 188000,
    isActive: true,
  },
  {
    id: 'item-9',
    category: 'Website',
    name: 'Hostinger / WordPress',
    description: 'Infrastruktur cloud hosting portal berita media digital, rilis pers & repositori publik',
    qty: 1,
    price: 116900,
    isActive: true,
  },
  {
    id: 'item-10',
    category: 'Website',
    name: 'Domain.com',
    description: 'Perpanjangan domain resmi dan subdomain layanan kampanye digital',
    qty: 1,
    price: 25000,
    isActive: true,
  },
  {
    id: 'item-11',
    category: 'Iklan digital',
    name: 'YouTube / Google Ads',
    description: 'Penayangan video siaran langsung acara nasional, podcast partai & kampanye video',
    qty: 1,
    price: 500000,
    isActive: true,
  },
];

export const INITIAL_METADATA: RABMetadata = {
  docNumber: '018/RAB-MD/DPP-PERINDO/XI/2026',
  organization: 'PARTAI PERSATUAN INDONESIA (PERINDO)',
  unit: 'Koordinator Media Digital',
  period: '2026-11',
  title: 'RAB LANGGANAN APLIKASI DIGITAL & MEDIA',
  submissionDate: '2026-10-08',
  showKopSurat: true,
  kopLogoUrl: '', // empty means use default Perindo SVG
  kopHeaderTitle: 'DEWAN PIMPINAN PUSAT',
  kopOrgName: 'PARTAI PERSATUAN INDONESIA (PERINDO)',
  kopSubTitle: 'Koordinator Media Digital • Biro Komunikasi & Kampanye Digital',
  kopAddress: 'Kantor DPP: Jl. Pangeran Diponegoro No. 29, Menteng, Jakarta Pusat 10310 • www.partaiperindo.com',
  signatureLocation: 'Jakarta',
  creatorRole: 'Koordinator Media Digital',
  creatorName: 'M. Rizky Pratama, S.I.Kom.',
  approverRole: 'Bendahara Umum DPP Partai Perindo',
  approverName: 'H. Bambang Soetrisno, S.E., M.M.',
  notes: 'Harga yang belum diisi belum termasuk dalam total. Langganan aplikasi untuk pengelolaan kanal digital, produksi konten, website, keamanan akun dan pelaporan. Anggaran iklan disesuaikan dengan persetujuan pengurus DPP.',
};
