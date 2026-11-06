import React from 'react';
import { BarChart3, X, Award, Flame, Target } from 'lucide-react';
import { loadPlayerStats } from '../utils/gameStorage';

export default function StatsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const stats = loadPlayerStats();
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const maxGuessCount = Math.max(...(stats.guessDistribution || [1]), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold tracking-tight">Game Statistics</h2>
        </div>

        {/* 4 Big Stat Numbers */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {stats.gamesPlayed}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
              Played
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              {winRate}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
              Win Rate
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold font-mono text-amber-400 flex items-center justify-center gap-0.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30" />
              <span>{stats.currentStreak}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
              Current
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-extrabold font-mono text-cyan-400 flex items-center justify-center gap-0.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>{stats.maxStreak}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
              Max Streak
            </div>
          </div>
        </div>

        {/* Guess Distribution Histogram */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Guess Distribution
          </h3>
          <div className="space-y-1.5 font-mono text-xs">
            {stats.guessDistribution.map((count, i) => {
              const widthPct = Math.max((count / maxGuessCount) * 100, 7);
              const isBest = count === maxGuessCount && count > 0;

              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 text-slate-400 text-right font-bold">{i + 1}</span>
                  <div className="flex-1 bg-slate-950/60 rounded-md overflow-hidden p-0.5 border border-slate-800/80">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`px-2 py-0.5 rounded text-right font-bold text-[11px] transition-all duration-500 ${
                        isBest
                          ? 'bg-emerald-600 text-white'
                          : count > 0
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
