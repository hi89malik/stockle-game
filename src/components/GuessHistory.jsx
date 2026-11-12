import React from 'react';
import { Check, X, ArrowUp, ArrowDown, CheckCircle2, HelpCircle, SkipForward } from 'lucide-react';

export default function GuessHistory({ guesses = [], targetStock, maxGuesses = 6 }) {
  const rows = [];
  for (let i = 0; i < maxGuesses; i++) {
    rows.push(guesses[i] || null);
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
        <span>Guess History</span>
        <span className="text-[11px] text-slate-500">
          Green = Match • Arrows = Market Cap Direction
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((guess, idx) => {
          const guessNumber = idx + 1;

          if (!guess) {
            // Empty placeholder row
            return (
              <div
                key={`empty-${idx}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800/50 border-dashed text-slate-600 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800/50 flex items-center justify-center text-[11px] text-slate-600">
                    {guessNumber}
                  </span>
                  <span>Empty Guess Slot</span>
                </div>
                <div className="text-[11px] text-slate-700">
                  {guessNumber === 6 ? 'Final Guess (Game Over)' : `Unlocks Clue #${guessNumber}`}
                </div>
              </div>
            );
          }

          if (guess.isSkipped) {
            return (
              <div
                key={`guess-${idx}`}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <SkipForward className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      Skipped
                    </span>
                    <span className="text-xs text-slate-300">
                      Turn used to reveal Clue #{guessNumber}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  No company guessed
                </div>
              </div>
            );
          }

          const isCorrect = guess.ticker === targetStock?.ticker;
          const sameSector = guess.sector === targetStock?.sector;

          // Market cap comparison
          let capComparison = null;
          if (targetStock?.marketCapNum && guess.marketCapNum) {
            const ratio = guess.marketCapNum / targetStock.marketCapNum;
            if (isCorrect || (ratio >= 0.85 && ratio <= 1.15)) {
              capComparison = { label: 'Close Cap', icon: Check, color: 'emerald' };
            } else if (targetStock.marketCapNum > guess.marketCapNum) {
              capComparison = { label: 'Higher', icon: ArrowUp, color: 'amber' };
            } else {
              capComparison = { label: 'Lower', icon: ArrowDown, color: 'blue' };
            }
          }

          return (
            <div
              key={`guess-${idx}`}
              className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/40 animate-in zoom-in-95'
                  : 'bg-slate-900/80 border-slate-700/80'
              }`}
            >
              {/* Left: Guess # & Ticker & Name */}
              <div className="flex items-center gap-3 min-w-[180px]">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-100 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {guess.ticker}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[160px] sm:max-w-[200px]">
                    {guess.name}
                  </span>
                </div>
              </div>

              {/* Middle: Feedback Pills (Sector & Market Cap comparison) */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Sector Pill */}
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border flex items-center gap-1 ${
                    sameSector
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                  }`}
                  title={sameSector ? 'Exact sector match!' : 'Different sector than target'}
                >
                  {sameSector && <Check className="w-3 h-3 text-emerald-400" />}
                  {guess.sector}
                </span>

                {/* Market Cap Comparison Pill */}
                {capComparison && (
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-md font-mono font-semibold border flex items-center gap-1 ${
                      capComparison.color === 'emerald'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : capComparison.color === 'amber'
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                    }`}
                    title={
                      capComparison.label === 'Higher'
                        ? 'Target stock has a HIGHER market cap'
                        : capComparison.label === 'Lower'
                        ? 'Target stock has a LOWER market cap'
                        : 'Target market cap is very close'
                    }
                  >
                    <capComparison.icon className="w-3 h-3" />
                    <span>
                      {guess.marketCap}{' '}
                      <span className="text-[10px] opacity-80">
                        ({capComparison.label === 'Higher' ? 'Target >' : capComparison.label === 'Lower' ? 'Target <' : 'Match'})
                      </span>
                    </span>
                  </span>
                )}
              </div>

              {/* Right: Status badge */}
              <div className="text-right">
                {isCorrect ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CORRECT!
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">
                    Unlocked Clue #{guessNumber}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
