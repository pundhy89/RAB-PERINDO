import React, { useState, useEffect, useRef } from 'react';
import { RABMetadata } from '../types';
import { PerindoLogo } from './PerindoLogo';
import { X, Save, RotateCcw, Upload, Trash2, Building, FileText, UserCheck, Eye } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  metadata: RABMetadata;
  initialTab?: 'kop' | 'info' | 'ttd';
  onSave: (meta: RABMetadata) => void;
  onReset: () => void;
}

export const MetaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  metadata,
  initialTab = 'kop',
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<RABMetadata>(metadata);
  const [activeTab, setActiveTab] = useState<'kop' | 'info' | 'ttd'>(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize only when the modal opens to avoid resetting user inputs during edits
  useEffect(() => {
    if (isOpen) {
      setFormData(metadata);
      setActiveTab(initialTab || 'kop');
    }
  }, [isOpen, initialTab, metadata]);

  if (!isOpen) return null;

  const handleChange = (field: keyof RABMetadata, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file logo terlalu besar. Maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleChange('kopLogoUrl', event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    handleChange('kopLogoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Pengaturan Dokumen & Kop Surat (F4 1 Lembar)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ubah jabatan pejabat, nama pengesah, kop surat, dan informasi dokumen
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-4 pt-2 shrink-0 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ttd')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'ttd'
                ? 'bg-white text-blue-900 border-slate-200 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1. Jabatan & Tanda Tangan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kop')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'kop'
                ? 'bg-white text-blue-900 border-slate-200 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>2. Kop Surat & Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-t border-x ${
              activeTab === 'info'
                ? 'bg-white text-blue-900 border-slate-200 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>3. Catatan & Justifikasi Pengajuan</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto grow">
          {/* TAB 1: JABATAN & TANDA TANGAN */}
          {activeTab === 'ttd' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* Form field alamat untuk diatas tanda tangan */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                <label className="block text-xs font-bold text-blue-950 mb-1">
                  Kota / Alamat Tempat Pengesahan (Diatas Tanda Tangan) <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-blue-800/80 mb-2">
                  Teks ini akan tercetak di atas kolom tanda tangan (misal: "<strong>{formData.signatureLocation || 'Jakarta'}</strong>, 8 Oktober 2026")
                </p>
                <input
                  type="text"
                  required
                  value={formData.signatureLocation}
                  onChange={(e) => handleChange('signatureLocation', e.target.value)}
                  placeholder="Contoh: Jakarta / Jakarta Pusat / Menteng, Jakarta"
                  className="w-full text-xs font-medium bg-white border border-blue-300 rounded-lg p-2.5 text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Edit Dua Pihak Pengesah Dokumen (Pembuat & Penyetuju)
                </h4>

                <div className="space-y-3">
                  {/* Creator / Diajukan oleh */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-blue-950 flex items-center justify-between">
                      <span>PIHAK 1: PEMBUAT / PENGAJU</span>
                      <span className="text-[11px] text-slate-400 font-normal">Kolom Kiri</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Jabatan Pembuat / Pengaju <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.creatorRole}
                          onChange={(e) => {
                            handleChange('creatorRole', e.target.value);
                            // Also sync unit if unit matches previous creatorRole
                            if (!formData.unit || formData.unit === formData.creatorRole) {
                              handleChange('unit', e.target.value);
                            }
                          }}
                          placeholder="Contoh: Koordinator Media Digital"
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:border-blue-600 focus:outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nama Lengkap & Gelar Pembuat <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.creatorName}
                          onChange={(e) => handleChange('creatorName', e.target.value)}
                          placeholder="Contoh: M. Rizky Pratama, S.I.Kom."
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:border-blue-600 focus:outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Keterangan Unit / Bagian (Di Bawah Nama Pembuat)
                      </label>
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) => handleChange('unit', e.target.value)}
                        placeholder="Contoh: Koordinator Media Digital"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 text-slate-700 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Approver / Menyetujui */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-blue-950 flex items-center justify-between">
                      <span>PIHAK 2: PENYETUJU</span>
                      <span className="text-[11px] text-slate-400 font-normal">Kolom Kanan</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Jabatan Penyetuju <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.approverRole}
                          onChange={(e) => handleChange('approverRole', e.target.value)}
                          placeholder="Contoh: Bendahara Umum DPP Partai Perindo"
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:border-blue-600 focus:outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nama Lengkap & Gelar Penyetuju <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.approverName}
                          onChange={(e) => handleChange('approverName', e.target.value)}
                          placeholder="Contoh: H. Bambang Soetrisno, S.E., M.M."
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:border-blue-600 focus:outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Box of the Signatures */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Eye className="w-3.5 h-3.5 text-blue-700" />
                  <span>Pratinjau Hasil Lembar Tanda Tangan:</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center bg-white p-3 rounded-lg border border-slate-200 text-[11px]">
                  <div>
                    <div className="text-slate-500">Diajukan oleh:</div>
                    <div className="font-bold text-slate-900 mt-0.5">{formData.creatorRole || '-'}</div>
                    <div className="mt-6 border-b border-slate-400 font-bold pb-0.5">
                      ( {formData.creatorName || '-'} )
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{formData.unit || formData.creatorRole}</div>
                  </div>

                  <div>
                    <div className="text-slate-500">Menyetujui:</div>
                    <div className="font-bold text-slate-900 mt-0.5">{formData.approverRole || '-'}</div>
                    <div className="mt-6 border-b border-slate-400 font-bold pb-0.5">
                      ( {formData.approverName || '-'} )
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{formData.kopOrgName || 'Dewan Pimpinan Pusat'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOP SURAT & LOGO */}
          {activeTab === 'kop' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* Toggle show/hide */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <div className="text-xs font-bold text-slate-800">Tampilkan Kop Surat Resmi</div>
                  <div className="text-[11px] text-slate-500">
                    Sertakan kop surat resmi pada tampilan dokumen dan hasil cetak PDF F4
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showKopSurat}
                    onChange={(e) => handleChange('showKopSurat', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-700"></div>
                </label>
              </div>

              {/* Logo Upload Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Logo Kop Surat
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shrink-0 shadow-xs">
                    {formData.kopLogoUrl ? (
                      <img
                        src={formData.kopLogoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <PerindoLogo size={60} />
                    )}
                  </div>

                  <div className="grow space-y-2 text-center sm:text-left">
                    <div className="text-xs text-slate-600">
                      {formData.kopLogoUrl
                        ? 'Menggunakan logo kustom unggahan Anda.'
                        : 'Menggunakan lambang resmi bawaan Partai Perindo.'}
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logoUploadInput"
                      />
                      <label
                        htmlFor="logoUploadInput"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg cursor-pointer transition shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo Baru</span>
                      </label>

                      {formData.kopLogoUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveCustomLogo}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Gunakan Lambang Perindo Bawaan</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Text Elements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Kop Atas (Kecil/Merah)
                </label>
                <input
                  type="text"
                  value={formData.kopHeaderTitle}
                  onChange={(e) => handleChange('kopHeaderTitle', e.target.value)}
                  placeholder="Contoh: DEWAN PIMPINAN PUSAT"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Instansi / Organisasi (Utama) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.kopOrgName}
                  onChange={(e) => handleChange('kopOrgName', e.target.value)}
                  placeholder="Contoh: PARTAI PERSATUAN INDONESIA (PERINDO)"
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sub Judul / Unit Organisasi
                </label>
                <input
                  type="text"
                  value={formData.kopSubTitle}
                  onChange={(e) => handleChange('kopSubTitle', e.target.value)}
                  placeholder="Contoh: Koordinator Media Digital • Biro Komunikasi & Kampanye Digital"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan / Alamat Kantor Kop Surat
                </label>
                <textarea
                  rows={2}
                  value={formData.kopAddress}
                  onChange={(e) => handleChange('kopAddress', e.target.value)}
                  placeholder="Contoh: Kantor DPP: Jl. Pangeran Diponegoro No. 29, Menteng, Jakarta Pusat 10310 • www.partaiperindo.com"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: INFORMASI DOKUMEN */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Surat Dokumen
                  </label>
                  <input
                    type="text"
                    value={formData.docNumber}
                    onChange={(e) => handleChange('docNumber', e.target.value)}
                    placeholder="Contoh: 018/RAB-MD/DPP-PERINDO/XI/2026"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Periode Anggaran (YYYY-MM)
                  </label>
                  <input
                    type="month"
                    value={formData.period}
                    onChange={(e) => handleChange('period', e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Dokumen Resmi
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Pengajuan
                  </label>
                  <input
                    type="date"
                    value={formData.submissionDate}
                    onChange={(e) => handleChange('submissionDate', e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan & Justifikasi Pengajuan
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Tuliskan catatan dan justifikasi pengajuan anggaran..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Kembalikan seluruh informasi dokumen dan kop surat ke draf awal Partai Perindo?')) {
                  onReset();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Draf Awal</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
