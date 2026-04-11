"use client";

type JugglerBudoCounterButtonProps = {
  onIncrement: () => void;
};

export function JugglerBudoCounterButton({ onIncrement }: JugglerBudoCounterButtonProps) {
  return (
    <button
      className="budo-counter-button"
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
  );
}
