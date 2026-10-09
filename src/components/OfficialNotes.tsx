import React from 'react';
import { RABMetadata } from '../types';
import { AlertCircle, Edit2 } from 'lucide-react';

interface Props {
  metadata: RABMetadata;
  onEditNotes: () => void;
}

export const OfficialNotes: React.FC<Props> = ({ metadata, onEditNotes }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 text-xs text-slate-700 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-800">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Catatan Penting & Justifikasi Pengajuan</span>
        </div>
        <button
          onClick={onEditNotes}
          className="no-print inline-flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-medium"
        >
          <Edit2 className="w-3 h-3" />
          <span>Edit Catatan</span>
        </button>
      </div>
      <p className="leading-relaxed text-slate-600 whitespace-pre-line">
        {metadata.notes}
      </p>
      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <span>• Prioritas 1: Pengelolaan kanal digital, produksi konten multimedia & website resmi</span>
        <span>• Prioritas 2: Keamanan akun sosial media, Google Workspace & kolaborasi tim</span>
        <span>• Prioritas 3: Belanja penayangan iklan digital disesuaikan persetujuan pimpinan DPP</span>
      </div>
    </div>
  );
};
