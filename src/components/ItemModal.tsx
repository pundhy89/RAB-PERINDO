import React, { useState } from 'react';
import { RABItem, DEFAULT_CATEGORIES } from '../types';
import { X, Sparkles, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<RABItem, 'id'>) => void;
  categories: string[];
}

const PRESETS = [
  { category: 'AI & produktivitas', name: 'Claude Pro (Anthropic)', price: 320000, desc: 'Analisis dokumen panjang & perumusan teks kebijakan strategis' },
  { category: 'Desain & konten', name: 'Adobe Creative Cloud', price: 840000, desc: 'Produksi video resolusi tinggi & materi kampanye baliho cetak' },
  { category: 'Kolaborasi', name: 'Zoom Pro Official', price: 250000, desc: 'Koordinasi rapat pengurus virtual DPP & DPD se-Indonesia tanpa batas waktu' },
  { category: 'Desain & konten', name: 'Midjourney AI', price: 475000, desc: 'Eksplorasi visual konsep kreatif & aset ilustrasi kampanye digital' },
  { category: 'Kolaborasi', name: 'Buffer / Hootsuite Team', price: 230000, desc: 'Penjadwalan otomatis multi-platform & analitik interaksi warganet' },
  { category: 'Website', name: 'Cloudflare Pro Security', price: 320000, desc: 'Proteksi DDoS server portal berita & SSL sertifikat resmi partai' },
];

export const ItemModal: React.FC<Props> = ({ isOpen, onClose, onSave, categories }) => {
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(150000);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setCategory(preset.category);
    setIsCustomCategory(false);
    setName(preset.name);
    setPrice(preset.price);
    setDescription(preset.desc);
    setQty(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalCategory = isCustomCategory ? customCategory.trim() || 'Lainnya' : category;

    onSave({
      category: finalCategory,
      name: name.trim(),
      description: description.trim(),
      qty: Math.max(1, qty),
      price: Math.max(0, price),
      isActive: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Tambah Item Anggaran Baru</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan aplikasi atau biaya operasional digital media Partai Perindo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-4 bg-blue-50/50 border-b border-blue-100 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-blue-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>Pilihan Cepat Aplikasi Populer:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-[11px] bg-white hover:bg-blue-100 text-slate-700 hover:text-blue-900 border border-slate-200 px-2.5 py-1 rounded-md transition"
              >
                + {p.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori Anggaran
            </label>
            <div className="flex gap-2">
              {!isCustomCategory ? (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomCategory(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                >
                  {Array.from(new Set([...DEFAULT_CATEGORIES, ...categories])).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Tambah Kategori Baru...</option>
                </select>
              ) : (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Nama kategori baru..."
                    className="w-full text-xs bg-white border border-blue-600 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="text-xs px-2.5 py-1 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Aplikasi / Layanan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Midjourney AI Pro, Zoom Pro, Adobe CC"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fungsi / Justifikasi Kebutuhan
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan penggunaan aplikasi ini untuk kegiatan media digital partai..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Qty & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah (Unit / Lisensi)
              </label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harga Bulanan (Rp)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Subtotal Terhitung:</span>
            <span className="font-mono font-bold text-blue-900 text-sm tabular-nums">
              Rp {((qty || 0) * (price || 0)).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan ke Tabel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
