import React, { useState, useEffect } from 'react';
import { Trophy, Frown, Share2, Check, RotateCcw, ExternalLink, X, TrendingUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateShareText, copyToClipboard } from '../utils/share';
import { getPuzzleNumber } from '../utils/gameStorage';

export default function GameOverModal({
  isOpen,
  onClose,
  isWon,
  targetStock,
  guesses = [],
  isDaily,
  onPlayNext,
  onSwitchMode,
}) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState('');

  // Fire confetti if won!
  useEffect(() => {
    if (isOpen && isWon) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6', '#ec4899'],
        });
      } catch (e) {
        // Confetti canvas error fallback
      }
    }
  }, [isOpen, isWon]);

  // Countdown timer to midnight UTC/local for daily mode
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diffMs = tomorrow - now;

      const hrs = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
      const mins = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const secs = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');
      setCountdown(`${hrs}:${mins}:${secs}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen || !targetStock) return null;

  const puzzleNumber = getPuzzleNumber();

  const handleShare = async () => {
    const text = generateShareText({
      puzzleNumber,
      isWon,
      guesses,
      targetStock,
      isDaily,
    });
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Close modal to view chart"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-lg">
            {isWon ? (
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Trophy className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Frown className="w-7 h-7" />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            {isWon ? 'Market Genius!' : 'Out of Guesses!'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isWon
              ? `You identified the stock in ${guesses.length} of 6 guesses!`
              : 'The secret company has been revealed:'}
          </p>
        </div>

        {/* Company Reveal Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 mb-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1.5 rounded-lg font-mono font-extrabold text-lg tracking-wider text-white shadow-md"
                style={{ backgroundColor: targetStock.color || '#10b981' }}
              >
                {targetStock.ticker}
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-100 leading-tight">
                  {targetStock.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {targetStock.sector} • {targetStock.industry}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-mono font-bold text-emerald-400 block">
                {targetStock.marketCap}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Market Cap
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
            {targetStock.desc}
          </p>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Chart Span</span>
              <span className="font-mono font-semibold text-slate-200">
                {targetStock.dateRangeYears} {targetStock.yearSpan ? `(${targetStock.yearSpan}Y)` : ''}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Overall Return</span>
              <span
                className={`font-mono font-bold ${
                  targetStock.returnPct?.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {targetStock.returnPct}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">High Price</span>
              <span className="font-mono font-semibold text-emerald-300">
                ${targetStock.maxPrice?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="space-y-2.5">
          {/* Share Score Button */}
          <button
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied Score to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Result (Wordle Grid)</span>
              </>
            )}
          </button>

          {/* Daily Countdown or Unlimited Next Game */}
          {isDaily ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Next Daily Stockle in:</span>
                <span className="font-mono font-bold text-slate-200 text-sm">{countdown}</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onSwitchMode('unlimited');
                }}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Practice Mode</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onPlayNext();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Play Next Stock 🎲</span>
            </button>
          )}

          {/* Inspect Chart button */}
          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Close to inspect full interactive chart & axes
          </button>
        </div>
      </div>
    </div>
  );
}
