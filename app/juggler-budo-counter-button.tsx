"use client";

import { useRef, useState } from "react";

type JugglerBudoCounterButtonProps = {
  count?: string | number;
  onIncrement: () => void;
  onDecrement: () => void;
  onSingleRegIncrement?: () => void;
  onSingleRegDecrement?: () => void;
};

function formatBudoCount(count: string | number | undefined) {
  const parsed = Number(count);
  const safeCount = Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : 0;

  return String(safeCount).padStart(4, "0");
}

const MAX_METER_BANDS = 3;

export function JugglerBudoCounterButton({
  count,
  onIncrement,
  onDecrement,
  onSingleRegIncrement,
  onSingleRegDecrement
}: JugglerBudoCounterButtonProps) {
  const showsSingleRegCounter = Boolean(onSingleRegIncrement && onSingleRegDecrement);
  const budoCountText = formatBudoCount(count);
  const [meterBandIds, setMeterBandIds] = useState<number[]>([]);
  const meterBandIdRef = useRef(0);

  const startMeter = () => {
    meterBandIdRef.current += 1;
    const nextId = meterBandIdRef.current;

    setMeterBandIds((current) => [...current, nextId].slice(-MAX_METER_BANDS));
  };

  const removeMeterBand = (id: number) => {
    setMeterBandIds((current) => current.filter((currentId) => currentId !== id));
  };

  const handleIncrementClick = () => {
    onIncrement();
    startMeter();
  };

  const handleDecrementClick = () => {
    onDecrement();
    startMeter();
  };

  const handleSingleRegIncrementClick = () => {
    onSingleRegIncrement?.();
    startMeter();
  };

  const handleSingleRegDecrementClick = () => {
    onSingleRegDecrement?.();
    startMeter();
  };

  return (
    <div
      className={`budo-counter-panel${showsSingleRegCounter ? " budo-counter-panel-with-reg" : ""}`}
    >
      <div className="budo-counter-status-row">
        <div className="budo-counter-meter" aria-hidden="true">
          <div className="budo-counter-meter-grid">
            {Array.from({ length: MAX_METER_BANDS }, (_, index) => (
              <span
                key={`meter-track-${index}`}
                className="budo-counter-meter-track"
                style={{ gridRow: index + 1 }}
              />
            ))}
            {meterBandIds.map((bandId, index) => (
              <span
                key={bandId}
                className="budo-counter-meter-fill"
                style={{ gridRow: index + 1 }}
                onAnimationEnd={() => removeMeterBand(bandId)}
              />
            ))}
          </div>
        </div>
        <output
          className="budo-counter-display"
          aria-label={`現在のブドウ数 ${budoCountText}`}
          aria-live="polite"
        >
          {budoCountText}
        </output>
      </div>
      <div
        className={`budo-counter-action-row${showsSingleRegCounter ? " budo-counter-action-row-compact" : ""}`}
      >
        <button
          className="budo-counter-button budo-counter-button-plus"
          type="button"
          onClick={handleIncrementClick}
          aria-label="通常時のブドウを1加算"
        >
          <svg className="budo-counter-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <path className="budo-counter-stem" d="M36 8c-5 4-7 8-7 14" />
            <path className="budo-counter-leaf" d="M39 12c8-2 14 2 16 9-8 2-14 0-18-5" />
            <circle cx="27" cy="25" r="8" />
            <circle cx="39" cy="25" r="8" />
            <circle cx="21" cy="37" r="8" />
            <circle cx="33" cy="37" r="8" />
            <circle cx="45" cy="37" r="8" />
            <circle cx="27" cy="49" r="8" />
            <circle cx="39" cy="49" r="8" />
          </svg>
          <span className="budo-counter-text">
            <span className="budo-counter-main">ブドウ</span>
            <span className="budo-counter-plus">+1</span>
          </span>
        </button>
        <button
          className={`budo-counter-button budo-counter-button-minus${showsSingleRegCounter ? " budo-counter-button-minus-compact" : ""}`}
          type="button"
          onClick={handleDecrementClick}
          aria-label="通常時のブドウを1減算"
        >
          {showsSingleRegCounter ? (
            <span className="budo-counter-minus-text">-1</span>
          ) : (
            <>
              <svg className="budo-counter-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                <path className="budo-counter-stem" d="M36 8c-5 4-7 8-7 14" />
                <path className="budo-counter-leaf" d="M39 12c8-2 14 2 16 9-8 2-14 0-18-5" />
                <circle cx="27" cy="25" r="8" />
                <circle cx="39" cy="25" r="8" />
                <circle cx="21" cy="37" r="8" />
                <circle cx="33" cy="37" r="8" />
                <circle cx="45" cy="37" r="8" />
                <circle cx="27" cy="49" r="8" />
                <circle cx="39" cy="49" r="8" />
              </svg>
              <span className="budo-counter-text">
                <span className="budo-counter-main">ブドウ</span>
                <span className="budo-counter-plus">-1</span>
              </span>
            </>
          )}
        </button>
      </div>
      {showsSingleRegCounter ? (
        <div className="budo-counter-action-row budo-counter-action-row-compact">
          <button
            className="reg-counter-button reg-counter-button-plus"
            type="button"
            onClick={handleSingleRegIncrementClick}
            aria-label="単独REGを1加算"
          >
            <span className="reg-counter-symbol" aria-hidden="true">
              BAR
            </span>
            <span className="reg-counter-text">
              <span className="reg-counter-main">単独REG</span>
              <span className="reg-counter-plus">+1</span>
            </span>
          </button>
          <button
            className="reg-counter-button reg-counter-button-minus"
            type="button"
            onClick={handleSingleRegDecrementClick}
            aria-label="単独REGを1減算"
          >
            <span className="reg-counter-minus-text">-1</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
