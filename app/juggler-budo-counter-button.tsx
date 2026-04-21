"use client";

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

export function JugglerBudoCounterButton({
  count,
  onIncrement,
  onDecrement,
  onSingleRegIncrement,
  onSingleRegDecrement
}: JugglerBudoCounterButtonProps) {
  const showsSingleRegCounter = Boolean(onSingleRegIncrement && onSingleRegDecrement);
  const budoCountText = formatBudoCount(count);

  return (
    <>
      <output
        className="budo-counter-display"
        aria-label={`現在のブドウ数 ${budoCountText}`}
        aria-live="polite"
      >
        {budoCountText}
      </output>
      <button
        className="budo-counter-button budo-counter-button-plus"
        type="button"
        onClick={onIncrement}
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
        onClick={onDecrement}
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
      {showsSingleRegCounter ? (
        <>
          <button
            className="reg-counter-button reg-counter-button-plus"
            type="button"
            onClick={onSingleRegIncrement}
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
            onClick={onSingleRegDecrement}
            aria-label="単独REGを1減算"
          >
            <span className="reg-counter-minus-text">-1</span>
          </button>
        </>
      ) : null}
    </>
  );
}
