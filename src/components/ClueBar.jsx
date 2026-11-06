import React from 'react';
import { Calendar, Building2, Coins, ArrowRightLeft, TrendingUp, Lock, CheckCircle2 } from 'lucide-react';

export default function ClueBar({ stock, wrongGuesses = 0, isGameOver = false }) {
  const clues = [
    {
      num: 1,
      title: 'Chart Range',
      icon: Calendar,
      unlocked: wrongGuesses >= 1 || isGameOver,
      content: stock?.dateRangeYears || '2023 – 2025',
      sub: stock?.yearSpan
        ? `${stock.yearSpan} Year${stock.yearSpan > 1 ? 's' : ''} • ${stock.pointCount} weeks`
        : stock?.pointCount ? `${stock.pointCount} weeks` : '1–5 Year Span',
      color: 'amber',
    },
    {
      num: 2,
      title: 'Sector',
      icon: Building2,
      unlocked: wrongGuesses >= 2 || isGameOver,
      content: stock?.sector || 'Unknown',
      sub: stock?.industry || '',
      color: 'blue',
    },
    {
      num: 3,
      title: 'Market Cap',
      icon: Coins,
      unlocked: wrongGuesses >= 3 || isGameOver,
      content: stock?.marketCap || '$---',
      sub: stock?.marketCapNum ? (stock.marketCapNum >= 200 ? 'Mega-Cap' : 'Large-Cap') : '',
      color: 'emerald',
    },
    {
      num: 4,
      title: 'X-Axis Labels',
      icon: ArrowRightLeft,
      unlocked: wrongGuesses >= 4 || isGameOver,
      content: 'Timeline Active',
      sub: 'Years & months labeled on chart',
      color: 'cyan',
    },
    {
      num: 5,
      title: 'Y-Axis Labels',
      icon: TrendingUp,
      unlocked: wrongGuesses >= 5 || isGameOver,
      content: 'Price Scale Active',
      sub: 'Dollar values labeled on chart',
      color: 'violet',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <span>Clue Progression</span>
          <span className="text-slate-500 font-mono text-[11px]">
            ({Math.min(wrongGuesses, 5)}/5 unlocked)
          </span>
        </span>
        <span className="text-[11px] text-slate-500">
          Wrong guesses reveal additional clues
        </span>
      </div>

      {/* Grid of 5 Clues */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {clues.map((clue) => {
          const Icon = clue.icon;
          const isUnlocked = clue.unlocked;

          return (
            <div
              key={clue.num}
              className={`relative rounded-xl p-3 border transition-all duration-300 ${
                isUnlocked
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md shadow-slate-950/40 translate-y-0'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-65'
              }`}
            >
              {/* Card Header: Clue Number & Status */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isUnlocked
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  CLUE #{clue.num}
                </span>

                {isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isUnlocked
                      ? clue.color === 'amber'
                        ? 'text-amber-400'
                        : clue.color === 'blue'
                        ? 'text-blue-400'
                        : clue.color === 'emerald'
                        ? 'text-emerald-400'
                        : clue.color === 'cyan'
                        ? 'text-cyan-400'
                        : 'text-violet-400'
                      : 'text-slate-600'
                  }`}
                />
                <span className={isUnlocked ? 'text-slate-300' : 'text-slate-500'}>
                  {clue.title}
                </span>
              </div>

              {/* Revealed Content or Locked Placeholder */}
              {isUnlocked ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="font-semibold text-slate-100 text-sm tracking-tight truncate">
                    {clue.content}
                  </div>
                  {clue.sub && (
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {clue.sub}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1">
                  <div className="text-xs text-slate-600 font-mono">
                    Guess #{clue.num} wrong
                  </div>
                  <div className="text-[10px] text-slate-600/80 truncate">
                    Tap guess to unlock
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
