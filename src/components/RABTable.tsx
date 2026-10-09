import React, { useState } from 'react';
import { RABItem } from '../types';
import { formatIDR, terbilang } from '../utils';
import { Plus, Trash2, Copy, Check, ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface Props {
  items: RABItem[];
  filterCategory: string;
  searchQuery: string;
  onUpdateQty: (id: string, qty: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onToggleActive: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
  onOpenAddItemModal: () => void;
  grandTotal: number;
}

export const RABTable: React.FC<Props> = ({
  items,
  filterCategory,
  searchQuery,
  onUpdateQty,
  onUpdatePrice,
  onToggleActive,
  onDeleteItem,
  onDuplicateItem,
  onOpenAddItemModal,
  grandTotal,
}) => {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const toggleNote = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      filterCategory === 'all' || item.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-3 text-center w-12 no-print">Status</th>
              <th className="py-3 px-3 w-10 text-center">No</th>
              <th className="py-3 px-4 min-w-[140px]">Kategori</th>
              <th className="py-3 px-4 min-w-[220px]">Nama Aplikasi & Spesifikasi</th>
              <th className="py-3 px-3 text-center min-w-[100px]">Jumlah</th>
              <th className="py-3 px-4 text-right min-w-[170px]">Harga Satuan (Rp)</th>
              <th className="py-3 px-4 text-right min-w-[180px]">Subtotal (Rp)</th>
              <th className="py-3 px-3 text-center w-20 no-print">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-700">Tidak ada item ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Coba sesuaikan kata kunci pencarian atau kategori filter Anda.
                  </p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const subtotal = item.qty * item.price;
                const isExpanded = expandedNotes[item.id] || false;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      !item.isActive ? 'bg-slate-50/50 opacity-60' : ''
                    }`}
                  >
                    {/* Active Checkbox (No-Print) */}
                    <td className="py-3 px-3 text-center no-print">
                      <button
                        type="button"
                        onClick={() => onToggleActive(item.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mx-auto ${
                          item.isActive
                            ? 'bg-blue-700 border-blue-700 text-white'
                            : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                        }`}
                        title={item.isActive ? 'Aktif dalam perhitungan anggaran' : 'Dinonaktifkan'}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </td>

                    {/* Row Number */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-slate-500">
                      {index + 1}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-slate-700">
                        {item.category}
                      </span>
                    </td>

                    {/* Name & Expandable Purpose */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      {item.description && (
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() => toggleNote(item.id)}
                            className="no-print text-[11px] text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 font-medium"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                            <span>{isExpanded ? 'Sembunyikan rincian fungsi' : 'Rincian fungsi & justifikasi'}</span>
                          </button>
                          {/* Visible in print always, or toggled on screen */}
                          <p
                            className={`text-xs text-slate-500 mt-0.5 leading-relaxed ${
                              isExpanded ? 'block' : 'hidden print:block'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Quantity with Steppers in screen view */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, Math.max(0, item.qty - 1))}
                          className="no-print w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={item.qty}
                          onChange={(e) => onUpdateQty(item.id, parseInt(e.target.value, 10) || 0)}
                          className="w-14 text-center font-mono text-sm py-1 px-1 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          className="no-print w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Price per unit */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-xs text-slate-400 font-mono no-print">Rp</span>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={item.price}
                          onChange={(e) =>
                            onUpdatePrice(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-32 text-right font-mono text-sm py-1 px-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:outline-none transition tabular-nums"
                        />
                      </div>
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {item.isActive ? formatIDR(subtotal) : <span className="text-slate-400 line-through">Rp 0</span>}
                    </td>

                    {/* Actions (No-Print) */}
                    <td className="py-3 px-3 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicateItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                          title="Duplikasi baris ini"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Action & Grand Total Bar */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="no-print flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenAddItemModal}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-blue-900 font-semibold text-xs rounded-lg border border-slate-300 shadow-xs transition active:scale-98"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            <span>Tambah Aplikasi / Biaya Baru</span>
          </button>
        </div>

        <div className="text-right w-full md:w-auto">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-0.5">
            Total Pengeluaran Bulanan (Grand Total)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-mono tabular-nums">
            {formatIDR(grandTotal)}
          </div>
        </div>
      </div>

      {/* Terbilang Official Note */}
      <div className="px-6 py-3.5 bg-blue-50/60 border-t border-blue-100 text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-blue-800 shrink-0">
            Terbilang:
          </span>
          <span className="italic font-medium text-slate-800">
            "{terbilang(grandTotal)}"
          </span>
        </div>
      </div>
    </div>
  );
};
