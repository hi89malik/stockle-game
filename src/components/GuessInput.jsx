import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, AlertCircle, Flag, SkipForward, Building2 } from 'lucide-react';

export default function GuessInput({
  stockList = [],
  previousGuesses = [],
  onGuess,
  onSkip,
  onGiveUp,
  onOpenReference,
  isGameOver = false,
  maxGuesses = 6,
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const remainingGuesses = maxGuesses - previousGuesses.length;
  const isFinalGuess = previousGuesses.length >= maxGuesses - 1;
  const canSkip = !isGameOver && !isFinalGuess;

  const handleSkipClick = () => {
    if (!canSkip || !onSkip) return;
    setQuery('');
    setIsOpen(false);
    setErrorMsg('');
    onSkip();
  };

  // Filter stocks based on search query
  const filteredStocks = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return stockList
      .filter((s) => {
        const matchesTicker = s.ticker.toLowerCase().includes(q);
        const matchesName = s.name.toLowerCase().includes(q);
        return matchesTicker || matchesName;
      })
      .slice(0, 8); // show top 8 matches
  }, [query, stockList]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredStocks]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectStock = (stock) => {
    // Check if already guessed
    const alreadyGuessed = previousGuesses.some((g) => g.ticker === stock.ticker);
    if (alreadyGuessed) {
      setErrorMsg(`You have already guessed ${stock.ticker} (${stock.name})!`);
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setErrorMsg('');
    setQuery('');
    setIsOpen(false);
    onGuess(stock);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (isGameOver) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && filteredStocks.length > 0) {
        setIsOpen(true);
      } else if (filteredStocks.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredStocks.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredStocks.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredStocks.length) % filteredStocks.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredStocks[selectedIndex]) {
        handleSelectStock(filteredStocks[selectedIndex]);
      } else if (filteredStocks.length > 0) {
        handleSelectStock(filteredStocks[0]);
      } else if (query.trim()) {
        // Check for exact ticker match
        const exact = stockList.find(
          (s) => s.ticker.toLowerCase() === query.trim().toLowerCase()
        );
        if (exact) {
          handleSelectStock(exact);
        } else {
          setErrorMsg('Select a valid company from the list');
          setTimeout(() => setErrorMsg(''), 3000);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Guesses status indicator & Reference list link */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
        <span className="font-semibold uppercase tracking-wider">
          Guess {Math.min(previousGuesses.length + 1, maxGuesses)} of {maxGuesses}
          {isFinalGuess && !isGameOver && (
            <span className="ml-2 text-rose-400 font-mono text-[11px] font-normal normal-case">
              (Final Guess)
            </span>
          )}
        </span>
        <div className="flex items-center gap-3">
          {onOpenReference && (
            <button
              type="button"
              onClick={onOpenReference}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer font-medium"
              title="View all 100 Nasdaq companies sorted by weight"
            >
              <Building2 className="w-3 h-3" />
              <span>Company List</span>
            </button>
          )}
          <span className="text-slate-500 font-mono">
            {remainingGuesses} {remainingGuesses === 1 ? 'guess' : 'guesses'} left
          </span>
        </div>
      </div>

      {/* Input container */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            disabled={isGameOver}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setErrorMsg('');
            }}
            onFocus={() => {
              if (query.trim().length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isGameOver
                ? 'Round finished! See results above.'
                : 'Search by ticker or company name (e.g., AAPL, Nvidia)...'
            }
            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition-all shadow-inner ${
              isGameOver
                ? 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50'
            }`}
          />
        </div>

        {/* Skip Guess Button */}
        {!isGameOver && (
          <button
            type="button"
            onClick={handleSkipClick}
            disabled={!canSkip}
            className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all select-none whitespace-nowrap ${
              canSkip
                ? 'bg-slate-800/90 hover:bg-slate-700 active:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 cursor-pointer shadow-sm'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
            }`}
            title={
              isFinalGuess
                ? 'Cannot skip on the final guess'
                : `Skip this guess to unlock Clue #${previousGuesses.length + 1} (consumes 1 guess)`
            }
          >
            <SkipForward className={`w-3.5 h-3.5 ${canSkip ? 'text-amber-400' : 'text-slate-600'}`} />
            <span>Skip</span>
          </button>
        )}

        {/* Submit Guess Button */}
        <button
          onClick={() => {
            if (filteredStocks.length > 0) {
              handleSelectStock(filteredStocks[selectedIndex || 0]);
            } else if (query.trim()) {
              const exact = stockList.find(
                (s) => s.ticker.toLowerCase() === query.trim().toLowerCase()
              );
              if (exact) handleSelectStock(exact);
            }
          }}
          disabled={isGameOver || !query.trim()}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
        >
          <span>Guess</span>
          <Send className="w-4 h-4" />
        </button>

        {/* Give up button */}
        {!isGameOver && previousGuesses.length >= 1 && (
          <button
            onClick={onGiveUp}
            className="px-3 py-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-800/60 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            title="Concede and reveal the answer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Give Up</span>
          </button>
        )}
      </div>

      {/* Error message toast */}
      {errorMsg && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-lg bg-rose-950/90 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 z-50 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && !isGameOver && filteredStocks.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 top-full mt-2 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150"
        >
          {filteredStocks.map((stock, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={stock.ticker}
                onClick={() => handleSelectStock(stock)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Ticker badge */}
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-800/90 border border-slate-700 text-emerald-400">
                    {stock.ticker}
                  </span>
                  <div>
                    <div className="font-semibold text-sm leading-tight text-slate-200">
                      {stock.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {stock.sector} • {stock.industry}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-medium text-slate-300">
                    {stock.marketCap}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">
                    Market Cap
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
