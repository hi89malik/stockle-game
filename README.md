# Stockle: The Stock Chart Guessing Game

> A Wordle-inspired game for stock charts, tickers, and companies. Guess the company based purely on its historical price trajectory across 6 strategic clues!

![Stockle Game](https://img.shields.io/badge/Stockle-Live-10b981?style=for-the-badge&logo=trendingup)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)

- **Live URL**: https://hi89malik.github.io/stockle-game/
- **Repository**: https://github.com/hi89malik/stockle-game

---

## How the Game Works

You are presented with a **mystery stock chart**. You have **6 guesses** to name the ticker or company. With each wrong guess, an additional market clue is progressively revealed:

| Stage | Clue Revealed | Description |
|---|---|---|
| **Start (0 wrong)** | **Concealed Chart** | Clean price curve posted with **no numbers, no dates, and no prices** across a **random 1 to 5 year span**. |
| **Guess 1 Wrong** | **Chart Range & X-Axis** | Reveals start and end years (e.g. `2023 - 2025`) and timeline dates across the bottom axis. |
| **Guess 2 Wrong** | **Sector & Industry** | Reveals the company's sector & industry (e.g. `Technology / Semiconductors`). |
| **Guess 3 Wrong** | **Market Capitalization** | Reveals the company's market cap (e.g. `~$3.35 Trillion Mega-Cap`). |
| **Guess 4 Wrong** | **P/E Ratio & Founded Year** | Reveals valuation multiple (e.g. `34.2x`) and company founding year (e.g. `1976`). |
| **Guess 5 Wrong** | **Y-Axis (Price Scale)** | Dollar price values appear along the vertical axis. |
| **Final Guess Wrong** | **The Answer** | Full company identity, key return statistics, and interactive chart crosshairs are unveiled! |

### Guess Feedback & Controls
On each guess, you receive strategic comparison indicators:
- **Sector Match**: Green pill indicates the guessed stock shares the exact sector as the target.
- **Market Cap Indicator**: Arrow indicates whether the secret company has a larger or smaller market cap than what you guessed.
- **Skip Guess**: Click the Skip button to unlock the next clue without submitting a company guess. This consumes 1 of your 6 available guesses. Skipping is disabled on the final guess.

---

## Getting Started

### 1. Installation & Running Dev Server

```bash
cd stockle-game
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 2. Building for Production

```bash
npm run build
npm run preview
```

---

## Stock Universe (Top 100 Nasdaq / US Leaders)

The stock dataset is curated from the **100 largest and most active companies** on the Nasdaq and US markets, including:
- **Big Tech**: `AAPL`, `MSFT`, `NVDA`, `GOOGL`, `AMZN`, `META`, `TSLA`
- **Semiconductors**: `AVGO`, `AMD`, `QCOM`, `TXN`, `MU`, `AMAT`, `LRCX`, `INTC`, `MRVL`, `ARM`, `ON`
- **Consumer & Retail**: `COST`, `PEP`, `BKNG`, `SBUX`, `MDLZ`, `MNST`, `LULU`, `DASH`, `ABNB`, `NKE`
- **Software & Cloud**: `ADBE`, `INTU`, `PANW`, `CRWD`, `DDOG`, `SNOW`, `NET`, `SHOP`, `PLTR`, `MDB`, `TEAM`
- **Healthcare & Biotech**: `AMGN`, `ISRG`, `VRTX`, `REGN`, `GILD`, `DXCM`, `MRNA`, `BIIB`
- **Entertainment & Media**: `NFLX`, `CMCSA`, `SPOT`, `DIS`, `TTWO`, `RBLX`
- **Financials**: `PYPL`, `COIN`, `HOOD`

---

## Refreshing / Updating Stock Data

Stock data is updated automatically every Sunday at 00:00 UTC via GitHub Actions (.github/workflows/update-stocks.yml). The workflow fetches the latest weekly market candles, commits the updated datasets, and rebuilds the live site automatically.

You can also run the Python script locally to fetch the latest weekly historical price points directly into JSON:

```bash
python scripts/build_stocks.py
```

This updates `src/data/stocks.json`, `src/data/stocksMeta.json`, and `public/` with fresh market data in ~2 seconds.

---

## Game Features

- **Daily Mode**: A single deterministic stock puzzle per day for players worldwide, with streak tracking and midnight countdown timer.
- **Unlimited / Practice Mode**: Endless random stock challenges with random 1 to 5 year spans to practice pattern recognition.
- **Nasdaq Company Reference List**: View all 100 universe stocks sorted by index weight from highest to lowest component, with ticker and sector displayed (market caps concealed).
- **Synthesized Web Audio**: Sound effects generated natively via the Web Audio API (no external MP3 downloads required), with mute persistence.
- **Wordle-Style Score Sharing**: Copy your game grid to clipboard with one click.
- **Player Statistics**: Games played, win percentage, streak counter, and guess distribution histogram stored in localStorage.
