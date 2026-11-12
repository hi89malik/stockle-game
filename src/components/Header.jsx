import React from 'react';
import { TrendingUp, HelpCircle, BarChart3, Volume2, VolumeX, Calendar, Shuffle, Sparkles, Building2 } from 'lucide-react';
import { getPuzzleNumber } from '../utils/gameStorage';

export default function Header({
  gameMode = 'daily', // 'daily' or 'unlimited'
  onSelectMode,
  onOpenHowToPlay,
  onOpenReference,
  onOpenStats,
  isMuted,
  onToggleSound,
  onNewRandomStock,
  practiceYearSpan = 'random',
  onChangePracticeYearSpan,
}) {
  const puzzleNumber = getPuzzleNumber();

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-950/30">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-1">
                <span>STOCKLE</span>
              </h1>
              {gameMode === 'daily' && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700/60 font-semibold">
                  #{puzzleNumber}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Wordle for Stock Charts • Top 100 Nasdaq
            </p>
          </div>
        </div>

        {/* Center: Mode Toggle Pills */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectMode('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              gameMode === 'daily'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily</span>
          </button>

          <button
            onClick={() => onSelectMode('unlimited')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              gameMode === 'unlimited'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Practice</span>
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Year Range selector in Unlimited Mode */}
          {gameMode === 'unlimited' && (
            <select
              value={practiceYearSpan}
              onChange={(e) => onChangePracticeYearSpan(e.target.value)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none cursor-pointer"
              title="Practice Year Range (Min 1Y, Max 5Y)"
            >
              <option value="random">Random (1-5Y)</option>
              <option value="1">1 Year Span</option>
              <option value="2">2 Year Span</option>
              <option value="3">3 Year Span</option>
              <option value="4">4 Year Span</option>
              <option value="5">5 Year Span</option>
            </select>
          )}

          {/* New Random Stock Button in Unlimited Mode */}
          {gameMode === 'unlimited' && (
            <button
              onClick={onNewRandomStock}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700/80 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              title="Load a new random stock"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Next Stock</span>
            </button>
          )}

          {/* How to play button */}
          <button
            onClick={onOpenHowToPlay}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 transition cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Company reference list button */}
          <button
            onClick={onOpenReference}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition cursor-pointer"
            title="Nasdaq Company Reference List"
          >
            <Building2 className="w-4 h-4" />
          </button>

          {/* Stats button */}
          <button
            onClick={onOpenStats}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 transition cursor-pointer"
            title="Statistics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
