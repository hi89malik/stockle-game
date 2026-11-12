// Wordle-style share formatting for Stockle

export function generateShareText({ puzzleNumber, isWon, guesses, targetStock, isDaily }) {
  const spanLabel = targetStock?.yearSpan ? ` (${targetStock.yearSpan}Y)` : '';
  const header = isDaily 
    ? `Stockle #${puzzleNumber}${spanLabel} ${isWon ? guesses.length : 'X'}/6`
    : `Stockle (Practice)${spanLabel} ${isWon ? guesses.length : 'X'}/6`;

  const rows = guesses.map((g) => {
    const isCorrect = g.ticker === targetStock.ticker;
    if (isCorrect) {
      return '🟩🟩🟩🟩🟩';
    }

    if (g.isSkipped) {
      return '⬛⬛⬛⬛⬛';
    }

    // Clue emojis:
    // Sector match: 🟩 if match, ⬛ if not
    const sectorEmoji = g.sector === targetStock.sector ? '🟩' : '⬛';
    // Market Cap: 🟨 if close within 25%, ⬆️ if target higher, ⬇️ if target lower
    let capEmoji = '⬛';
    if (g.marketCapNum && targetStock.marketCapNum) {
      const ratio = g.marketCapNum / targetStock.marketCapNum;
      if (ratio >= 0.75 && ratio <= 1.35) {
        capEmoji = '🟨';
      } else if (targetStock.marketCapNum > g.marketCapNum) {
        capEmoji = '⬆️';
      } else {
        capEmoji = '⬇️';
      }
    }
    // Wrong guess indicator
    return `🟥 ${sectorEmoji} ${capEmoji} ⬛`;
  });

  return `${header}\n\n${rows.join('\n')}\n\nCan you guess the stock from its chart?`;
}

export async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }

  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
