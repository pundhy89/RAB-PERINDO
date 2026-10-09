import React from 'react';
import { RABMetadata } from '../types';
import { formatPeriodLabel, formatIndonesianDate } from '../utils';
import { PerindoLogo } from './PerindoLogo';
import { Calendar, FileText, Building2, ShieldCheck, Edit3, Image as ImageIcon } from 'lucide-react';

interface Props {
  metadata: RABMetadata;
  onEditMetadata: (initialTab?: 'kop' | 'info' | 'ttd') => void;
}

export const OfficialLetterhead: React.FC<Props> = ({ metadata, onEditMetadata }) => {
  if (metadata.showKopSurat === false) {
    return (
      <div className="bg-white p-6 border-b border-slate-200">
        <div className="flex items-center justify-between no-print">
          <span className="text-xs text-slate-400 italic">Kop surat dinonaktifkan</span>
          <button
            onClick={() => onEditMetadata('kop')}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Aktifkan & Atur Kop Surat</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Official Kop Surat (Visible both in screen and print) */}
      <div className="p-6 sm:p-8 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {/* Logo: Custom uploaded or vector Perindo */}
            {metadata.kopLogoUrl ? (
              <img
                src={metadata.kopLogoUrl}
                alt="Logo Instansi"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
            ) : (
              <PerindoLogo size={70} />
            )}

            <div>
              {metadata.kopHeaderTitle && (
                <div className="text-xs font-bold tracking-widest text-red-600 uppercase">
                  {metadata.kopHeaderTitle}
                </div>
              )}
              <h1 className="text-xl sm:text-2xl font-extrabold text-blue-950 tracking-tight">
                {metadata.kopOrgName}
              </h1>
              {metadata.kopSubTitle && (
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                  {metadata.kopSubTitle}
                </p>
              )}
              {metadata.kopAddress && (
                <p className="text-xs text-slate-500 mt-1">
                  {metadata.kopAddress}
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2 text-right shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Draf Resmi Pengajuan</span>
            </div>
            <button
              onClick={() => onEditMetadata('kop')}
              className="no-print inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-medium px-2.5 py-1 rounded hover:bg-slate-100 transition"
              title="Atur logo, judul kop, sub judul, dan alamat"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Kop Surat & Logo</span>
            </button>
          </div>
        </div>

        {/* Double Line Kop Surat Official Signature */}
        <div className="relative mb-6">
          <div className="h-1 bg-slate-900 w-full mb-0.5"></div>
          <div className="h-0.5 bg-slate-400 w-full"></div>
        </div>

        {/* Document Title & Meta Box */}
        <div className="text-center my-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 uppercase">
            {metadata.title}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2 text-xs text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              No: <strong className="text-slate-800">{metadata.docNumber}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Periode Anggaran: <strong className="text-blue-900">{formatPeriodLabel(metadata.period)}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Tanggal: <strong className="text-slate-800">{formatIndonesianDate(metadata.submissionDate)}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
