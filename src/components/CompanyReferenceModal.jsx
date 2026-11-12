import React, { useState, useMemo } from 'react';
import { X, Search, Building2, Check } from 'lucide-react';

export default function CompanyReferenceModal({
  isOpen,
  onClose,
  stockList = [],
  onSelectCompany,
  isGameOver = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');

  // Sort from highest weighted component to lowest weighted component
  const sortedCompanies = useMemo(() => {
    return [...stockList]
      .sort((a, b) => (b.marketCapNum || 0) - (a.marketCapNum || 0))
      .map((company, index) => ({
        ...company,
        weightRank: index + 1,
      }));
  }, [stockList]);

  // Extract unique sectors for quick filtering
  const sectors = useMemo(() => {
    const set = new Set(sortedCompanies.map((c) => c.sector).filter(Boolean));
    return ['ALL', ...Array.from(set).sort()];
  }, [sortedCompanies]);

  // Filtered view by search and sector
  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedCompanies.filter((c) => {
      const matchesSearch =
        !q ||
        c.ticker.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q);

      const matchesSector =
        selectedSector === 'ALL' || c.sector === selectedSector;

      return matchesSearch && matchesSector;
    });
  }, [sortedCompanies, searchQuery, selectedSector]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/50 flex items-start justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold tracking-tight text-slate-100">
                Nasdaq Company Reference List
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Top 100 components sorted from highest weighted (#1) to lowest weighted (#100). Market cap values are concealed.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker, company name, or sector..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Sector Select Dropdown */}
          <div className="sm:w-56">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-300 focus:outline-none focus:border-cyan-500 transition cursor-pointer font-mono"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'ALL' ? 'All Sectors (100)' : sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No companies match your search or filter.
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.ticker}
                className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 hover:bg-slate-800/40 transition group"
              >
                {/* Left: Weight Rank, Ticker, Name */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <span className="w-8 text-center font-mono font-bold text-xs text-slate-500 flex-shrink-0">
                    #{item.weightRank}
                  </span>

                  {/* Ticker Badge */}
                  <span className="px-2.5 py-1 rounded-md font-mono font-bold text-xs bg-slate-800 border border-slate-700 text-cyan-300 flex-shrink-0">
                    {item.ticker}
                  </span>

                  {/* Name */}
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-slate-200 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400 sm:hidden block truncate">
                      {item.sector}
                    </span>
                  </div>
                </div>

                {/* Right: Sector Badge & Select Action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Sector Badge (hidden on mobile to save space) */}
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-950/60 text-slate-300 border border-slate-800">
                    {item.sector}
                  </span>

                  {/* Choose / Select Company Button */}
                  {!isGameOver && onSelectCompany && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCompany(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700 hover:border-emerald-500 transition cursor-pointer"
                      title={`Select ${item.ticker} for your guess`}
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span>
            Showing {filteredList.length} of 100 companies
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
