import React, { useState, useMemo, useRef } from 'react';
import { Eye, EyeOff, Calendar, DollarSign, Sparkles } from 'lucide-react';

export default function StockChart({
  stock,
  wrongGuesses = 0,
  isGameOver = false,
  isWon = false,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [chartType, setChartType] = useState('area'); // 'area' or 'line'
  const svgRef = useRef(null);

  // Clues 4 and 5 condition:
  // Fourth guess wrong -> X axis revealed (wrongGuesses >= 4 or isGameOver)
  // Fifth guess wrong -> Y axis revealed (wrongGuesses >= 5 or isGameOver)
  const showXAxis = wrongGuesses >= 4 || isGameOver;
  const showYAxis = wrongGuesses >= 5 || isGameOver;
  const isInteractive = isGameOver; // interactive tooltip enabled once game is completed

  const points = stock?.points || [];

  // Calculate scales and coordinates
  const {
    pathD,
    areaD,
    minP,
    maxP,
    xTicks,
    yTicks,
    dataPoints,
    highPoint,
    lowPoint,
  } = useMemo(() => {
    if (!points || points.length === 0) {
      return {
        pathD: '',
        areaD: '',
        minP: 0,
        maxP: 100,
        xTicks: [],
        yTicks: [],
        dataPoints: [],
        highPoint: null,
        lowPoint: null,
      };
    }

    const width = 800;
    const height = 380;
    // Padding leaves room for axes when revealed
    const padLeft = showYAxis ? 65 : 20;
    const padRight = 25;
    const padTop = 30;
    const padBottom = showXAxis ? 45 : 20;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const closes = points.map((p) => p.close);
    const rawMin = Math.min(...closes);
    const rawMax = Math.max(...closes);
    const range = rawMax - rawMin || 1;

    // Add 8% buffer top and bottom for visual breathing room
    const minP = Math.max(0, rawMin - range * 0.08);
    const maxP = rawMax + range * 0.08;
    const pRange = maxP - minP;

    let highIdx = 0;
    let lowIdx = 0;

    const coords = points.map((pt, i) => {
      const x = padLeft + (i / (points.length - 1)) * chartW;
      const y = padTop + chartH - ((pt.close - minP) / pRange) * chartH;
      if (pt.close > points[highIdx].close) highIdx = i;
      if (pt.close < points[lowIdx].close) lowIdx = i;
      return { x, y, ...pt };
    });

    // Build SVG path
    let pathD = '';
    coords.forEach((c, idx) => {
      if (idx === 0) {
        pathD += `M ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
      } else {
        // smooth cubic curve or polyline
        const prev = coords[idx - 1];
        const cpX = (prev.x + c.x) / 2;
        pathD += ` C ${cpX.toFixed(2)} ${prev.y.toFixed(2)}, ${cpX.toFixed(2)} ${c.y.toFixed(2)}, ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
      }
    });

    const bottomY = padTop + chartH;
    const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(2)} ${bottomY} L ${coords[0].x.toFixed(2)} ${bottomY} Z`;

    // Compute 5 Y-Axis ticks
    const yTickCount = 5;
    const yTicks = [];
    for (let i = 0; i < yTickCount; i++) {
      const val = minP + (pRange / (yTickCount - 1)) * i;
      const y = padTop + chartH - (i / (yTickCount - 1)) * chartH;
      yTicks.push({
        val,
        formatted: `$${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(val < 10 ? 2 : 1)}`,
        y,
      });
    }

    // Compute X-Axis ticks (extract 5-6 well spaced timestamps/years)
    const xTicks = [];
    const step = Math.floor(points.length / 5);
    for (let i = 0; i < points.length; i += step) {
      if (xTicks.length < 6) {
        const pt = points[i];
        const year = pt.date.slice(0, 4);
        const month = pt.date.slice(5, 7);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mLabel = monthNames[parseInt(month, 10) - 1] || '';
        xTicks.push({
          label: `${mLabel} '${year.slice(2)}`,
          fullYear: year,
          x: padLeft + (i / (points.length - 1)) * chartW,
        });
      }
    }
    // Always include the last date point
    const lastPt = points[points.length - 1];
    const lastX = padLeft + chartW;
    const lastYear = lastPt.date.slice(0, 4);
    if (xTicks[xTicks.length - 1]?.x < lastX - 40) {
      xTicks.push({
        label: `'${lastYear.slice(2)}`,
        fullYear: lastYear,
        x: lastX,
      });
    }

    return {
      pathD,
      areaD,
      minP,
      maxP,
      xTicks,
      yTicks,
      dataPoints: coords,
      highPoint: coords[highIdx],
      lowPoint: coords[lowIdx],
    };
  }, [points, showXAxis, showYAxis]);

  // Handle mouse move for crosshair (only after game is finished)
  const handleMouseMove = (e) => {
    if (!isInteractive || !svgRef.current || dataPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgWidth = 800;
    const scaleX = svgWidth / rect.width;
    const targetX = mouseX * scaleX;

    // Find closest point by x coordinate
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < dataPoints.length; i++) {
      const diff = Math.abs(dataPoints[i].x - targetX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activePoint = hoverIndex !== null ? dataPoints[hoverIndex] : null;

  // Chart primary color (glow emerald by default, or brand color if won/revealed)
  const strokeColor = isGameOver && stock?.color ? stock.color : '#10b981';

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Header of Chart */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {isGameOver ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {stock?.ticker} • {stock?.name}
              </span>
            ) : (
              'Mystery Stock Chart'
            )}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
            {wrongGuesses >= 1 || isGameOver
              ? `${stock?.yearSpan ? `${stock.yearSpan}Y • ` : ''}${points.length} weekly bars`
              : 'Random 1–5 Year Range'}
          </span>
        </div>

        {/* Axis Status Badges */}
        <div className="flex items-center gap-2 text-xs">
          {/* X Axis Indicator */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              showXAxis
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-800/60 text-slate-500 border border-slate-800'
            }`}
            title={showXAxis ? 'X-Axis Unlocked (Dates shown)' : 'X-Axis Locked (Unlocked after Guess 4)'}
          >
            <Calendar className="w-3 h-3" />
            <span className="font-mono text-[11px]">X-Axis {showXAxis ? 'Revealed' : 'Locked'}</span>
          </div>

          {/* Y Axis Indicator */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              showYAxis
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/60 text-slate-500 border border-slate-800'
            }`}
            title={showYAxis ? 'Y-Axis Unlocked (Prices shown)' : 'Y-Axis Locked (Unlocked after Guess 5)'}
          >
            <DollarSign className="w-3 h-3" />
            <span className="font-mono text-[11px]">Y-Axis {showYAxis ? 'Revealed' : 'Locked'}</span>
          </div>

          {/* Chart View Toggle */}
          <button
            onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
            className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition text-[11px]"
            title="Toggle Area Fill"
          >
            {chartType === 'area' ? 'Line' : 'Area'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.2/1] max-h-[380px] p-2 select-none">
        <svg
          ref={svgRef}
          viewBox="0 0 800 380"
          className="w-full h-full cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Smooth linear gradient for area fill */}
            <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="60%" stopColor={strokeColor} stopOpacity="0.08" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines (Clean, no text unless unlocked) */}
          {yTicks.map((tick, i) => (
            <g key={`ygrid-${i}`}>
              <line
                x1={showYAxis ? 65 : 20}
                y1={tick.y}
                x2={775}
                y2={tick.y}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.25"
              />
              {/* Y AXIS LABELS: Revealed on 5th guess wrong or game over */}
              {showYAxis && (
                <text
                  x={55}
                  y={tick.y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  className="transition-opacity duration-700 ease-in-out"
                >
                  {tick.formatted}
                </text>
              )}
            </g>
          ))}

          {/* Vertical X Grid Lines */}
          {xTicks.map((tick, i) => (
            <g key={`xgrid-${i}`}>
              <line
                x1={tick.x}
                y1={30}
                x2={tick.x}
                y2={showXAxis ? 335 : 360}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.25"
              />
              {/* X AXIS LABELS: Revealed on 4th guess wrong or game over */}
              {showXAxis && (
                <text
                  x={tick.x}
                  y={358}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  className="transition-opacity duration-700 ease-in-out"
                >
                  {tick.label}
                </text>
              )}
            </g>
          ))}

          {/* Chart Area Fill */}
          {chartType === 'area' && (
            <path
              d={areaD}
              fill="url(#stockGradient)"
              className="transition-all duration-500"
            />
          )}

          {/* Chart Main Curve Line with Glow */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className="transition-all duration-500"
          />

          {/* High / Low Points Markers (revealed at game over) */}
          {isGameOver && highPoint && lowPoint && (
            <>
              {/* High Point Marker */}
              <circle
                cx={highPoint.x}
                cy={highPoint.y}
                r="4"
                fill="#10b981"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={highPoint.x}
                y={highPoint.y - 10}
                textAnchor="middle"
                fill="#34d399"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
              >
                ATH ${highPoint.close}
              </text>

              {/* Low Point Marker */}
              <circle
                cx={lowPoint.x}
                cy={lowPoint.y}
                r="4"
                fill="#f43f5e"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={lowPoint.x}
                y={lowPoint.y + 16}
                textAnchor="middle"
                fill="#fb7185"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
              >
                LOW ${lowPoint.close}
              </text>
            </>
          )}

          {/* Crosshair Cursor (when hovered after game over) */}
          {activePoint && (
            <g>
              {/* Vertical line */}
              <line
                x1={activePoint.x}
                y1={30}
                x2={activePoint.x}
                y2={335}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Target glowing dot */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="2"
                filter="url(#glow)"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip during post-game hover */}
        {activePoint && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-cyan-500/40 shadow-xl shadow-cyan-950/50 backdrop-blur-md"
            style={{
              left: `${(activePoint.x / 800) * 100}%`,
              top: `${(activePoint.y / 380) * 100}%`,
            }}
          >
            <div className="text-[11px] font-mono text-cyan-300 font-bold whitespace-nowrap">
              ${activePoint.close.toFixed(2)}
            </div>
            <div className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
              {activePoint.date}
            </div>
          </div>
        )}

        {/* Lock Overlay Banner when numbers are hidden */}
        {!showXAxis && !showYAxis && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-400 text-xs shadow-lg backdrop-blur-md">
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Chart values concealed — Guess to reveal clues</span>
          </div>
        )}
      </div>

      {/* Chart Footer with Range info if unlocked */}
      <div className="px-5 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 mr-1.5">Period:</span>
            <span className={`font-mono font-medium ${wrongGuesses >= 1 || isGameOver ? 'text-amber-400' : 'text-slate-500'}`}>
              {wrongGuesses >= 1 || isGameOver
                ? `${stock?.dateRangeYears}${stock?.yearSpan ? ` (${stock.yearSpan} ${stock.yearSpan === 1 ? 'Year' : 'Years'})` : ''}`
                : '•••• – •••• (Locked)'}
            </span>
          </div>
          {isGameOver && (
            <div>
              <span className="text-slate-500 mr-1.5">Overall Return:</span>
              <span className={`font-mono font-bold ${stock?.returnPct?.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock?.returnPct}
              </span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500">
          {isInteractive ? 'Hover chart to inspect historical prices' : 'Axes unlock with guesses #4 & #5'}
        </div>
      </div>
    </div>
  );
}
