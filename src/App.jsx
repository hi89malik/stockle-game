import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import StockChart from './components/StockChart';
import ClueBar from './components/ClueBar';
import GuessInput from './components/GuessInput';
import GuessHistory from './components/GuessHistory';
import GameOverModal from './components/GameOverModal';
import StatsModal from './components/StatsModal';
import HowToPlayModal from './components/HowToPlayModal';

import stocksData from './data/stocks.json';
import stocksMetaData from './data/stocksMeta.json';

import { sound } from './utils/audio';
import {
  getDailyStock,
  getRandomStock,
  getTodayDateString,
  loadDailyState,
  saveDailyState,
  recordGameResult,
} from './utils/gameStorage';

const MAX_GUESSES = 6;

export default function App() {
  const [gameMode, setGameMode] = useState('daily'); // 'daily' or 'unlimited'
  const [dailyStock, setDailyStock] = useState(null);
  const [unlimitedStock, setUnlimitedStock] = useState(null);
  const [practiceYearSpan, setPracticeYearSpan] = useState('random'); // 'random' or '1'..'5'

  // Round state
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Modals
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);

  // Sound state
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  // Current active target stock
  const currentStock = gameMode === 'daily' ? dailyStock : unlimitedStock;

  // Initialize stocks and check first-time visitor
  useEffect(() => {
    const daily = getDailyStock(stocksData);
    setDailyStock(daily);

    const random = getRandomStock(stocksData, daily?.ticker);
    setUnlimitedStock(random);

    // Auto-open How to Play on first visit
    const hasSeenTutorial = localStorage.getItem('stockle_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowHowToPlayModal(true);
      localStorage.setItem('stockle_tutorial_seen', 'true');
    }
  }, []);

  // Load Daily Game State on date / mode switch
  useEffect(() => {
    if (gameMode === 'daily') {
      const today = getTodayDateString();
      const saved = loadDailyState(today);
      if (saved && saved.targetTicker === dailyStock?.ticker) {
        setGuesses(saved.guesses || []);
        setIsGameOver(saved.isGameOver || false);
        setIsWon(saved.isWon || false);
        if (saved.isGameOver) {
          setShowGameOverModal(true);
        }
      } else {
        // Fresh daily game
        setGuesses([]);
        setIsGameOver(false);
        setIsWon(false);
        setShowGameOverModal(false);
      }
    } else {
      // In unlimited mode, reset state for new stock
      setGuesses([]);
      setIsGameOver(false);
      setIsWon(false);
      setShowGameOverModal(false);
    }
  }, [gameMode, dailyStock]);

  // Compute wrong guesses count
  const wrongGuesses = useMemo(() => {
    return guesses.filter((g) => g.ticker !== currentStock?.ticker).length;
  }, [guesses, currentStock]);

  // Handle a new guess
  const handleGuess = useCallback(
    (stockGuess) => {
      if (isGameOver || !currentStock || guesses.length >= MAX_GUESSES) return;

      const isCorrect = stockGuess.ticker === currentStock.ticker;
      const newGuesses = [...guesses, stockGuess];
      setGuesses(newGuesses);

      const newWrongCount = newGuesses.filter((g) => g.ticker !== currentStock.ticker).length;
      const reachedMax = newGuesses.length >= MAX_GUESSES;

      if (isCorrect) {
        // Victory!
        setIsWon(true);
        setIsGameOver(true);
        sound.playWin();
        setTimeout(() => setShowGameOverModal(true), 600);

        // Record stats
        recordGameResult(true, newGuesses.length, gameMode === 'daily', getTodayDateString());

        if (gameMode === 'daily') {
          saveDailyState(getTodayDateString(), {
            targetTicker: currentStock.ticker,
            yearSpan: currentStock.yearSpan,
            sliceStartIndex: currentStock.sliceStartIndex,
            guesses: newGuesses,
            isGameOver: true,
            isWon: true,
          });
        }
      } else {
        // Wrong Guess
        if (reachedMax) {
          // Final 6th guess wrong -> Game Over
          setIsGameOver(true);
          sound.playLoss();
          setTimeout(() => setShowGameOverModal(true), 700);

          recordGameResult(false, newGuesses.length, gameMode === 'daily', getTodayDateString());

          if (gameMode === 'daily') {
            saveDailyState(getTodayDateString(), {
              targetTicker: currentStock.ticker,
              yearSpan: currentStock.yearSpan,
              sliceStartIndex: currentStock.sliceStartIndex,
              guesses: newGuesses,
              isGameOver: true,
              isWon: false,
            });
          }
        } else {
          // Unlocks next clue!
          sound.playWrong();
          setTimeout(() => {
            sound.playClueUnlock();
          }, 250);

          if (gameMode === 'daily') {
            saveDailyState(getTodayDateString(), {
              targetTicker: currentStock.ticker,
              yearSpan: currentStock.yearSpan,
              sliceStartIndex: currentStock.sliceStartIndex,
              guesses: newGuesses,
              isGameOver: false,
              isWon: false,
            });
          }
        }
      }
    },
    [isGameOver, currentStock, guesses, gameMode]
  );

  // Handle Give Up / Concede
  const handleGiveUp = useCallback(() => {
    if (isGameOver || !currentStock) return;
    setIsGameOver(true);
    setIsWon(false);
    sound.playLoss();
    setShowGameOverModal(true);

    recordGameResult(false, guesses.length, gameMode === 'daily', getTodayDateString());

    if (gameMode === 'daily') {
      saveDailyState(getTodayDateString(), {
        targetTicker: currentStock.ticker,
        yearSpan: currentStock.yearSpan,
        sliceStartIndex: currentStock.sliceStartIndex,
        guesses,
        isGameOver: true,
        isWon: false,
      });
    }
  }, [isGameOver, currentStock, guesses, gameMode]);

  // Load next random stock in unlimited mode
  const handleNewRandomStock = useCallback(() => {
    const span = practiceYearSpan === 'random' ? null : parseInt(practiceYearSpan, 10);
    const nextStock = getRandomStock(stocksData, currentStock?.ticker, span);
    setUnlimitedStock(nextStock);
    setGuesses([]);
    setIsGameOver(false);
    setIsWon(false);
    setShowGameOverModal(false);
  }, [currentStock, practiceYearSpan]);

  const handleChangePracticeYearSpan = (val) => {
    setPracticeYearSpan(val);
    const span = val === 'random' ? null : parseInt(val, 10);
    const nextStock = getRandomStock(stocksData, currentStock?.ticker, span);
    setUnlimitedStock(nextStock);
    setGuesses([]);
    setIsGameOver(false);
    setIsWon(false);
    setShowGameOverModal(false);
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Header */}
      <Header
        gameMode={gameMode}
        onSelectMode={(mode) => setGameMode(mode)}
        onOpenHowToPlay={() => setShowHowToPlayModal(true)}
        onOpenStats={() => setShowStatsModal(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onNewRandomStock={handleNewRandomStock}
        practiceYearSpan={practiceYearSpan}
        onChangePracticeYearSpan={handleChangePracticeYearSpan}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Mystery Stock Chart */}
        <StockChart
          stock={currentStock}
          wrongGuesses={wrongGuesses}
          isGameOver={isGameOver}
          isWon={isWon}
        />

        {/* Progressive Clue Cards */}
        <ClueBar
          stock={currentStock}
          wrongGuesses={wrongGuesses}
          isGameOver={isGameOver}
        />

        {/* Guess Search Input */}
        <div className="pt-1">
          <GuessInput
            stockList={stocksMetaData}
            previousGuesses={guesses}
            onGuess={handleGuess}
            onGiveUp={handleGiveUp}
            isGameOver={isGameOver}
            maxGuesses={MAX_GUESSES}
          />
        </div>

        {/* 6-Row Guess History */}
        <div className="pt-2">
          <GuessHistory
            guesses={guesses}
            targetStock={currentStock}
            maxGuesses={MAX_GUESSES}
          />
        </div>

        {/* Re-open Results button if user closed modal during finished game */}
        {isGameOver && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowGameOverModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 transition cursor-pointer"
            >
              View Game Results & Share Score 📊
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-600">
        <p>
          Stockle • Nasdaq-100 Stock Chart Guessing Game • Historical weekly data
        </p>
      </footer>

      {/* Modals */}
      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        isWon={isWon}
        targetStock={currentStock}
        guesses={guesses}
        isDaily={gameMode === 'daily'}
        onPlayNext={handleNewRandomStock}
        onSwitchMode={(mode) => setGameMode(mode)}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />

      <HowToPlayModal
        isOpen={showHowToPlayModal}
        onClose={() => setShowHowToPlayModal(false)}
      />
    </div>
  );
}
