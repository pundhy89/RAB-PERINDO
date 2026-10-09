/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { RABItem, RABMetadata, INITIAL_RAB_DATA, INITIAL_METADATA, DEFAULT_CATEGORIES } from './types';
import { generateRABText, exportToCSV } from './utils';
import { exportElementToF4PDF, generateNativeF4PDF } from './utils/pdfExport';
import { OfficialLetterhead } from './components/OfficialLetterhead';
import { BudgetStats } from './components/BudgetStats';
import { CategoryFilter } from './components/CategoryFilter';
import { RABTable } from './components/RABTable';
import { SignatureBlock } from './components/SignatureBlock';
import { ItemModal } from './components/ItemModal';
import { MetaModal } from './components/MetaModal';
import { CopyTextModal } from './components/CopyTextModal';
import {
  Printer,
  FileDown,
  Copy,
  Download,
  Settings,
  RotateCcw,
  CheckCircle2,
  Layers,
  Loader2,
  Building,
} from 'lucide-react';

// Persistent storage keys that never get wiped out between sessions or previews
const STORAGE_KEY_ITEMS = 'perindo_rab_items_stable';
const STORAGE_KEY_META = 'perindo_rab_metadata_stable';

export default function App() {
  // Load initial state with backwards-compatible migration so user settings are never lost
  const [items, setItems] = useState<RABItem[]>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY_ITEMS) ||
        localStorage.getItem('perindo_rab_items_v3') ||
        localStorage.getItem('perindo_rab_items_v2') ||
        localStorage.getItem('perindo_rab_items_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return INITIAL_RAB_DATA;
  });

  const [metadata, setMetadata] = useState<RABMetadata>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY_META) ||
        localStorage.getItem('perindo_rab_metadata_v3') ||
        localStorage.getItem('perindo_rab_metadata_v2') ||
        localStorage.getItem('perindo_rab_metadata_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_METADATA, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return INITIAL_METADATA;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [metaModalTab, setMetaModalTab] = useState<'kop' | 'info' | 'ttd'>('ttd');
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeNav, setActiveNav] = useState<string>('pdf');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage immediately whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_META, JSON.stringify(metadata));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [metadata]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Grand total calculation of active items
  const grandTotal = useMemo(() => {
    return items.reduce((acc, curr) => {
      if (!curr.isActive) return acc;
      return acc + (curr.qty || 0) * (curr.price || 0);
    }, 0);
  }, [items]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    items.forEach((item) => set.add(item.category));
    return Array.from(set);
  }, [items]);

  // Counts per category
  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Handlers for table manipulation
  const handleUpdateQty = (id: string, qty: number) => {
    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, qty: Math.max(0, qty) } : item));
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdatePrice = (id: string, price: number) => {
    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, price: Math.max(0, price) } : item));
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleActive = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item));
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Hapus item anggaran ini dari tabel?')) {
      setItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        try {
          localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast('Item berhasil dihapus');
    }
  };

  const handleDuplicateItem = (id: string) => {
    const itemToDup = items.find((i) => i.id === id);
    if (!itemToDup) return;
    const newItem: RABItem = {
      ...itemToDup,
      id: `item-${Date.now()}`,
      name: `${itemToDup.name} (Salinan)`,
    };
    setItems((prev) => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Item berhasil diduplikasi');
  };

  const handleAddItem = (newItemData: Omit<RABItem, 'id'>) => {
    const newItem: RABItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
    };
    setItems((prev) => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`"${newItem.name}" ditambahkan ke tabel`);
  };

  const handleResetToDefault = () => {
    if (confirm('Perhatian: Anda akan mengembalikan seluruh data ke draf bawaan. Lanjutkan?')) {
      setItems(INITIAL_RAB_DATA);
      setMetadata(INITIAL_METADATA);
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_RAB_DATA));
        localStorage.setItem(STORAGE_KEY_META, JSON.stringify(INITIAL_METADATA));
      } catch {}
      showToast('Draf dikembalikan ke pengaturan awal');
    }
  };

  const handleQuickCopy = async () => {
    const rabText = generateRABText(items, metadata, grandTotal);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(rabText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = rabText;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Teks ringkasan RAB berhasil disalin ke clipboard!');
    } catch {
      setIsCopyModalOpen(true);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(items, metadata, grandTotal);
    showToast('File CSV berhasil diunduh');
  };

  // Dedicated 1-Sheet F4 PDF Downloader (Auto-fit, complete table, logo visible, no empty space)
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    showToast('Menyusun PDF F4 auto-fit (1 lembar penuh)...');
    try {
      const filename = `RAB_Media_Digital_Perindo_${metadata.period}_F4.pdf`;
      generateNativeF4PDF(items, metadata, grandTotal, filename);
      showToast('Berkas PDF 1 Lembar F4 berhasil diunduh!');
    } catch (error) {
      console.warn('Native generation error, trying fallback:', error);
      try {
        const filename = `RAB_Media_Digital_Perindo_${metadata.period}_F4.pdf`;
        await exportElementToF4PDF('printableDocument', items, metadata, grandTotal, filename);
        showToast('Berkas PDF 1 Lembar F4 berhasil diunduh!');
      } catch (err2) {
        showToast('Gagal mengunduh PDF. Silakan coba kembali.');
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Safe Print Handler with automatic F4 PDF download fallback
  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (err) {
      console.warn('Iframe print blocked, initiating F4 PDF download fallback:', err);
      handleDownloadPDF();
    }
  };

  const openMetaModalWithTab = (tab?: 'kop' | 'info' | 'ttd') => {
    setMetaModalTab(tab || 'ttd');
    setIsMetaModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-24 pt-2 sm:pt-4">
      {/* 
        NO TOP BORDER OR TOP MENU:
        The top menu and borders above the kop surat have been completely removed as requested
        ("Hapus border/semua menu paling atas").
        The document begins immediately with the official Kop Surat.
      */}

      {/* Main Workspace Canvas */}
      <main className="max-w-5xl mx-auto px-2 sm:px-6">
        {/* 
          THE OFFICIAL F4 DOCUMENT SHEET CONTAINER
          Styled to maximize F4 presence without dead whitespace or top border clutter.
        */}
        <div
          id="printableDocument"
          className="print-container bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden"
        >
          {/* Official Kop Surat Letterhead (Directly at the very top, zero borders above it) */}
          <OfficialLetterhead
            metadata={metadata}
            onEditMetadata={openMetaModalWithTab}
          />

          <div className="p-4 sm:p-7 space-y-6">
            {/* Visual Overview Statistics (No-Print) */}
            <div className="no-print">
              <BudgetStats items={items} grandTotal={grandTotal} />
            </div>

            {/* Filter Controls & Search Bar (No-Print) */}
            <div className="space-y-3 no-print">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                    Daftar Rincian Anggaran Aplikasi Digital
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {items.filter((i) => i.isActive).length} item aktif diajukan
                </span>
              </div>

              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                itemCounts={itemCounts}
                totalCount={items.length}
              />
            </div>

            {/* The Complete Interactive Table (Maximized F4 Layout) */}
            <RABTable
              items={items}
              filterCategory={activeCategory}
              searchQuery={searchQuery}
              onUpdateQty={handleUpdateQty}
              onUpdatePrice={handleUpdatePrice}
              onToggleActive={handleToggleActive}
              onDeleteItem={handleDeleteItem}
              onDuplicateItem={handleDuplicateItem}
              onOpenAddItemModal={() => setIsAddItemOpen(true)}
              grandTotal={grandTotal}
            />

            {/* Catatan penting dalam tulisan miring di atas tanda tangan / di bawah jumlah harga */}
            {metadata.notes && (
              <div className="text-xs text-slate-600 leading-relaxed italic px-1 pt-1 pb-1">
                <span className="font-bold not-italic text-slate-800 mr-1.5">Catatan Penting:</span>
                <span>{metadata.notes}</span>
              </div>
            )}

            {/* Legal Indonesian Signatory Block with "Dibuat oleh: pundhy p." at footer */}
            <SignatureBlock
              metadata={metadata}
              onEditSignatures={() => openMetaModalWithTab('ttd')}
            />
          </div>
        </div>

        {/* 
          NOTE: Duplicate highlighted footer text has been removed as requested 
          ("Hapus tulisan yang di stabilo paling bawah, karena sudah tampil diatasnya").
        */}
      </main>

      {/* 
        MINIMALIST ICON-ONLY NAVBAR:
        - Ikon simpel tanpa tulisan
        - Border transparan 50% warna putih: border-white/50
        - Ikon aktif: biru (text-blue-500)
        - Ikon tidak aktif: abu-abu (text-slate-400)
      */}
      <nav 
        aria-label="Menu Aksi Dokumen"
        className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-950/85 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-2xl border border-white/50 flex items-center gap-1"
      >
        {/* 1. Unduh PDF F4 */}
        <button
          type="button"
          disabled={isGeneratingPDF}
          onClick={() => {
            setActiveNav('pdf');
            handleDownloadPDF();
          }}
          className={`p-2.5 rounded-full transition-colors ${
            activeNav === 'pdf'
              ? 'text-blue-500 bg-blue-500/15'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Unduh Berkas PDF (1 Lembar F4)"
        >
          {isGeneratingPDF ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <FileDown className="w-5 h-5" />
          )}
        </button>

        {/* 2. Cetak Dokumen */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('print');
            handlePrint();
          }}
          className={`p-2.5 rounded-full transition-colors ${
            activeNav === 'print'
              ? 'text-blue-500 bg-blue-500/15'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Cetak Dokumen (Print F4)"
        >
          <Printer className="w-5 h-5" />
        </button>

        <div className="h-4 w-px bg-white/25 mx-0.5" />

        {/* 3. Ubah Jabatan & Pejabat Pengesah */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('ttd');
            openMetaModalWithTab('ttd');
          }}
          className={`p-2.5 rounded-full transition-colors ${
            activeNav === 'ttd'
              ? 'text-blue-500 bg-blue-500/15'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Ubah Jabatan & Pejabat Pengesah"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* 4. Kop Surat & Logo */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('kop');
            openMetaModalWithTab('kop');
          }}
          className={`p-2.5 rounded-full transition-colors ${
            activeNav === 'kop'
              ? 'text-blue-500 bg-blue-500/15'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Pengaturan Kop Surat & Logo"
        >
          <Building className="w-5 h-5" />
        </button>

        {/* 5. Salin Teks RAB */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('copy');
            handleQuickCopy();
          }}
          className={`p-2.5 rounded-full transition-colors ${
            activeNav === 'copy'
              ? 'text-blue-500 bg-blue-500/15'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Salin Teks RAB (WhatsApp/Email)"
        >
          <Copy className="w-5 h-5" />
        </button>

        {/* 6. Ekspor CSV */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('csv');
            handleExportCSV();
          }}
          className={`p-2.5 rounded-full transition-colors ${
            activeNav === 'csv'
              ? 'text-blue-500 bg-blue-500/15'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Ekspor Data ke Excel / CSV"
        >
          <Download className="w-5 h-5" />
        </button>

        <div className="h-4 w-px bg-white/25 mx-0.5" />

        {/* 7. Reset Draf Semula */}
        <button
          type="button"
          onClick={handleResetToDefault}
          className="p-2.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Kembalikan ke Draf Awal Bawaan"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </nav>

      {/* Item Modal (Add/Edit) */}
      <ItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSave={handleAddItem}
        categories={categories}
      />

      {/* Metadata & Signatories & Kop Surat Modal */}
      <MetaModal
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        metadata={metadata}
        initialTab={metaModalTab}
        onSave={(newMeta) => {
          setMetadata(newMeta);
          try {
            localStorage.setItem(STORAGE_KEY_META, JSON.stringify(newMeta));
          } catch {}
          showToast('Data jabatan dan informasi dokumen berhasil diperbarui!');
        }}
        onReset={() => {
          setMetadata(INITIAL_METADATA);
          try {
            localStorage.setItem(STORAGE_KEY_META, JSON.stringify(INITIAL_METADATA));
          } catch {}
          showToast('Data dokumen dikembalikan ke pengaturan awal');
        }}
      />

      {/* Copy Text Preview Modal */}
      <CopyTextModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        text={generateRABText(items, metadata, grandTotal)}
        onNotify={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
