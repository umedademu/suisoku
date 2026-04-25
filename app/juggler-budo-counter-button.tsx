"use client";

import { useLayoutEffect, useRef, useState } from "react";

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

const MAX_METER_BANDS = 5;
const METER_COLOR_NAMES = ["amber", "lime", "cyan", "blue", "pink"] as const;
const DECREMENT_COLOR_NAME = "white" as const;
const SINGLE_REG_COLOR_NAME = "gray" as const;
const EFFECT_COLOR_NAMES = [...METER_COLOR_NAMES, DECREMENT_COLOR_NAME, SINGLE_REG_COLOR_NAME] as const;

type MeterBand = {
  id: number;
  colorName: (typeof EFFECT_COLOR_NAMES)[number];
};

function isDisplayColorName(
  colorName: (typeof EFFECT_COLOR_NAMES)[number]
): colorName is (typeof METER_COLOR_NAMES)[number] {
  return METER_COLOR_NAMES.includes(colorName as (typeof METER_COLOR_NAMES)[number]);
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
  const [isRotated, setIsRotated] = useState(false);
  const [rotatedScale, setRotatedScale] = useState(1);
  const [rotatedViewportHeight, setRotatedViewportHeight] = useState<number | null>(null);
  const [meterBands, setMeterBands] = useState<MeterBand[]>([]);
  const [displayColorName, setDisplayColorName] =
    useState<(typeof METER_COLOR_NAMES)[number] | null>(null);
  const [panelEffectSequence, setPanelEffectSequence] = useState(0);
  const [panelEffectColorName, setPanelEffectColorName] =
    useState<(typeof EFFECT_COLOR_NAMES)[number] | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const meterBandIdRef = useRef(0);
  const meterColorIndexRef = useRef(0);
  const panelEffectAnimationName =
    panelEffectSequence === 0
      ? undefined
      : panelEffectSequence % 2 === 0
        ? "budo-counter-panel-jolt-a"
        : "budo-counter-panel-jolt-b";

  const startMeter = (colorName: (typeof EFFECT_COLOR_NAMES)[number], updatesDisplayColor: boolean) => {
    meterBandIdRef.current += 1;
    const nextBand: MeterBand = {
      id: meterBandIdRef.current,
      colorName
    };

    setMeterBands((current) => [...current, nextBand].slice(-MAX_METER_BANDS));
    if (updatesDisplayColor && isDisplayColorName(colorName)) {
      setDisplayColorName(colorName);
    }
    setPanelEffectColorName(colorName);
    setPanelEffectSequence((current) => current + 1);
  };

  const startBudoMeter = () => {
    const nextColorName = METER_COLOR_NAMES[meterColorIndexRef.current];

    meterColorIndexRef.current = (meterColorIndexRef.current + 1) % METER_COLOR_NAMES.length;
    startMeter(nextColorName, true);
  };

  const startSingleRegMeter = () => {
    startMeter(SINGLE_REG_COLOR_NAME, false);
  };

  const startDecrementMeter = () => {
    startMeter(DECREMENT_COLOR_NAME, false);
  };

  const removeMeterBand = (id: number) => {
    setMeterBands((current) => current.filter((band) => band.id !== id));
  };

  const handleIncrementClick = () => {
    onIncrement();
    startBudoMeter();
  };

  const handleDecrementClick = () => {
    onDecrement();
    startDecrementMeter();
  };

  const handleSingleRegIncrementClick = () => {
    onSingleRegIncrement?.();
    startSingleRegMeter();
  };

  const handleSingleRegDecrementClick = () => {
    onSingleRegDecrement?.();
    startDecrementMeter();
  };

  useLayoutEffect(() => {
    if (!isRotated) {
      setRotatedScale(1);
      setRotatedViewportHeight(null);
      return;
    }

    const updateRotatedLayout = () => {
      const viewport = viewportRef.current;
      const panel = panelRef.current;

      if (!viewport || !panel) {
        return;
      }

      const availableWidth = viewport.clientWidth;
      const naturalWidth = panel.offsetWidth;
      const naturalHeight = panel.offsetHeight;

      if (availableWidth <= 0 || naturalWidth <= 0 || naturalHeight <= 0) {
        return;
      }

      const nextScale = availableWidth / naturalHeight;

      setRotatedScale(nextScale);
      setRotatedViewportHeight(naturalWidth * nextScale);
    };

    updateRotatedLayout();

    const observer = new ResizeObserver(() => {
      updateRotatedLayout();
    });

    if (viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

    window.addEventListener("resize", updateRotatedLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRotatedLayout);
    };
  }, [isRotated, showsSingleRegCounter]);

  return (
    <div className={`budo-counter-shell${isRotated ? " budo-counter-shell-rotated" : ""}`}>
      <div className="budo-counter-toolbar">
        <button
          className={`budo-counter-rotate-button${isRotated ? " budo-counter-rotate-button-active" : ""}`}
          type="button"
          onClick={() => setIsRotated((current) => !current)}
          aria-label={isRotated ? "小役カウンターの回転を戻す" : "小役カウンターを左へ90度回転する"}
          aria-pressed={isRotated}
          title={isRotated ? "縦向き表示へ戻す" : "横向き表示にする"}
        >
          <svg
            className="budo-counter-rotate-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M7 7V3L1 9l6 6v-4h4c4.4 0 8 3.6 8 8h3c0-6.1-4.9-11-11-11H7z" />
          </svg>
        </button>
      </div>
      <div
        className="budo-counter-viewport"
        ref={viewportRef}
        style={isRotated && rotatedViewportHeight ? { minHeight: `${rotatedViewportHeight}px` } : undefined}
      >
        <div
          className={`budo-counter-turntable${isRotated ? " budo-counter-turntable-rotated" : ""}`}
          style={
            isRotated
              ? { transform: `translate(-50%, -50%) rotate(-90deg) scale(${rotatedScale})` }
              : undefined
          }
        >
          <div
            className={`budo-counter-motion${panelEffectColorName ? ` budo-counter-panel-tone-${panelEffectColorName}` : ""}`}
            style={
              panelEffectAnimationName
                ? { animation: `${panelEffectAnimationName} 360ms cubic-bezier(0.22, 0.9, 0.28, 1)` }
                : undefined
            }
          >
            {panelEffectColorName && panelEffectSequence > 0 ? (
              <span key={panelEffectSequence} className="budo-counter-panel-flash" aria-hidden="true" />
            ) : null}
            <div
              className={`budo-counter-panel${showsSingleRegCounter ? " budo-counter-panel-with-reg" : ""}`}
              ref={panelRef}
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
                    {meterBands.map((band, index) => (
                      <span
                        key={band.id}
                        className={`budo-counter-meter-fill budo-counter-meter-fill-${band.colorName}`}
                        style={{ gridRow: index + 1 }}
                        onAnimationEnd={() => removeMeterBand(band.id)}
                      />
                    ))}
                  </div>
                </div>
                <output
                  className={`budo-counter-display${displayColorName ? ` budo-counter-display-${displayColorName}` : ""}`}
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
              </div>
              {showsSingleRegCounter ? (
                <div className="budo-counter-action-row budo-counter-action-row-compact">
                  <button
                    className="reg-counter-button reg-counter-button-minus"
                    type="button"
                    onClick={handleSingleRegDecrementClick}
                    aria-label="単独REGを1減算"
                  >
                    <span className="reg-counter-minus-text">-1</span>
                  </button>
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
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
