import React from 'react';
import { HelpCircle, X, Calendar, Building2, Coins, History, TrendingUp, Sparkles, Check, ArrowUp } from 'lucide-react';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold tracking-tight">How to Play Stockle</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          Can you identify the company from its historical stock price chart? You have <strong className="text-emerald-400">6 guesses</strong>. With every incorrect guess, an additional market clue is revealed!
        </p>

        {/* Clue Roadmap */}
        <div className="mb-6 space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Progressive Clue Roadmap
          </h3>

          <div className="space-y-2 text-xs">
            {/* Start */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-400">
                0
              </span>
              <div>
                <span className="font-semibold text-slate-200">Start (Initial Chart)</span>
                <p className="text-slate-400 text-[11px]">The stock chart is posted with zero numbers, dates, or prices for a random 1 to 5 year span.</p>
              </div>
            </div>

            {/* Clue 1 */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-mono font-bold">
                1
              </div>
              <div>
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Clue #1: Chart Range & X-Axis
                </span>
                <p className="text-slate-400 text-[11px]">Reveals start and end years (e.g. 2022 - 2024) and unlocks the timeline dates across the bottom axis.</p>
              </div>
            </div>

            {/* Clue 2 */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-mono font-bold">
                2
              </div>
              <div>
                <span className="font-semibold text-blue-300 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Clue #2: Sector & Industry
                </span>
                <p className="text-slate-400 text-[11px]">Reveals whether it is Technology, Healthcare, Consumer, etc.</p>
              </div>
            </div>

            {/* Clue 3 */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono font-bold">
                3
              </div>
              <div>
                <span className="font-semibold text-emerald-300 flex items-center gap-1">
                  <Coins className="w-3 h-3" /> Clue #3: Market Capitalization
                </span>
                <p className="text-slate-400 text-[11px]">Reveals company size (e.g. $3.35 Trillion Mega-Cap).</p>
              </div>
            </div>

            {/* Clue 4 */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-bold">
                4
              </div>
              <div>
                <span className="font-semibold text-cyan-300 flex items-center gap-1">
                  <History className="w-3 h-3" /> Clue #4: P/E Ratio & Founded Year
                </span>
                <p className="text-slate-400 text-[11px]">Reveals price-to-earnings valuation multiple and company founding year.</p>
              </div>
            </div>

            {/* Clue 5 */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/40 flex items-center justify-center font-mono font-bold">
                5
              </div>
              <div>
                <span className="font-semibold text-violet-300 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Clue #5: Chart Y-Axis
                </span>
                <p className="text-slate-400 text-[11px]">Exact dollar prices are displayed along the vertical axis.</p>
              </div>
            </div>

            {/* Final Guess */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-mono font-bold">
                6
              </div>
              <div>
                <span className="font-semibold text-rose-300">Final Guess Wrong: Game Over</span>
                <p className="text-slate-400 text-[11px]">The company ticker, history, and full stats are unveiled.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wordle Feedback */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 mb-5 space-y-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-slate-400 text-[11px] block">
            Guess Feedback Indicators
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Technology
            </span>
            <span className="text-slate-300">Target stock is in the exact same sector</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-semibold flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> Higher
            </span>
            <span className="text-slate-300">Target stock has a larger market capitalization</span>
          </div>
        </div>

        {/* Universe */}
        <div className="text-xs text-slate-400 mb-5">
          <span className="font-semibold text-slate-300">Stock Universe:</span> Curated from the top 100 largest and most active companies in the Nasdaq and US markets (AAPL, NVDA, MSFT, TSLA, AMZN, META, COST, etc.).
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition"
        >
          Got it, let's play!
        </button>
      </div>
    </div>
  );
}
