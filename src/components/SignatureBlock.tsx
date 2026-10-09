import React from 'react';
import { RABMetadata } from '../types';
import { formatIndonesianDate } from '../utils';
import { Edit3 } from 'lucide-react';

interface Props {
  metadata: RABMetadata;
  onEditSignatures?: () => void;
}

export const SignatureBlock: React.FC<Props> = ({ metadata, onEditSignatures }) => {
  return (
    <div className="pt-4 pb-2 text-xs text-slate-800 relative group">
      {/* City/Address and Submission Date above signatures */}
      <div className="flex items-center justify-between mb-4">
        <div className="no-print">
          {onEditSignatures && (
            <button
              type="button"
              onClick={onEditSignatures}
              className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-semibold px-2.5 py-1 rounded hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
              title="Ubah jabatan, nama pejabat, atau alamat pengesahan"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Jabatan & Tanda Tangan</span>
            </button>
          )}
        </div>
        <div className="text-right text-slate-800 font-semibold text-xs sm:text-sm">
          {metadata.signatureLocation ? metadata.signatureLocation : 'Jakarta'}, {formatIndonesianDate(metadata.submissionDate)}
        </div>
      </div>

      {/* 2-Column Official Signatures: Jabatan di bawah nama, bukan di atas */}
      <div className="grid grid-cols-2 gap-6 sm:gap-16 text-center max-w-3xl mx-auto">
        {/* Signatory 1: Creator / Pengaju */}
        <div className="flex flex-col items-center">
          <div className="text-slate-600 font-semibold text-xs">
            Diajukan oleh,
          </div>

          {/* Signature Blank Space */}
          <div className="h-16 sm:h-20 w-full flex items-center justify-center">
            {/* Clean space for physical signature or stamp */}
          </div>

          {/* Name in parentheses */}
          <div className="w-48 sm:w-56 border-b border-slate-900 font-bold text-slate-900 pb-1 text-xs sm:text-sm">
            ( {metadata.creatorName || 'Nama Pembuat'} )
          </div>

          {/* Jabatan dipindah tepat di bawah nama */}
          <div className="text-xs text-slate-700 font-medium mt-1">
            {metadata.creatorRole || 'Koordinator Media Digital'}
          </div>
        </div>

        {/* Signatory 2: Approver (Menyetujui) */}
        <div className="flex flex-col items-center">
          <div className="text-slate-600 font-semibold text-xs">
            Menyetujui,
          </div>

          {/* Signature Blank Space */}
          <div className="h-16 sm:h-20 w-full flex items-center justify-center">
            {/* Clean space for physical signature or stamp */}
          </div>

          {/* Name in parentheses */}
          <div className="w-48 sm:w-56 border-b border-slate-900 font-bold text-slate-900 pb-1 text-xs sm:text-sm">
            ( {metadata.approverName || 'Nama Penyetuju'} )
          </div>

          {/* Jabatan dipindah tepat di bawah nama */}
          <div className="text-xs text-slate-700 font-medium mt-1">
            {metadata.approverRole || 'Bendahara Umum DPP'}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2.5">
        Dokumen Rencana Anggaran Biaya Resmi • Dewan Pimpinan Pusat Partai Perindo • Dibuat oleh: pundhy p.
      </div>
    </div>
  );
};
