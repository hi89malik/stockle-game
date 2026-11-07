// Storage and State Management for Stockle

const STATS_KEY = 'stockle_player_stats_v1';
const EPOCH_DATE = new Date('2024-01-01T00:00:00Z');

export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPuzzleNumber() {
  const today = new Date();
  const diffTime = Math.abs(today - EPOCH_DATE);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Deterministic seed from date string
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit int
  }
  return Math.abs(hash);
}

/**
 * Creates a playable stock challenge with a random or specified year range (between 1 and 5 years).
 * Slices the 5-year historical weekly points to match the chosen year span.
 */
export function createStockChallenge(baseStock, yearSpan = null, startIndex = null) {
  if (!baseStock || !baseStock.points || baseStock.points.length === 0) return null;

  const totalPoints = baseStock.points.length;

  // Year span must be between 1 and 5 years
  let chosenSpan;
  if (yearSpan && typeof yearSpan === 'number' && yearSpan >= 1 && yearSpan <= 5) {
    chosenSpan = Math.round(yearSpan);
  } else {
    // Random integer between 1 and 5
    chosenSpan = Math.floor(Math.random() * 5) + 1;
  }

  // Calculate points for the chosen span (approx 52 weekly points per year)
  const targetPoints = chosenSpan === 5 
    ? totalPoints 
    : Math.min(totalPoints, Math.max(52, chosenSpan * 52));

  // Determine window start index
  const maxStart = Math.max(0, totalPoints - targetPoints);
  let chosenStart;
  if (startIndex !== null && startIndex !== undefined && startIndex >= 0 && startIndex <= maxStart) {
    chosenStart = startIndex;
  } else {
    chosenStart = Math.floor(Math.random() * (maxStart + 1));
  }

  const slicedPoints = baseStock.points.slice(chosenStart, chosenStart + targetPoints);

  if (slicedPoints.length === 0) return baseStock;

  const firstDate = slicedPoints[0].date;
  const lastDate = slicedPoints[slicedPoints.length - 1].date;
  const startYr = parseInt(firstDate.slice(0, 4), 10);
  const endYr = parseInt(lastDate.slice(0, 4), 10);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = monthNames[parseInt(firstDate.slice(5, 7), 10) - 1] || '';
  const endMonth = monthNames[parseInt(lastDate.slice(5, 7), 10) - 1] || '';

  // Format year range for Clue #1
  const dateRangeYears = startYr === endYr ? `${startYr}` : `${startYr} - ${endYr}`;
  const dateRangeFull = `${startMonth} ${startYr} to ${endMonth} ${endYr}`;

  // Recalculate price stats for this specific sliced window
  const closes = slicedPoints.map((p) => p.close);
  const startPrice = closes[0];
  const latestPrice = closes[closes.length - 1];
  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);
  const returnPctNum = ((latestPrice - startPrice) / startPrice) * 100;
  const returnPct = `${returnPctNum >= 0 ? '+' : ''}${returnPctNum.toFixed(1)}%`;

  return {
    ...baseStock,
    yearSpan: chosenSpan,
    dateRangeYears,
    dateRangeFull,
    startYear: startYr,
    endYear: endYr,
    pointCount: slicedPoints.length,
    minPrice,
    maxPrice,
    startPrice,
    latestPrice,
    returnPct,
    points: slicedPoints,
    sliceStartIndex: chosenStart,
  };
}

export function getDailyStock(stocks) {
  if (!stocks || stocks.length === 0) return null;
  const dateStr = getTodayDateString();
  const hash = hashString(dateStr + '_stockle_daily_salt');
  const index = hash % stocks.length;
  const baseStock = stocks[index];

  // Deterministically pick a random year span (1 to 5) for today's daily puzzle
  const spanHash = hashString(dateStr + '_stockle_span_salt');
  const yearSpan = (spanHash % 5) + 1; // 1, 2, 3, 4, or 5

  const targetPoints = yearSpan === 5 
    ? baseStock.points.length 
    : Math.min(baseStock.points.length, Math.max(52, yearSpan * 52));
  const maxStart = Math.max(0, baseStock.points.length - targetPoints);

  const startHash = hashString(dateStr + '_stockle_start_salt');
  const startIndex = maxStart > 0 ? startHash % (maxStart + 1) : 0;

  return createStockChallenge(baseStock, yearSpan, startIndex);
}

export function getRandomStock(stocks, excludeTicker = null, preferredYearSpan = null) {
  if (!stocks || stocks.length === 0) return null;
  const filtered = excludeTicker ? stocks.filter((s) => s.ticker !== excludeTicker) : stocks;
  const pool = filtered.length > 0 ? filtered : stocks;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const baseStock = pool[randomIndex];

  // Random year span 1 to 5 years (or user-preferred year span)
  const span = (preferredYearSpan && preferredYearSpan >= 1 && preferredYearSpan <= 5)
    ? preferredYearSpan
    : Math.floor(Math.random() * 5) + 1;

  return createStockChallenge(baseStock, span);
}

export function loadDailyState(dateStr) {
  try {
    const data = localStorage.getItem(`stockle_daily_${dateStr}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading daily state', e);
  }
  return null;
}

export function saveDailyState(dateStr, state) {
  try {
    localStorage.setItem(`stockle_daily_${dateStr}`, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving daily state', e);
  }
}

export function loadPlayerStats() {
  const defaultStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastPlayedDate: null,
  };

  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return { ...defaultStats, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading stats', e);
  }
  return defaultStats;
}

export function recordGameResult(won, guessCount, isDaily = false, dateStr = null) {
  const stats = loadPlayerStats();

  stats.gamesPlayed += 1;
  if (won) {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
    const idx = Math.min(Math.max(guessCount - 1, 0), 5);
    stats.guessDistribution[idx] = (stats.guessDistribution[idx] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  if (isDaily && dateStr) {
    stats.lastPlayedDate = dateStr;
  }

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats', e);
  }

  return stats;
}
