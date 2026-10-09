import React from 'react';
import { RABItem, CATEGORY_COLORS } from '../types';
import { formatIDR } from '../utils';
import { CreditCard, Layers, Sparkles } from 'lucide-react';

interface Props {
  items: RABItem[];
  grandTotal: number;
}

export const BudgetStats: React.FC<Props> = ({ items, grandTotal }) => {
  const activeItems = items.filter((i) => i.isActive);

  // Breakdown by category
  const categoryTotals: Record<string, number> = {};
  items.forEach((item) => {
    if (!item.isActive) return;
    const subtotal = item.qty * item.price;
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + subtotal;
  });

  const categories = Object.keys(categoryTotals);
  const adsTotal = categoryTotals['Iklan digital'] || 0;
  const toolsTotal = grandTotal - adsTotal;
  const adsPercentage = grandTotal > 0 ? Math.round((adsTotal / grandTotal) * 100) : 0;

  return (
    <div className="no-print space-y-4">
      {/* 3 Overview Metrics (Proyeksi tahunan removed as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1: Monthly Total */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Pengeluaran Bulanan</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-blue-950 tabular-nums font-mono">
            {formatIDR(grandTotal)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Akumulasi {activeItems.length} aplikasi aktif diajukan
          </div>
        </div>

        {/* Metric 2: Active Subscriptions */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Layanan Terdaftar</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {activeItems.length}{' '}
            <span className="text-sm font-normal text-slate-500">
              / {items.length} item
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {items.length - activeItems.length > 0
              ? `${items.length - activeItems.length} layanan dinonaktifkan sementara`
              : 'Semua item masuk perhitungan'}
          </div>
        </div>

        {/* Metric 3: Ad Share vs Tools */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alokasi Iklan vs Alat</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {adsPercentage}%{' '}
            <span className="text-sm font-normal text-slate-500">
              Iklan ({formatIDR(adsTotal)})
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Alat operasional: {formatIDR(toolsTotal)}
          </div>
        </div>
      </div>

      {/* Category Distribution Bar */}
      {grandTotal > 0 && categories.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Distribusi Anggaran per Kategori</span>
            <span className="text-slate-400 font-normal">Proporsi biaya bulanan</span>
          </div>

          {/* Segmented Bar */}
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {categories.map((cat) => {
              const amount = categoryTotals[cat];
              const pct = (amount / grandTotal) * 100;
              const colorConfig = CATEGORY_COLORS[cat] || { bar: 'bg-slate-400' };
              return (
                <div
                  key={cat}
                  style={{ width: `${pct}%` }}
                  className={`${colorConfig.bar} h-full transition-all duration-300 relative group`}
                  title={`${cat}: ${formatIDR(amount)} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Clean Unboxed Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
            {categories.map((cat) => {
              const amount = categoryTotals[cat];
              const pct = (amount / grandTotal) * 100;
              const colorConfig = CATEGORY_COLORS[cat] || { bar: 'bg-slate-400' };
              return (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-xs ${colorConfig.bar}`} />
                  <span className="font-medium text-slate-800">{cat}:</span>
                  <span className="tabular-nums font-mono text-slate-700">{formatIDR(amount)}</span>
                  <span className="text-slate-400 text-[11px]">({pct.toFixed(1)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
